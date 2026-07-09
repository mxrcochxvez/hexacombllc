import type { Metadata } from "next";
import { IntakeForm } from "@/components/IntakeForm";

export const metadata: Metadata = {
  title: "Project Intake | Hexacomb",
  description:
    "Tell us about your project so we can provide a tailored recommendation.",
  robots: { index: false, follow: false },
};

export default function IntakePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Tell us about your project
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          Fill out the details below so we can understand your needs and put
          together a tailored plan. This usually takes about 3&ndash;5 minutes.
        </p>
      </div>
      <IntakeForm />
    </main>
  );
}
