import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin } from "lucide-react";

export default function ProcessSteps() {
  return (
    <section className="growth-proof" aria-labelledby="process-heading">
      <div className="growth-shell proof-layout">
        <div className="report-sheet">
          <h2 id="process-heading">What happened. What it means. What we change.</h2>
          <div className="report-signal"><strong>See the signal</strong><p>Search, traffic, and conversion behavior.</p></div>
          <div className="report-signal"><strong>Choose the move</strong><p>The highest-value improvement gets priority.</p></div>
          <div className="report-signal report-signal-active"><strong>Ship the change</strong><p>The report becomes work—not homework for you.</p></div>
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
            <h3>The person reading the data is the person doing the work.</h3>
            <p>I&rsquo;m Marco. I stay close to your website and explain the decisions plainly.</p>
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
