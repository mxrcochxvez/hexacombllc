import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import {
  getLeadsByEmail,
  syncLeadStatusFromExternal,
} from "@/lib/convex";
import {
  verifySystemeWebhookSignature,
} from "@/lib/systeme";
import { statusFromLeadTag } from "@/lib/systemeMap";

export const dynamic = "force-dynamic";

type SystemeTagPayload = { id?: number; name?: string };

type SystemeContactPayload = {
  id?: number;
  email?: string;
  fields?: Array<{ slug?: string; value?: string | null }>;
};

type WebhookBody = {
  contact?: SystemeContactPayload | { contact?: SystemeContactPayload };
  tag?: SystemeTagPayload;
};

function unwrapContact(
  body: WebhookBody,
): SystemeContactPayload | null {
  if (!body.contact) return null;
  if ("email" in body.contact && typeof body.contact.email === "string") {
    return body.contact;
  }
  if (
    "contact" in body.contact &&
    body.contact.contact &&
    typeof body.contact.contact === "object"
  ) {
    return body.contact.contact;
  }
  return null;
}

function leadIdFromFields(
  contact: SystemeContactPayload,
): Id<"leads"> | null {
  const field = contact.fields?.find((f) => f.slug === "hexacomb_lead_id");
  const value = field?.value?.trim();
  if (!value) return null;
  return value as Id<"leads">;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const event = request.headers.get("x-webhook-event") ?? "";

  const valid = await verifySystemeWebhookSignature(rawBody, signature);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (
    event !== "CONTACT_TAG_ADDED" &&
    event !== "CONTACT_TAG_REMOVED"
  ) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Only stage-tag additions drive Convex status; removals are informational.
  if (event === "CONTACT_TAG_REMOVED") {
    return NextResponse.json({ ok: true });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(rawBody) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tagName = body.tag?.name?.trim();
  if (!tagName) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const status = statusFromLeadTag(tagName);
  if (!status) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const contact = unwrapContact(body);
  if (!contact) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    const fromField = leadIdFromFields(contact);
    if (fromField) {
      await syncLeadStatusFromExternal(fromField, status);
      return NextResponse.json({ ok: true, leadId: fromField, status });
    }

    const email = contact.email?.trim();
    if (!email) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const leads = await getLeadsByEmail(email);
    const lead = leads[0];
    if (!lead) {
      console.warn(
        `Systeme webhook: no Convex lead for ${email} (tag ${tagName})`,
      );
      return NextResponse.json({ ok: true, unmatched: true });
    }

    await syncLeadStatusFromExternal(lead._id, status);
    return NextResponse.json({ ok: true, leadId: lead._id, status });
  } catch (err) {
    console.error("Systeme webhook handler error:", err);
    return NextResponse.json(
      { error: "Failed to sync lead status" },
      { status: 500 },
    );
  }
}
