import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { revokeBlogApiKey, type Id } from "@/lib/convex";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await revokeBlogApiKey(id as Id<"blogApiKeys">);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to revoke API key." }, { status: 400 });
  }
}
