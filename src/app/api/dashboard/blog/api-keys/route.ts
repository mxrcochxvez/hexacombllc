import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { generateBlogApiKey, hashBlogApiKey } from "@/lib/blogApiKey";
import { createBlogApiKey, listBlogApiKeys } from "@/lib/convex";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const keys = await listBlogApiKeys();
    return NextResponse.json({
      keys: keys.map((key) => ({
        _id: key._id,
        name: key.name,
        keyPrefix: key.keyPrefix,
        canPublish: key.canPublish,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        revokedAt: key.revokedAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load API keys." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "Give this key a name." }, { status: 400 });
    const apiKey = generateBlogApiKey();
    const keyHash = await hashBlogApiKey(apiKey);
    const keyId = await createBlogApiKey({
      name,
      keyHash,
      keyPrefix: `${apiKey.slice(0, 12)}…`,
      canPublish: body.canPublish === true,
    });
    return NextResponse.json({ success: true, keyId, apiKey });
  } catch (error) {
    console.error("Create blog API key error:", error);
    return NextResponse.json({ error: "Failed to create API key." }, { status: 500 });
  }
}
