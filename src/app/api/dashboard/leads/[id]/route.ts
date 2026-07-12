import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getContractByLead, getLead } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const leadId = id as Id<"leads">;
    const lead = await getLead(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const contract = await getContractByLead(leadId);
    return NextResponse.json({ lead, contract });
  } catch (err) {
    console.error("Dashboard get lead error:", err);
    return NextResponse.json(
      { error: "Failed to load lead." },
      { status: 500 },
    );
  }
}
