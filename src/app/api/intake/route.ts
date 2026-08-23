import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/convex";

export const dynamic = "force-dynamic";

let _resend: import("resend").Resend | null = null;

async function getResend(): Promise<import("resend").Resend> {
  if (!_resend) {
    const { Resend } = await import("resend");
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured.");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(body: Record<string, unknown>): string {
  const {
    name,
    email,
    phone,
    business,
    industry,
    hasExistingWebsite,
    website,
    goal,
    pageCount,
    visitors,
    features,
    timeline,
    notes,
  } = body;

  const featuresArr = Array.isArray(features) ? (features as string[]) : [];

  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:10px 12px;font-weight:600;vertical-align:top;white-space:nowrap;color:#333;border-bottom:1px solid #eee">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;color:#555;border-bottom:1px solid #eee">${escapeHtml(value)}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#333;line-height:1.6;max-width:640px;margin:0 auto;padding:20px">

  <h2 style="color:#333;border-bottom:2px solid #8B4513;padding-bottom:8px;margin-bottom:24px">
    New Project Inquiry
  </h2>

  <h3 style="color:#555;margin:20px 0 12px">Contact Information</h3>
  <table style="border-collapse:collapse;width:100%">
    ${row("Name", String(name ?? ""))}
    ${row("Email", String(email ?? ""))}
    ${row("Phone", String(phone ?? ""))}
  </table>

  <h3 style="color:#555;margin:24px 0 12px">Project Details</h3>
  <table style="border-collapse:collapse;width:100%">
    ${row("Business", String(business || "N/A"))}
    ${row("Industry", String(industry || "N/A"))}
    ${row("Existing Website", String(hasExistingWebsite || "N/A"))}
    ${String(website || "").trim() ? row("Website URL", String(website)) : ""}
    ${row("Primary Goal", String(goal || "N/A"))}
    ${row("Page Count", String(pageCount || "N/A"))}
    ${row("Monthly Visitors", String(visitors || "N/A"))}
    ${
      featuresArr.length > 0
        ? `<tr>
            <td style="padding:10px 12px;font-weight:600;vertical-align:top;white-space:nowrap;color:#333;border-bottom:1px solid #eee">Features Needed</td>
            <td style="padding:10px 12px;color:#555;border-bottom:1px solid #eee">${featuresArr.map(escapeHtml).join("<br>")}</td>
          </tr>`
        : ""
    }
  </table>

  <h3 style="color:#555;margin:24px 0 12px">Timeline</h3>
  <table style="border-collapse:collapse;width:100%">
    ${row("Timeline", String(timeline || "N/A"))}
  </table>

  ${
    String(notes ?? "").trim()
      ? `<h3 style="color:#555;margin:24px 0 12px">Additional Notes</h3>
         <p style="background:#f9f7f5;padding:12px 16px;border-radius:6px;white-space:pre-wrap;color:#555;margin:0">${escapeHtml(String(notes))}</p>`
      : ""
  }

  <hr style="margin:32px 0 16px;border:none;border-top:1px solid #eee">
  <p style="font-size:12px;color:#999">Submitted via the Hexacomb project intake form.</p>

</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { name, email, phone, turnstileToken } = body;

    // ── Validate required fields ────────────────────────────────
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (
      !phone ||
      typeof phone !== "string" ||
      !/^[\d\s\-\+\(\)\.]+$/.test(phone.trim()) ||
      phone.replace(/\D/g, "").length < 10
    ) {
      return NextResponse.json(
        { error: "A valid phone number is required." },
        { status: 400 }
      );
    }

    if (typeof turnstileToken !== "string" || !turnstileToken) {
      return NextResponse.json(
        { error: "Security check required." },
        { status: 400 }
      );
    }

    // ── Verify Turnstile token ──────────────────────────────────
    const turnstileFormData = new FormData();
    turnstileFormData.append("secret", process.env.TURNSTILE_SECRET_KEY!);
    turnstileFormData.append("response", turnstileToken);
    const clientIp = request.headers.get("cf-connecting-ip");
    if (clientIp) {
      turnstileFormData.append("remoteip", clientIp);
    }

    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: turnstileFormData }
    );
    const turnstileData = (await turnstileRes.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!turnstileData.success) {
      return NextResponse.json(
        { error: "Security check failed. Please try again." },
        { status: 400 }
      );
    }

    const features = Array.isArray(body.features)
      ? body.features.filter((f: unknown): f is string => typeof f === "string")
      : undefined;

    await createLead({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      business: typeof body.business === "string" ? body.business : undefined,
      website: typeof body.website === "string" ? body.website : undefined,
      source: "intake",
      industry: typeof body.industry === "string" ? body.industry : undefined,
      hasExistingWebsite:
        typeof body.hasExistingWebsite === "string"
          ? body.hasExistingWebsite
          : undefined,
      goal: typeof body.goal === "string" ? body.goal : undefined,
      pageCount: typeof body.pageCount === "string" ? body.pageCount : undefined,
      visitors: typeof body.visitors === "string" ? body.visitors : undefined,
      features,
      timeline: typeof body.timeline === "string" ? body.timeline : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    });

    // ── Send email via Resend ───────────────────────────────────
    const resend = await getResend();
    const { error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ?? "Hexacomb <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL ?? "marcode.chavez.jr@gmail.com"],
      subject: `New Project Inquiry from ${name.trim()}`,
      html: buildEmailHtml(body),
      replyTo: email.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send inquiry. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Intake form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
