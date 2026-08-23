import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "About Marco | Your Website Partner",
  description: "Meet Marco, the Fresno-area partner who manages, measures, and grows small-business websites.",
  alternates: { canonical: "https://hexacombllc.com/about" },
};

const proof = [
  ["LOCAL", "Based in Clovis", "My reputation lives in the same community as your business."],
  ["DIRECT", "No account-manager relay", "You speak with the person reading the data and making the changes."],
  ["SENIOR", "Built for real operations", "Years of engineering, accessibility, and performance work behind every decision."],
];

export default function AboutPage() {
  return (
    <main id="main-content" className="growth-page">
      <section className="growth-page-hero growth-shell growth-page-hero-split">
        <div>
          <h1>Your website should be owned by someone who knows your business.</h1>
          <p className="growth-page-lead">I&rsquo;m Marco. I run Hexacomb so business owners can stop carrying the website in the back of their minds.</p>
          <div className="growth-page-actions"><Link href="/#contact" className="growth-button growth-button-signal">Talk to Marco <ArrowUpRight size={18} aria-hidden /></Link></div>
        </div>
        <div className="growth-about-photo">
          <Image src="/images/marco-portrait.jpg" alt="Marco Chavez, founder of Hexacomb" fill priority sizes="(max-width: 900px) 100vw, 42vw" />
          <span><MapPin size={15} aria-hidden /> Clovis, California</span>
        </div>
      </section>

      <section className="growth-page-dark">
        <div className="growth-shell growth-page-statement">
          <h2>A website is too important to be everybody&rsquo;s side job.</h2>
          <p>Owners should not spend Tuesday night updating services, deciphering traffic reports, or wondering why competitors outrank them. That ongoing responsibility is the business.</p>
        </div>
      </section>

      <section className="growth-shell growth-page-section">
        <div className="growth-page-heading"><h2>Close to the work. Clear about the why.</h2></div>
        <ul className="growth-proof-list">
          {proof.map(([code, title, body]) => <li key={code}><span>{code}</span><h3>{title}</h3><p>{body}</p></li>)}
        </ul>
        <div className="growth-inline-close"><div><Check size={20} aria-hidden /><strong>You keep running the company.</strong><p>I keep the website moving.</p></div><Link href="/pricing" className="growth-button">See the plans <ArrowUpRight size={17} aria-hidden /></Link></div>
      </section>
    </main>
  );
}
