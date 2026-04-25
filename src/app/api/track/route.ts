import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface TrackPayload {
  event: string;
  properties?: Record<string, unknown>;
  url?: string;
  referrer?: string;
  timestamp?: number;
}

/**
 * Lightweight event ingestion endpoint.
 *
 * Currently logs events to the worker console. To persist data, extend
 * this route to write into:
 *   - Cloudflare Analytics Engine (recommended)
 *   - Cloudflare D1 (SQLite)
 *   - Cloudflare R2 (object storage)
 *   - A third-party analytics API
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackPayload;

    if (!body.event || typeof body.event !== "string") {
      return NextResponse.json(
        { error: "Event name is required." },
        { status: 400 }
      );
    }

    const clientIp = request.headers.get("cf-connecting-ip");
    const country = request.headers.get("cf-ipcountry");

    const enriched = {
      ...body,
      ip: clientIp,
      country,
      userAgent: request.headers.get("user-agent"),
    };

    // Log to worker console (visible in Cloudflare dashboard Logs)
    console.log("[analytics]", JSON.stringify(enriched));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid payload." },
      { status: 400 }
    );
  }
}
