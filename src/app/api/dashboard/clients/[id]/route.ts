import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getClient, updateClient } from "@/lib/convex";
import { isClientPhase, type ClientPhase } from "@/lib/statuses";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function readOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const detail = await getClient(id as Id<"clients">);
    if (!detail) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch (err) {
    console.error("Dashboard get client error:", err);
    return NextResponse.json(
      { error: "Failed to load client." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name =
      typeof body.name === "string" ? body.name.trim() : undefined;
    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 },
      );
    }

    let phase: ClientPhase | undefined;
    if (body.phase !== undefined) {
      if (typeof body.phase !== "string" || !isClientPhase(body.phase)) {
        return NextResponse.json(
          { error: "Invalid project phase." },
          { status: 400 },
        );
      }
      phase = body.phase;
    }

    const client = await updateClient({
      clientId: id as Id<"clients">,
      name,
      phase,
      designReviewUrl: readOptionalString(body.designReviewUrl),
      productionUrl: readOptionalString(body.productionUrl),
      goalsSummary: readOptionalString(body.goalsSummary),
    });

    return NextResponse.json({ success: true, client });
  } catch (err) {
    console.error("Dashboard update client error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to update client.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
