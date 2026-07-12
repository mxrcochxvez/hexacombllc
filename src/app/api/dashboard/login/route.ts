import { NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: unknown };
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!(await verifyAdminPassword(password))) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 },
      );
    }

    const token = await createAdminSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(adminSessionCookieOptions(token));
    return response;
  } catch (err) {
    console.error("Dashboard login error:", err);
    return NextResponse.json(
      { error: "Login failed. Check ADMIN_PASSWORD is set." },
      { status: 500 },
    );
  }
}
