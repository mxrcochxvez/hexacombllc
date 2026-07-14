import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClientFeedbackByToken } from "@/lib/convex";
import { ClientFeedbackForm } from "@/components/ClientFeedbackForm";

export const metadata: Metadata = {
  title: "Share feedback",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

export default async function FeedbackPage({ params }: PageProps) {
  const { token } = await params;

  let info;
  try {
    info = await getClientFeedbackByToken(token);
  } catch (err) {
    console.error("Feedback page load failed:", err);
    notFound();
  }

  if (!info) {
    notFound();
  }

  return <ClientFeedbackForm token={token} clientName={info.clientName} />;
}
