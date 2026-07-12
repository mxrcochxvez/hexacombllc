import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { listLeads } from "@/lib/convex";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await listLeads({ limit: 100 });
    return NextResponse.json({ leads });
  } catch (err) {
    console.error("Dashboard list leads error:", err);
    return NextResponse.json(
      { error: "Failed to load leads." },
      { status: 500 },
    );
  }
}
