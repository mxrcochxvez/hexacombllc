"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, Search, Send } from "lucide-react";

const chapters = [
  { title: "The moment they need you.", body: "Someone searches for exactly what your business does. Your website needs to give them a reason to stop here." },
  { title: "A first impression with somewhere to go.", body: "Clear words, useful pages, and a design that feels like your business make the next click feel easy." },
  { title: "Interest becomes a conversation.", body: "The path ends with a simple next step: a person who is ready to reach out can do it without hunting for a way in." },
  { title: "Then I stay in the picture.", body: "I’m Marco. I build your website, watch what happens next, and keep making it better as your business grows." },
];

export default function ProcessSteps() {
  const trackRef = useRef<HTMLElement>(null);
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduced.matches || compact.matches) { setScene(0); return; }
      const rect = track.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      setScene(Math.round(Math.max(0, Math.min(3, -rect.top / range * 3))));
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    reduced.addEventListener("change", queue);
    compact.addEventListener("change", queue);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); reduced.removeEventListener("change", queue); compact.removeEventListener("change", queue); };
  }, []);

  return (
    <section ref={trackRef} className="customer-journey" data-scene={scene} aria-labelledby="journey-heading">
      <div className="customer-journey-stage">
        <div className="growth-shell customer-journey-shell">
          <div className="customer-journey-copy">
            {chapters.map((chapter, index) => (
              <article className="journey-chapter" data-active={scene === index} key={chapter.title}>
                {index === 0 ? <h2 id="journey-heading">{chapter.title}</h2> : <h3>{chapter.title}</h3>}
                <p>{chapter.body}</p>
                {index === 3 && <Link href="/about" className="journey-link">Meet your website partner <ArrowUpRight size={17} aria-hidden /></Link>}
              </article>
            ))}
          </div>
          <div className="journey-visual" aria-hidden="true">
            <div className="journey-search"><Search size={19} strokeWidth={2.5} /><span>website designer near me</span><i /></div>
            <div className="journey-result"><span className="journey-result-dot" /><div><strong>YOUR BUSINESS</strong><small>Thoughtful work. Close to home.</small></div><ArrowRight size={18} /></div>
            <div className="journey-site"><div className="journey-site-bar"><span>YOUR BUSINESS</span><i /><i /><i /></div><strong>Made for the<br />way you live.</strong><p>Clear work. A clear next step.</p><button type="button">Explore services <ArrowRight size={14} /></button><span className="journey-site-shape" /></div>
            <div className="journey-message"><span>Hi — I’d love to learn more.</span><Send size={15} /></div>
            <div className="journey-maker"><Image src="/images/marco-portrait.jpg" alt="" fill sizes="(max-width: 900px) 58vw, 22vw" /><span><MapPin size={15} /> Fresno, California</span></div>
            <span className="journey-orbit journey-orbit-one" /><span className="journey-orbit journey-orbit-two" />
          </div>
        </div>
        <p className="journey-footnote">A website should make the right next step feel natural.</p>
      </div>
    </section>
  );
}
