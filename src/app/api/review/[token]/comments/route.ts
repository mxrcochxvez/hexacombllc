import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Id } from "@/lib/convex";
import {
  generateDesignDemoScreenshotUploadUrl,
  getDesignDemoByToken,
  submitDesignDemoComment,
} from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ token: string }> };

type BrowserBinding = {
  quickAction?: (
    action: string,
    options: Record<string, unknown>,
  ) => Promise<ArrayBuffer | Response | Uint8Array | Blob>;
};

async function captureScreenshot(
  demoUrl: string,
): Promise<ArrayBuffer | null> {
  try {
    const { env } = getCloudflareContext();
    const browser = (env as { BROWSER?: BrowserBinding }).BROWSER;
    if (!browser?.quickAction) {
      return null;
    }

    const result = await browser.quickAction("screenshot", {
      url: demoUrl,
      viewport: { width: 1280, height: 800 },
      gotoOptions: { waitUntil: "networkidle2", timeout: 20000 },
    });

    if (result instanceof ArrayBuffer) {
      return result;
    }
    if (result instanceof Uint8Array) {
      return result.buffer.slice(
        result.byteOffset,
        result.byteOffset + result.byteLength,
      ) as ArrayBuffer;
    }
    if (typeof Blob !== "undefined" && result instanceof Blob) {
      return await result.arrayBuffer();
    }
    if (result instanceof Response) {
      return await result.arrayBuffer();
    }
    return null;
  } catch (err) {
    console.error("Design demo screenshot failed:", err);
    return null;
  }
}

async function uploadScreenshot(
  accessToken: string,
  bytes: ArrayBuffer,
): Promise<Id<"_storage"> | undefined> {
  const uploadUrl = await generateDesignDemoScreenshotUploadUrl(accessToken);
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "image/png" },
    body: bytes,
  });
  if (!uploadRes.ok) {
    console.error(
      "Screenshot upload failed:",
      uploadRes.status,
      await uploadRes.text().catch(() => ""),
    );
    return undefined;
  }
  const data = (await uploadRes.json()) as { storageId?: string };
  if (!data.storageId) {
    return undefined;
  }
  return data.storageId as Id<"_storage">;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  try {
    const demo = await getDesignDemoByToken(token);
    if (!demo) {
      return NextResponse.json(
        { error: "Invalid review link." },
        { status: 404 },
      );
    }
    if (demo.status === "closed") {
      return NextResponse.json(
        { error: "This design review is closed." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const message = typeof body.body === "string" ? body.body.trim() : "";
    const xPercent = typeof body.xPercent === "number" ? body.xPercent : NaN;
    const yPercent = typeof body.yPercent === "number" ? body.yPercent : NaN;
    const submitterName =
      typeof body.submitterName === "string"
        ? body.submitterName.trim()
        : undefined;

    if (!message) {
      return NextResponse.json(
        { error: "Comment is required." },
        { status: 400 },
      );
    }
    if (
      !Number.isFinite(xPercent) ||
      !Number.isFinite(yPercent) ||
      xPercent < 0 ||
      xPercent > 100 ||
      yPercent < 0 ||
      yPercent > 100
    ) {
      return NextResponse.json(
        { error: "Click position is invalid." },
        { status: 400 },
      );
    }

    let screenshotStorageId: Id<"_storage"> | undefined;
    const screenshotBytes = await captureScreenshot(demo.demoUrl);
    if (screenshotBytes && screenshotBytes.byteLength > 0) {
      screenshotStorageId = await uploadScreenshot(token, screenshotBytes);
    }

    const comment = await submitDesignDemoComment({
      accessToken: token,
      body: message,
      xPercent,
      yPercent,
      submitterName: submitterName || undefined,
      screenshotStorageId,
    });

    return NextResponse.json({
      success: true,
      comment: {
        _id: comment._id,
        body: comment.body,
        xPercent: comment.xPercent,
        yPercent: comment.yPercent,
        submitterName: comment.submitterName,
        createdAt: comment.createdAt,
      },
    });
  } catch (err) {
    console.error("Design review comment error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to save comment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
