import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { ensureClientsForContracted, listClients } from "@/lib/convex";

export const dynamic = "force-dynamic";

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
