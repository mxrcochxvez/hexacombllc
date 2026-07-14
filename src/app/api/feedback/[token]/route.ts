import { NextRequest, NextResponse } from "next/server";
import {
  getClientFeedbackByToken,
  submitClientFeedback,
} from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  try {
    const info = await getClientFeedbackByToken(token);
    if (!info) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(info);
  } catch (err) {
    console.error("Feedback GET error:", err);
    return NextResponse.json(
      { error: "Failed to load feedback form." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json(
        { error: "Please share a short note about your experience." },
        { status: 400 },
      );
    }

    let rating: number | undefined;
    if (body.rating !== undefined && body.rating !== null && body.rating !== "") {
      const parsed =
        typeof body.rating === "number"
          ? body.rating
          : Number(body.rating);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
        return NextResponse.json(
          { error: "Rating must be a whole number from 1 to 5." },
          { status: 400 },
        );
      }
      rating = parsed;
    }

    const submitterName =
      typeof body.submitterName === "string"
        ? body.submitterName.trim()
        : undefined;

    await submitClientFeedback({
      feedbackToken: token,
      message,
      rating,
      submitterName: submitterName || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback POST error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to submit feedback.";
    const status =
      message === "Invalid feedback link" ||
      message === "Feedback message is required" ||
      message.startsWith("Rating must") ||
      message.startsWith("Feedback is too")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
