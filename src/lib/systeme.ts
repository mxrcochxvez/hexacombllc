import type { LeadCreateInput } from "@/lib/convex";
import type { LeadStatus } from "@/lib/statuses";
import {
  LEAD_STATUS_TAGS,
  SOURCE_TAGS,
  SYSTEME_FIELD_DEFS,
  splitName,
  type LeadSourceTag,
} from "@/lib/systemeMap";

const SYSTEME_API_BASE = "https://api.systeme.io/api";

type SystemeField = { slug: string; value: string | null };
type SystemeTag = { id: number; name: string };
type SystemeContact = {
  id: number;
  email: string;
  fields?: Array<{ slug: string; value: string | null }>;
  tags?: SystemeTag[];
};

type Paginated<T> = { items: T[]; hasMore: boolean };

let tagCache: Map<string, number> | null = null;
let fieldsEnsured = false;

function getApiKey(): string | null {
  const key = process.env.SYSTEME_API_KEY?.trim();
  return key || null;
}

function isConfigured(): boolean {
  return getApiKey() !== null;
}

async function systemeFetch(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<Response> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("SYSTEME_API_KEY is not configured.");
  }

  const headers = new Headers(init?.headers);
  headers.set("X-API-Key", apiKey);
  headers.set("Accept", "application/json");

  let body = init?.body;
  if (init?.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }

  return await fetch(`${SYSTEME_API_BASE}${path}`, {
    method: init?.method,
    headers,
    body,
    signal: init?.signal,
  });
}

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Systeme API ${res.status}: ${text.slice(0, 500)}`);
  }
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

async function listAllTags(): Promise<SystemeTag[]> {
  const tags: SystemeTag[] = [];
  let startingAfter: number | undefined;
  for (let i = 0; i < 20; i++) {
    const params = new URLSearchParams({ limit: "100", order: "asc" });
    if (startingAfter !== undefined) {
      params.set("startingAfter", String(startingAfter));
    }
    const res = await systemeFetch(`/tags?${params}`);
    const page = await readJson<Paginated<SystemeTag>>(res);
    tags.push(...page.items);
    if (!page.hasMore || page.items.length === 0) break;
    startingAfter = page.items[page.items.length - 1]?.id;
  }
  return tags;
}

async function createTag(name: string): Promise<SystemeTag | null> {
  const res = await systemeFetch("/tags", {
    method: "POST",
    json: { name },
  });
  if (res.status === 422 || res.status === 400) {
    const text = await res.text();
    console.warn(`Systeme tag create skipped for "${name}":`, text.slice(0, 300));
    return null;
  }
  return await readJson<SystemeTag>(res);
}

async function ensureTagId(name: string): Promise<number | null> {
  if (!tagCache) {
    const tags = await listAllTags();
    tagCache = new Map(tags.map((t) => [t.name, t.id]));
  }
  const cached = tagCache.get(name);
  if (cached !== undefined) return cached;

  const created = await createTag(name);
  if (!created) return null;
  tagCache.set(created.name, created.id);
  return created.id;
}

async function ensureCustomFields(): Promise<void> {
  if (fieldsEnsured) return;
  fieldsEnsured = true;

  const res = await systemeFetch("/contact_fields");
  const page = await readJson<Paginated<{ slug: string }>>(res);
  const existing = new Set(page.items.map((f) => f.slug));

  for (const field of SYSTEME_FIELD_DEFS) {
    if (existing.has(field.slug)) continue;
    const createRes = await systemeFetch("/contact_fields", {
      method: "POST",
      json: { fieldName: field.fieldName, slug: field.slug },
    });
    if (!createRes.ok) {
      const text = await createRes.text();
      console.warn(
        `Systeme contact field "${field.slug}" create skipped:`,
        text.slice(0, 300),
      );
    }
  }
}

async function findContactByEmail(
  email: string,
): Promise<SystemeContact | null> {
  const params = new URLSearchParams({
    email: email.trim().toLowerCase(),
    limit: "10",
  });
  const res = await systemeFetch(`/contacts?${params}`);
  const page = await readJson<Paginated<SystemeContact>>(res);
  return (
    page.items.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase(),
    ) ?? null
  );
}

async function assignTag(contactId: number, tagId: number): Promise<void> {
  const res = await systemeFetch(`/contacts/${contactId}/tags`, {
    method: "POST",
    json: { tagId },
  });
  // 422 often means already assigned — treat as success
  if (!res.ok && res.status !== 422 && res.status !== 409) {
    const text = await res.text();
    throw new Error(`Assign tag failed: ${text.slice(0, 300)}`);
  }
}

async function removeTag(contactId: number, tagId: number): Promise<void> {
  const res = await systemeFetch(`/contacts/${contactId}/tags/${tagId}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    console.warn(`Remove tag failed:`, text.slice(0, 300));
  }
}

async function setExclusiveLeadStatusTag(
  contactId: number,
  status: LeadStatus,
): Promise<void> {
  // Refresh cache so we only touch tags that already exist on the account.
  const tags = await listAllTags();
  tagCache = new Map(tags.map((t) => [t.name, t.id]));

  const desiredName = LEAD_STATUS_TAGS[status];
  let desiredId = tagCache.get(desiredName) ?? null;
  if (desiredId === null) {
    desiredId = await ensureTagId(desiredName);
  }

  for (const [statusKey, tagName] of Object.entries(LEAD_STATUS_TAGS)) {
    if (statusKey === status) continue;
    const otherId = tagCache.get(tagName);
    if (otherId !== undefined) {
      await removeTag(contactId, otherId);
    }
  }

  if (desiredId !== null) {
    await assignTag(contactId, desiredId);
  }
}

function buildFieldsFromLead(
  input: LeadCreateInput,
  extras: {
    leadId?: string;
    status: LeadStatus;
    temperature: "cool" | "warm";
  },
): SystemeField[] {
  const { firstName, surname } = splitName(input.name);
  const fields: SystemeField[] = [
    { slug: "first_name", value: firstName || null },
    { slug: "surname", value: surname || null },
    { slug: "phone_number", value: input.phone?.trim() || null },
    { slug: "company_name", value: input.business?.trim() || null },
    { slug: "website", value: input.website?.trim() || null },
    { slug: "industry", value: input.industry?.trim() || null },
    {
      slug: "has_existing_website",
      value: input.hasExistingWebsite?.trim() || null,
    },
    { slug: "goal", value: input.goal?.trim() || null },
    { slug: "page_count", value: input.pageCount?.trim() || null },
    { slug: "visitors", value: input.visitors?.trim() || null },
    {
      slug: "features",
      value: input.features?.length ? input.features.join(", ") : null,
    },
    { slug: "timeline", value: input.timeline?.trim() || null },
    { slug: "notes", value: input.notes?.trim() || null },
    { slug: "message", value: input.message?.trim() || null },
    { slug: "temperature", value: extras.temperature },
    { slug: "hexacomb_status", value: extras.status },
  ];
  if (extras.leadId) {
    fields.push({ slug: "hexacomb_lead_id", value: extras.leadId });
  }
  return fields.filter((f) => f.value !== null && f.value !== "");
}

/**
 * Upsert a systeme.io contact for a Hexacomb lead and apply source + stage tags.
 * Failures are logged and swallowed so form/email flows stay resilient.
 */
export async function syncLeadToSysteme(opts: {
  lead: LeadCreateInput;
  leadId: string | null;
  status?: LeadStatus;
}): Promise<number | null> {
  if (!isConfigured()) {
    return null;
  }

  try {
    await ensureCustomFields();

    const status = opts.status ?? "fresh";
    const temperature = opts.lead.source === "intake" ? "warm" : "cool";
    const fields = buildFieldsFromLead(opts.lead, {
      leadId: opts.leadId ?? undefined,
      status,
      temperature,
    });

    const email = opts.lead.email.trim().toLowerCase();
    let contact = await findContactByEmail(email);

    if (contact) {
      const res = await systemeFetch(`/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/merge-patch+json" },
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update contact failed: ${text.slice(0, 300)}`);
      }
    } else {
      const res = await systemeFetch("/contacts", {
        method: "POST",
        json: { email, locale: "en", fields },
      });
      contact = await readJson<SystemeContact>(res);
    }

    const sourceKey = opts.lead.source as LeadSourceTag;
    const sourceTagId = await ensureTagId(SOURCE_TAGS[sourceKey]);
    if (sourceTagId !== null) {
      await assignTag(contact.id, sourceTagId);
    }

    await setExclusiveLeadStatusTag(contact.id, status);
    return contact.id;
  } catch (err) {
    console.error("Systeme lead sync failed:", err);
    return null;
  }
}

/**
 * Move a contact's pipeline stage tags (and hexacomb_status field) by email.
 */
export async function setSystemeLeadStatus(opts: {
  email: string;
  status: LeadStatus;
  leadId?: string;
}): Promise<void> {
  if (!isConfigured()) return;

  try {
    await ensureCustomFields();
    const contact = await findContactByEmail(opts.email);
    if (!contact) {
      console.warn(
        `Systeme status sync: no contact for ${opts.email.trim().toLowerCase()}`,
      );
      return;
    }

    const fields: SystemeField[] = [
      { slug: "hexacomb_status", value: opts.status },
    ];
    if (opts.leadId) {
      fields.push({ slug: "hexacomb_lead_id", value: opts.leadId });
    }

    const res = await systemeFetch(`/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Status field patch failed: ${text.slice(0, 300)}`);
    }

    await setExclusiveLeadStatusTag(contact.id, opts.status);
  } catch (err) {
    console.error("Systeme status sync failed:", err);
  }
}

/** PHP-style JSON encode used by systeme.io webhook HMAC. */
export function normalizeSystemeWebhookPayload(payload: unknown): string {
  return JSON.stringify(payload)
    .replace(/\//g, "\\/")
    .replace(/[\u007f-\uffff]/g, (ch) => {
      const hex = ch.codePointAt(0)!.toString(16).padStart(4, "0");
      return `\\u${hex}`;
    });
}

export async function verifySystemeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): Promise<boolean> {
  const secret = process.env.SYSTEME_WEBHOOK_SECRET?.trim();
  if (!secret || !signatureHeader) return false;

  let normalized: string;
  try {
    normalized = normalizeSystemeWebhookPayload(JSON.parse(rawBody));
  } catch {
    normalized = rawBody;
  }

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(normalized));
  const expected = [...new Uint8Array(sigBuf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expected.length !== signatureHeader.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Register (or no-op if unconfigured) the Hexacomb inbound webhook in systeme.io.
 * Call once after deploying with SYSTEME_API_KEY + SYSTEME_WEBHOOK_SECRET set.
 */
export async function registerSystemeWebhook(endpointUrl: string): Promise<boolean> {
  if (!isConfigured()) return false;
  const secret = process.env.SYSTEME_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.warn("SYSTEME_WEBHOOK_SECRET missing; skip webhook registration.");
    return false;
  }

  try {
    const res = await systemeFetch("/webhooks", {
      method: "POST",
      json: {
        name: "Hexacomb lead sync",
        url: endpointUrl,
        secret: secret,
        subscriptions: ["CONTACT_TAG_ADDED", "CONTACT_TAG_REMOVED"],
      },
    });
    if (!res.ok) {
      // Some API versions use secretToken instead of secret — retry once.
      const retry = await systemeFetch("/webhooks", {
        method: "POST",
        json: {
          name: "Hexacomb lead sync",
          url: endpointUrl,
          secretToken: secret,
          subscriptions: ["CONTACT_TAG_ADDED", "CONTACT_TAG_REMOVED"],
        },
      });
      if (!retry.ok) {
        const text = await retry.text();
        console.error("Systeme webhook register failed:", text.slice(0, 500));
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error("Systeme webhook register error:", err);
    return false;
  }
}

export { isConfigured as isSystemeConfigured };
