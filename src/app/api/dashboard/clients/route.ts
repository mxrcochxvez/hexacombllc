import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  createClient,
  ensureClientsForContracted,
  listClients,
} from "@/lib/convex";
import { isClientPhase } from "@/lib/statuses";

export const dynamic = "force-dynamic";

function readOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureClientsForContracted();
    const clients = await listClients({ limit: 100 });
    return NextResponse.json({ clients });
  } catch (err) {
    console.error("Dashboard list clients error:", err);
    return NextResponse.json(
      { error: "Failed to load clients." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    let phase: "design" | "build" | "review" | "live" | "paused" | undefined;
    if (body.phase !== undefined) {
      if (typeof body.phase !== "string" || !isClientPhase(body.phase)) {
        return NextResponse.json(
          { error: "Invalid project phase." },
          { status: 400 },
        );
      }
      phase = body.phase;
    }

    const result = await createClient({
      name,
      email,
      phone: readOptionalString(body.phone),
      business: readOptionalString(body.business),
      goalsSummary: readOptionalString(body.goalsSummary),
      phase,
    });

    return NextResponse.json({
      success: true,
      clientId: result.clientId,
      leadId: result.leadId,
    });
  } catch (err) {
    console.error("Dashboard create client error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create client.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
