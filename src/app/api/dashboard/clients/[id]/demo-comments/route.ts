import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { listDesignDemoCommentsForClient } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const comments = await listDesignDemoCommentsForClient(
      id as Id<"clients">,
    );
    return NextResponse.json({ comments });
  } catch (err) {
    console.error("Dashboard list design demo comments error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to load comments.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
