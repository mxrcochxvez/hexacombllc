let _resend: import("resend").Resend | null = null;

export async function getResend(): Promise<import("resend").Resend> {
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

export function contactFromEmail(): string {
  return process.env.CONTACT_FROM_EMAIL ?? "Hexacomb <onboarding@resend.dev>";
}

export function contactToEmail(): string {
  return process.env.CONTACT_TO_EMAIL ?? "marcode.chavez.jr@gmail.com";
}

export function siteBaseUrl(requestUrl?: string): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (requestUrl) {
    try {
      const url = new URL(requestUrl);
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        return url.origin;
      }
    } catch {
      // fall through
    }
  }
  return "https://hexacombllc.com";
}

export async function sendContractInviteEmail(opts: {
  to: string;
  leadName: string;
  clientName: string;
  contractUrl: string;
}): Promise<void> {
  const resend = await getResend();
  const { error } = await resend.emails.send({
    from: contactFromEmail(),
    to: [opts.to],
    subject: "Your Hexacomb website agreement",
    html: `<p>Hi ${escapeHtml(opts.leadName)},</p>
<p>Your website agreement for <strong>${escapeHtml(opts.clientName)}</strong> is ready to review and accept.</p>
<p><a href="${escapeHtml(opts.contractUrl)}">Review and accept the agreement</a></p>
<p>If the link does not work, copy and paste this URL into your browser:<br/>
${escapeHtml(opts.contractUrl)}</p>
<p>— Hexacomb LLC</p>`,
  });
  if (error) {
    console.error("Resend contract invite error:", error);
    throw new Error("Failed to send agreement email.");
  }
}

export async function sendContractSignedNotification(opts: {
  leadName: string;
  leadEmail: string;
  clientName: string;
  maintenanceFeeMonthly: number;
  dashboardUrl: string;
}): Promise<void> {
  const resend = await getResend();
  const { error } = await resend.emails.send({
    from: contactFromEmail(),
    to: [contactToEmail()],
    subject: `Agreement signed: ${opts.clientName}`,
    html: `<h2>Website agreement signed</h2>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:8px;font-weight:bold">Lead</td><td style="padding:8px">${escapeHtml(opts.leadName)}</td></tr>
<tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${escapeHtml(opts.leadEmail)}</td></tr>
<tr><td style="padding:8px;font-weight:bold">Client</td><td style="padding:8px">${escapeHtml(opts.clientName)}</td></tr>
<tr><td style="padding:8px;font-weight:bold">Maintenance fee</td><td style="padding:8px">$${opts.maintenanceFeeMonthly.toFixed(2)}/mo</td></tr>
</table>
<p><a href="${escapeHtml(opts.dashboardUrl)}">Open lead in dashboard</a></p>`,
  });
  if (error) {
    console.error("Resend signed notification error:", error);
    throw new Error("Failed to send signed notification email.");
  }
}

export async function sendDesignDemoInviteEmail(opts: {
  to: string;
  leadName: string;
  clientName: string;
  title: string;
  reviewUrl: string;
}): Promise<void> {
  const resend = await getResend();
  const { error } = await resend.emails.send({
    from: contactFromEmail(),
    to: [opts.to],
    subject: `Design review ready: ${opts.title}`,
    html: `<p>Hi ${escapeHtml(opts.leadName)},</p>
<p>A new design preview for <strong>${escapeHtml(opts.clientName)}</strong> is ready for your feedback.</p>
<p><strong>${escapeHtml(opts.title)}</strong></p>
<p>Open the review link, click anywhere on the preview, and leave a comment.</p>
<p><a href="${escapeHtml(opts.reviewUrl)}">Review the design preview</a></p>
<p>If the link does not work, copy and paste this URL into your browser:<br/>
${escapeHtml(opts.reviewUrl)}</p>
<p>— Hexacomb LLC</p>`,
  });
  if (error) {
    console.error("Resend design demo invite error:", error);
    throw new Error("Failed to send design review email.");
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
