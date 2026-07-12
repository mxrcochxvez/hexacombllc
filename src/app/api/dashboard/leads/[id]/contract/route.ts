import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { upsertContractDraft } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function readOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const clientName =
      typeof body.clientName === "string" ? body.clientName.trim() : "";
    const hexacombSignerName =
      typeof body.hexacombSignerName === "string"
        ? body.hexacombSignerName.trim()
        : "";
    const hexacombSignerTitle =
      typeof body.hexacombSignerTitle === "string"
        ? body.hexacombSignerTitle.trim()
        : "";
    const maintenanceFeeMonthly = Number(body.maintenanceFeeMonthly);

    if (!clientName || !hexacombSignerName || !hexacombSignerTitle) {
      return NextResponse.json(
        { error: "Client name and Hexacomb signer fields are required." },
        { status: 400 },
      );
    }
    if (!Number.isFinite(maintenanceFeeMonthly) || maintenanceFeeMonthly < 0) {
      return NextResponse.json(
        { error: "Maintenance fee must be a non-negative number." },
        { status: 400 },
      );
    }

    const contractId = await upsertContractDraft({
      leadId: id as Id<"leads">,
      clientName,
      maintenanceFeeMonthly,
      agreementDate: readOptionalString(body.agreementDate),
      hexacombSignerName,
      hexacombSignerTitle,
      hexacombSignedAt: readOptionalString(body.hexacombSignedAt),
    });

    return NextResponse.json({ success: true, contractId });
  } catch (err) {
    console.error("Dashboard upsert contract error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to save contract draft.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
