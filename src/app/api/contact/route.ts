import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, business, website, turnstileToken } = body;

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

    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Security check required." },
        { status: 400 }
      );
    }

    const turnstileFormData = new FormData();
    turnstileFormData.append(
      "secret",
      process.env.TURNSTILE_SECRET_KEY!
    );
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

    const { error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ?? "Hexacomb <onboarding@resend.dev>",
      to: [
        process.env.CONTACT_TO_EMAIL ?? "marcode.chavez.jr@gmail.com",
      ],
      subject: `New Application from ${name.trim()}`,
      html: `<h2>New Early-Adopter Application</h2>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name.trim()}</td></tr>
<tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email.trim()}</td></tr>
<tr><td style="padding:8px;font-weight:bold">Business</td><td style="padding:8px">${(business || "N/A").trim()}</td></tr>
<tr><td style="padding:8px;font-weight:bold">Website</td><td style="padding:8px">${(website || "N/A").trim()}</td></tr>
</table>`,
      replyTo: email.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
