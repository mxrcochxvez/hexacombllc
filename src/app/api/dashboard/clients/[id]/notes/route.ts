import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { addClientNote } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const noteBody =
      typeof body.body === "string" ? body.body.trim() : "";
    if (!noteBody) {
      return NextResponse.json(
        { error: "Note body is required." },
        { status: 400 },
      );
    }

    const parentId =
      typeof body.parentId === "string" && body.parentId
        ? (body.parentId as Id<"clientNotes">)
        : undefined;

    const note = await addClientNote({
      clientId: id as Id<"clients">,
      body: noteBody,
      parentId,
    });

    return NextResponse.json({ success: true, note });
  } catch (err) {
    console.error("Dashboard add client note error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to add note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
