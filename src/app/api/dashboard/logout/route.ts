import { NextResponse } from "next/server";
import { clearAdminSessionCookieOptions } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(clearAdminSessionCookieOptions());
  return response;
}
