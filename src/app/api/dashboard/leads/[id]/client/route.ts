import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { promoteLeadToClient } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const result = await promoteLeadToClient(id as Id<"leads">);
    return NextResponse.json({
      success: true,
      clientId: result.clientId,
      leadId: result.leadId,
    });
  } catch (err) {
    console.error("Dashboard promote lead to client error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to promote lead.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
