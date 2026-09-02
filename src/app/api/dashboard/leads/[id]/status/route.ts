import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import {
  canTransitionLeadStatus,
  isLeadStatus,
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "@/lib/statuses";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getLead, updateLeadStatus } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = (await request.json()) as { status?: unknown };
    if (typeof body.status !== "string" || !isLeadStatus(body.status)) {
      return NextResponse.json(
        { error: "Invalid status value." },
        { status: 400 },
      );
    }

    const leadId = id as Id<"leads">;
    const lead = await getLead(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const from = lead.status as LeadStatus;
    const to = body.status;
    if (!canTransitionLeadStatus(from, to)) {
      return NextResponse.json(
        {
          error: `Cannot change status from ${LEAD_STATUS_LABELS[from]} to ${LEAD_STATUS_LABELS[to]}.`,
        },
        { status: 400 },
      );
    }

    await updateLeadStatus(leadId, to);

    const { setSystemeLeadStatus } = await import("@/lib/systeme");
    await setSystemeLeadStatus({
      email: lead.email,
      status: to,
      leadId,
    });

    return NextResponse.json({ success: true, status: to });
  } catch (err) {
    console.error("Dashboard update status error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to update status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
