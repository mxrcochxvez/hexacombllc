import { NextRequest, NextResponse } from "next/server";
import { getContractByToken } from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  try {
    const contract = await getContractByToken(token);
    if (!contract) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ contract });
  } catch (err) {
    console.error("Get contract by token error:", err);
    return NextResponse.json(
      { error: "Failed to load agreement." },
      { status: 500 },
    );
  }
}
