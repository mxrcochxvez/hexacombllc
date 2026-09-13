"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Search, Sparkles, Wrench } from "lucide-react";

const phases = [
  {
    title: "Take care of it.",
    body: "Updates, upkeep, speed, and the technical details stay handled behind the scenes.",
    icon: Wrench,
  },
  {
    title: "Understand it.",
    body: "We look at how people find you, what helps them stay, and where they decide to reach out.",
    icon: Search,
  },
  {
    title: "Improve it.",
    body: "The next update is chosen with purpose, then made on the website—not left on a report.",
    icon: Sparkles,
  },
];

export default function WebsiteCareLoop() {
  const trackRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduced.matches) { setActive(0); return; }
      const rect = track.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      setActive(Math.round(Math.max(0, Math.min(2, -rect.top / range * 2))));
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    reduced.addEventListener("change", queue);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); reduced.removeEventListener("change", queue); };
  }, []);

  return (
    <section ref={trackRef} className="care-loop" data-active={active} aria-labelledby="care-loop-heading">
      <div className="care-loop-stage">
        <div className="growth-shell care-loop-shell">
          <div className="care-loop-copy">
            <h2 id="care-loop-heading" className="care-loop-title">Take care of it. Understand it. Improve it.</h2>
            <div className="care-loop-phases">
              {phases.map((phase, index) => {
                const Icon = phase.icon;
                return (
                  <article key={phase.title} className="care-loop-phase" data-active={active === index}>
                    <Icon size={22} strokeWidth={2.1} aria-hidden />
                    <h3>{phase.title}</h3>
                    <p>{phase.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="care-loop-site" aria-hidden="true">
            <div className="care-loop-window">
              <div className="care-loop-window-bar"><span>YOUR BUSINESS</span><i /><i /><i /></div>
              <div className="care-loop-page"><strong>Built for the<br />next right step.</strong><p>Good work, made clear.</p><span>Start a conversation</span></div>
              <div className="care-loop-care"><Wrench size={16} /><b>Everything is up to date</b><Check size={16} /></div>
              <div className="care-loop-insight"><span>People are finding you</span><i /><i /><i /><i /><i /></div>
              <div className="care-loop-improvement"><Sparkles size={16} /><span>New service page is live</span></div>
            </div>
            <span className="care-loop-pulse care-loop-pulse-one" />
            <span className="care-loop-pulse care-loop-pulse-two" />
          </div>
        </div>
      </div>
    </section>
  );
}
