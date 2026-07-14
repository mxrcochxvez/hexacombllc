import { NextRequest, NextResponse } from "next/server";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  createDesignDemo,
  listDesignDemosForClient,
} from "@/lib/convex";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const demos = await listDesignDemosForClient(id as Id<"clients">);
    return NextResponse.json({ demos });
  } catch (err) {
    console.error("Dashboard list design demos error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to load design demos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const demoUrl =
      typeof body.demoUrl === "string" ? body.demoUrl.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 },
      );
    }
    if (!demoUrl) {
      return NextResponse.json(
        { error: "Demo URL is required." },
        { status: 400 },
      );
    }

    const demo = await createDesignDemo({
      clientId: id as Id<"clients">,
      title,
      demoUrl,
    });

    return NextResponse.json({ success: true, demo });
  } catch (err) {
    console.error("Dashboard create design demo error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create design demo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
