import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDesignDemoByToken } from "@/lib/convex";
import { DesignReviewViewer } from "@/components/DesignReviewViewer";

export const metadata: Metadata = {
  title: "Design review",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

export default async function DesignReviewPage({ params }: PageProps) {
  const { token } = await params;

  let demo;
  try {
    demo = await getDesignDemoByToken(token);
  } catch (err) {
    console.error("Design review page load failed:", err);
    notFound();
  }

  if (!demo) {
    notFound();
  }

  return (
    <DesignReviewViewer
      token={token}
      title={demo.title}
      demoUrl={demo.demoUrl}
      clientName={demo.clientName}
      status={demo.status}
      initialComments={demo.comments}
    />
  );
}
