import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sendDesignDemo } from "@/lib/convex";
import { sendDesignDemoInviteEmail, siteBaseUrl } from "@/lib/email";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string; demoId: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { demoId } = await context.params;
  try {
    const result = await sendDesignDemo(demoId as Id<"designDemos">);
    const base = siteBaseUrl(request.url);
    const reviewUrl = `${base}/review/${result.accessToken}`;

    await sendDesignDemoInviteEmail({
      to: result.clientEmail,
      leadName: result.leadName,
      clientName: result.clientName,
      title: result.title,
      reviewUrl,
    });

    return NextResponse.json({
      success: true,
      demoId: result.demoId,
      accessToken: result.accessToken,
      reviewUrl,
    });
  } catch (err) {
    console.error("Dashboard send design demo error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to send design demo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
