import { NextRequest, NextResponse } from "next/server";
import {
  getDesignDemoByToken,
  submitDesignDemoComment,
} from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ token: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  try {
    const demo = await getDesignDemoByToken(token);
    if (!demo) {
      return NextResponse.json(
        { error: "Invalid review link." },
        { status: 404 },
      );
    }
    if (demo.status === "closed") {
      return NextResponse.json(
        { error: "This design review is closed." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const message = typeof body.body === "string" ? body.body.trim() : "";
    const submitterName =
      typeof body.submitterName === "string"
        ? body.submitterName.trim()
        : undefined;

    if (!message) {
      return NextResponse.json(
        { error: "Comment is required." },
        { status: 400 },
      );
    }

    const comment = await submitDesignDemoComment({
      accessToken: token,
      body: message,
      submitterName: submitterName || undefined,
    });

    return NextResponse.json({
      success: true,
      comment: {
        _id: comment._id,
        body: comment.body,
        submitterName: comment.submitterName,
        createdAt: comment.createdAt,
      },
    });
  } catch (err) {
    console.error("Design review comment error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to save comment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
