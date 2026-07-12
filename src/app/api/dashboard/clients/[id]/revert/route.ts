import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { revertClientToLead } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const result = await revertClientToLead(id as Id<"clients">);
    return NextResponse.json({
      success: true,
      leadId: result.leadId,
    });
  } catch (err) {
    console.error("Dashboard revert client error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to revert client.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
