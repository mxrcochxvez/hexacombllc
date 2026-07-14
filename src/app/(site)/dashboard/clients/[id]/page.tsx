import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  listDesignDemoCommentsForClient,
  listDesignDemosForClient,
  prepareClientDetail,
} from "@/lib/convex";
import { DashboardClientDetail } from "@/components/DashboardClientDetail";
import type { ClientPhase, DesignDemoStatus } from "@/lib/statuses";

export const metadata: Metadata = {
  title: "Client",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function DashboardClientPage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const clientId = id as Id<"clients">;

  let detail;
  let demos;
  let demoComments;
  try {
    detail = await prepareClientDetail(clientId);
    if (!detail) {
      notFound();
    }
    [demos, demoComments] = await Promise.all([
      listDesignDemosForClient(clientId),
      listDesignDemoCommentsForClient(clientId),
    ]);
  } catch (err) {
    console.error("Dashboard client detail failed:", err);
    notFound();
  }

  if (!detail || !demos || !demoComments) {
    notFound();
  }

  const feedbackPath = detail.client.feedbackToken
    ? `/feedback/${detail.client.feedbackToken}`
    : "";

  return (
    <div className="dash-page">
      <DashboardClientDetail
        client={{
          _id: detail.client._id,
          leadId: detail.client.leadId,
          name: detail.client.name,
          email: detail.client.email,
          phase: detail.client.phase as ClientPhase,
          designReviewUrl: detail.client.designReviewUrl,
          productionUrl: detail.client.productionUrl,
          goalsSummary: detail.client.goalsSummary,
          feedbackToken: detail.client.feedbackToken,
          createdAt: detail.client.createdAt,
        }}
        lead={{
          _id: detail.lead._id,
          name: detail.lead.name,
          email: detail.lead.email,
          phone: detail.lead.phone,
          business: detail.lead.business,
          website: detail.lead.website,
        }}
        notes={detail.notes.map((note) => ({
          _id: note._id,
          clientId: note.clientId,
          parentId: note.parentId,
          body: note.body,
          createdAt: note.createdAt,
        }))}
        feedback={detail.feedback.map((item) => ({
          _id: item._id,
          message: item.message,
          rating: item.rating,
          submitterName: item.submitterName,
          createdAt: item.createdAt,
        }))}
        demos={demos.map((demo) => ({
          _id: demo._id,
          title: demo.title,
          demoUrl: demo.demoUrl,
          accessToken: demo.accessToken,
          status: demo.status as DesignDemoStatus,
          sentAt: demo.sentAt,
          createdAt: demo.createdAt,
        }))}
        demoComments={demoComments.map((comment) => ({
          _id: comment._id,
          demoId: comment.demoId,
          body: comment.body,
          submitterName: comment.submitterName,
          createdAt: comment.createdAt,
        }))}
        feedbackPath={feedbackPath}
      />
    </div>
  );
}
