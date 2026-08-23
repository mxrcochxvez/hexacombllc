import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin } from "lucide-react";

export default function ProcessSteps() {
  return (
    <section className="growth-proof" aria-labelledby="process-heading">
      <div className="growth-shell proof-layout">
        <div className="report-sheet">
          <h2 id="process-heading">What we see. What it means. What we do next.</h2>
          <div className="report-signal"><strong>See what is happening</strong><p>We review search visibility, website traffic, and how visitors get in touch.</p></div>
          <div className="report-signal"><strong>Pick the next priority</strong><p>We focus on the change most likely to help your business right now.</p></div>
          <div className="report-signal report-signal-active"><strong>Make the update</strong><p>We put the plan into action, so it does not become another thing on your list.</p></div>
        </div>
        <div className="founder-proof">
          <div className="founder-image">
            <Image
              src="/images/marco-portrait.jpg"
              alt="Marco Chavez, founder of Hexacomb"
              fill
              sizes="(max-width: 900px) calc(100vw - 2.5rem), 36vw"
            />
            <span>Founder-led</span>
          </div>
          <div className="founder-copy">
            <MapPin size={20} aria-hidden />
            <h3>The person reviewing your website is the person making the improvements.</h3>
            <p>I&apos;m Marco. I stay close to your website and explain what we are doing in plain language.</p>
            <ul>
              <li><Check size={15} aria-hidden /> Direct access</li><li><Check size={15} aria-hidden /> Clear monthly priorities</li><li><Check size={15} aria-hidden /> No long-term lock-in</li>
            </ul>
            <Link href="/about" className="growth-text-link">Meet your website partner <ArrowUpRight size={16} aria-hidden /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
