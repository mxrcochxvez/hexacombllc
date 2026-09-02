import { NextRequest, NextResponse } from "next/server";
import { acceptContract } from "@/lib/convex";
import { sendContractSignedNotification, siteBaseUrl } from "@/lib/email";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ token: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const clientSignerName =
      typeof body.clientSignerName === "string"
        ? body.clientSignerName.trim()
        : "";
    const clientSignerTitle =
      typeof body.clientSignerTitle === "string"
        ? body.clientSignerTitle.trim()
        : "";
    const clientSignedAt =
      typeof body.clientSignedAt === "string" ? body.clientSignedAt.trim() : "";
    const acceptedTerms = body.acceptedTerms === true;

    if (!clientSignerName || !clientSignerTitle || !clientSignedAt) {
      return NextResponse.json(
        { error: "Name, title, and date are required." },
        { status: 400 },
      );
    }
    if (!acceptedTerms) {
      return NextResponse.json(
        { error: "You must confirm that you have read and agree to the terms." },
        { status: 400 },
      );
    }

    const result = await acceptContract({
      accessToken: token,
      clientSignerName,
      clientSignerTitle,
      clientSignedAt,
      acceptedTerms,
    });

    const base = siteBaseUrl(request.url);
    try {
      await sendContractSignedNotification({
        leadName: result.leadName,
        leadEmail: result.leadEmail,
        clientName: result.clientName,
        maintenanceFeeMonthly: result.maintenanceFeeMonthly,
        dashboardUrl: `${base}/dashboard/leads/${result.leadId}`,
      });
    } catch (emailErr) {
      console.error("Signed notification email failed:", emailErr);
      // Acceptance already saved — do not fail the client response
    }

    const { setSystemeLeadStatus } = await import("@/lib/systeme");
    await setSystemeLeadStatus({
      email: result.leadEmail,
      status: "contracted",
      leadId: result.leadId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Accept contract error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to accept agreement.";
    const status =
      message.includes("already signed") || message.includes("not open")
        ? 409
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
