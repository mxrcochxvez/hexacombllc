import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { closeDesignDemo } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string; demoId: string }> };

export async function PATCH(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { demoId } = await context.params;
  try {
    const demo = await closeDesignDemo(demoId as Id<"designDemos">);
    return NextResponse.json({ success: true, demo });
  } catch (err) {
    console.error("Dashboard close design demo error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to close design demo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
