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
    <main id="main-content" className="growth-page growth-intake">
      <div className="growth-shell growth-intake-grid">
      <div className="growth-intake-copy">
        <h1>Put the website on our desk.</h1>
        <p>Give us the business context once. We&rsquo;ll use it to shape the site, the search strategy, and the work ahead.</p>
        <small>About 3–5 minutes.</small>
      </div>
      <div className="growth-intake-form"><IntakeForm /></div>
      </div>
    </main>
  );
}
