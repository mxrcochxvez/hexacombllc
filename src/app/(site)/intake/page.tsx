import type { Metadata } from "next";
import { IntakeForm } from "@/components/IntakeForm";

export const metadata: Metadata = {
  title: {
    absolute: "Project Intake | Hexacomb",
  },
  description:
    "Tell us about your project so we can provide a tailored recommendation.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://hexacombllc.com/intake",
  },
};

export default function IntakePage() {
  return (
    <main id="main-content" className="hobro-page">
      <section className="hobro-page-hero">
        <div className="hobro-shell hobro-intake-grid">
          <div className="hobro-intake-copy">
            <p className="hobro-kicker">Intake</p>
            <h1 className="hobro-page-title">Put the website on our desk.</h1>
            <p className="hobro-page-lead">
              Give us the business context once. We&rsquo;ll use it to shape the
              site, the search strategy, and the work ahead.
            </p>
            <small>About 3–5 minutes.</small>
          </div>
          <div className="growth-intake-form">
            <IntakeForm />
          </div>
        </div>
      </section>
    </main>
  );
}
