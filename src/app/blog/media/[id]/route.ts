import { NextRequest } from "next/server";
import { getPublicBlogImage, type Id } from "@/lib/convex";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const image = await getPublicBlogImage(id as Id<"blogImages">);
    if (!image) return new Response("Not found", { status: 404 });
    const file = await fetch(image.url);
    if (!file.ok) return new Response("Not found", { status: 404 });
    return new Response(file.body, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${image.filename.replace(/"/g, "")}"`,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
