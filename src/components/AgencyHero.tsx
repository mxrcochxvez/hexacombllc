"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import ScrollExpand from "@/components/ScrollExpand";
import RippleDistortion from "@/components/RippleDistortion";

export default function AgencyHero() {
  return (
    <ScrollExpand
      macbook
      useWindowScroll
      scrollDistance={1.3}
      holdDistance={0.4}
      scrollHint="Scroll to expand"
      startRadius={8}
      endRadius={0}
      smoothing={0.08}
      frameContent={
        <div className="hobro-hero">
          <div className="hobro-hero-media" aria-hidden="true">
            {/* Pexels License. Logan Voss, Southern California suburb aerial. */}
            <video
              className="hobro-hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/hero/california-aerial.jpg"
            >
              <source src="/videos/california-aerial.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hobro-hero-copy">
            <h1 className="hobro-hero-title">Your new website</h1>
            <p className="hobro-hero-punch">
              deserves to be badass, like you and your business.
            </p>
            <p className="hobro-hero-credit">Designs &amp; Websites by Hexacomb LLC</p>
          </div>
          <aside className="hobro-hero-card">
            <p>Your website should be working for you when you can&apos;t.</p>
            <Link href="#contact" className="hobro-deck-btn hobro-deck-btn-solid">
              Let&apos;s talk
            </Link>
          </aside>
        </div>
      }
    />
  );
}

export function AgencyPageHero({
  kicker,
  title,
  lead,
  actions,
  aside,
}: {
  kicker?: string;
  title: string;
  lead: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="hobro-page-hero">
      <div className={`hobro-shell${aside ? " hobro-page-hero-split" : ""}`}>
        <div>
          {kicker ? <p className="hobro-kicker">{kicker}</p> : null}
          <h1 className="hobro-page-title">{title}</h1>
          <div className="hobro-page-lead">{lead}</div>
          {actions ? <div className="hobro-page-actions">{actions}</div> : null}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function AgencyIntro() {
  return (
    <section className="hobro-intro">
      <div className="hobro-shell">
        <div className="hobro-intro-water-stage">
          <RippleDistortion
            src="/images/water-surface.jpg"
            brushSize={140}
            strength={0.24}
            swirl={0.8}
            rings={4}
            spread={5.5}
            fade={3}
            spacing={12}
            dispersion={0.02}
            glint={0.35}
            tint="#38bdf8"
            tintAmount={0.16}
            grayscale={false}
            trigger="both"
            clickStrength={2.4}
            quality="high"
            className="hobro-intro-ripple"
          />
          <div className="hobro-intro-water-overlay" />
          <div className="hobro-intro-water-content">
            <p className="hobro-intro-statement">
              We take the website worries out of your hands.
            </p>
            <p className="hobro-intro-body">
              You run the business. The site keeps finding customers, loading
              fast, and taking the next step while you&apos;re on a job.
            </p>
          </div>
        </div>

        <Link href="#contact" className="hobro-talk">
          <small>Got a project?</small>
          <span className="hobro-talk-row">
            <span className="hobro-talk-arc" aria-hidden="true">
              (
            </span>
            <strong>Let&apos;s talk</strong>
            <span className="hobro-talk-arc" aria-hidden="true">
              )
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
