import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sendContract } from "@/lib/convex";
import { sendContractInviteEmail, siteBaseUrl } from "@/lib/email";

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
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const maintenanceRaw = body.maintenanceFeeMonthly;
    const maintenanceFeeMonthly =
      maintenanceRaw === undefined ||
      maintenanceRaw === null ||
      maintenanceRaw === ""
        ? undefined
        : Number(maintenanceRaw);

    if (
      maintenanceFeeMonthly !== undefined &&
      (!Number.isFinite(maintenanceFeeMonthly) || maintenanceFeeMonthly < 0)
    ) {
      return NextResponse.json(
        { error: "Maintenance fee must be a non-negative number." },
        { status: 400 },
      );
    }

    const result = await sendContract({
      leadId: id as Id<"leads">,
      clientName: readOptionalString(body.clientName),
      maintenanceFeeMonthly,
      agreementDate: readOptionalString(body.agreementDate),
      hexacombSignerName: readOptionalString(body.hexacombSignerName),
      hexacombSignerTitle: readOptionalString(body.hexacombSignerTitle),
      hexacombSignedAt: readOptionalString(body.hexacombSignedAt),
    });

    const base = siteBaseUrl(request.url);
    const contractUrl = `${base}/contract/${result.accessToken}`;

    await sendContractInviteEmail({
      to: result.leadEmail,
      leadName: result.leadName,
      clientName: result.clientName,
      contractUrl,
    });

    return NextResponse.json({
      success: true,
      contractId: result.contractId,
      accessToken: result.accessToken,
      contractUrl,
    });
  } catch (err) {
    console.error("Dashboard send contract error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to send agreement.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
