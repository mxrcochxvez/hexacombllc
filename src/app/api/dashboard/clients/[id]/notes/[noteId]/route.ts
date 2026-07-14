import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { deleteClientNote } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string; noteId: string }> };

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, noteId } = await context.params;
  try {
    await deleteClientNote({
      clientId: id as Id<"clients">,
      noteId: noteId as Id<"clientNotes">,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Dashboard delete client note error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to delete note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
