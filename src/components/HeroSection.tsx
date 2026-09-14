"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import CallFlowDiagram from "@/components/CallFlowDiagram";
import HeroWebGL from "@/components/HeroWebGL";
import { attachScrollPin, viewportHeight } from "@/lib/scrollPin";
import "@/app/website-journey.css";

const scenes = [
  { id: "your-website", label: "Websites by Hexacomb", title: "Your business. Beautifully built.", body: "Custom websites. Built by Marco. Made to move your business forward.", link: "Let’s build yours", href: "#contact" },
  { id: "every-screen", label: "Every screen. Every detail.", title: "A small screen. A big impression.", body: "Just as considered on a phone as it is on a desktop. Because your next customer could be anywhere.", link: "Talk about your website", href: "#contact" },
  { id: "website-care", label: "Clarity comes first", title: "Easy to find. Hard to forget.", body: "Clear service pages. Local search foundations. A distinctive presence that helps the right people find their way to you.", link: "Check your current site", href: "/website-audit" },
  { id: "make-contact", label: "Designed for the next step", title: "From first look. To first hello.", body: "Give people the confidence to choose you—and a simple way to get in touch.", link: "Let’s talk", href: "#contact" },
  { id: "growth-system", label: "Built with you. Kept with care.", title: "Launch is just the beginning.", body: "I build it. I look after it. You get a website partner who knows your business and keeps making things better.", link: "Find your website plan", href: "/pricing" },
];

export default function HeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const renderSceneRef = useRef<() => void>(() => {});
  const [available, setAvailable] = useState(true);
  const unavailable = useCallback(() => setAvailable(false), []);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const panels = Array.from(track.querySelectorAll<HTMLElement>(".website-beat"));
    const stage = track.querySelector<HTMLElement>(".website-stage");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stacked = () => reduced.matches || !available;
    let frame = 0;
    let target = 0;
    let last = 0;
    const draw = (now: number) => {
      frame = 0;
      const dt = Math.min(50, now - (last || now - 16)); last = now;
      progress.current += (target - progress.current) * (1 - Math.exp(-dt / 100));
      const p = progress.current;
      const intro = Math.max(0, 1 - p / .7);
      stage?.style.setProperty("--intro", String(intro));
      const hues = [275, 170, 35, -30, -105];
      const segment = Math.min(3, Math.floor(p));
      const hue = hues[segment] + (hues[segment + 1] - hues[segment]) * (p - segment);
      stage?.style.setProperty("--scene-hue", String(hue));
      stage?.style.setProperty("--scene-shift", `${Math.sin(p * 1.6) * 12}%`);
      const stackedNow = stacked();

      panels.forEach((panel, index) => {
        const distance = Math.abs(p - index);
        const opacity = stackedNow ? 1 : Math.max(0, Math.min(1, (0.64 - distance) / .24));
        panel.style.opacity = String(opacity);
        panel.style.transform = stackedNow ? "none" : `translateY(${(index - p) * 24}px)`;
        panel.dataset.active = String(opacity >= .5);
        const link = panel.querySelector("a");
        if (link) link.tabIndex = opacity >= .5 ? 0 : -1;
      });
      renderSceneRef.current();
      if (Math.abs(target - p) > .0001) frame = requestAnimationFrame(draw);
    };
    const update = () => {
      const rect = track.getBoundingClientRect();
      const view = viewportHeight();
      const journey = Math.max(1, rect.height - view);
      target = stacked() ? 0 : Math.max(0, Math.min(4, -rect.top / journey * 4));
      if (!frame) { last = 0; frame = requestAnimationFrame(draw); }
    };
    const unpin = stage ? attachScrollPin(track, stage, { scenes: 5, query: "(max-width: 760px)" }) : () => {};
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reduced.addEventListener("change", update);
    return () => { cancelAnimationFrame(frame); unpin(); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); reduced.removeEventListener("change", update); };
  }, [available]);
  return (
    <div className="website-journey" ref={trackRef} data-static={!available}>
      <noscript><style>{`.website-journey{height:auto}.website-stage{position:relative;height:auto;overflow:visible}.website-stage-art{position:relative;height:25rem}.website-beats,.website-beat{position:relative}.website-beat{opacity:1;padding:3rem 6vw}.website-beat-copy{width:100%}.website-link{pointer-events:auto}.website-anchors,.website-scroll-prompt{display:none}`}</style></noscript>
      <div className="website-stage">
        <div className="website-stage-art" aria-hidden="true">{available ? <HeroWebGL progress={progress} renderSceneRef={renderSceneRef} onUnavailable={unavailable} /> : <CallFlowDiagram />}</div>
        <div className="website-beats">
          {scenes.map((scene, index) => (
            <section className={`website-beat ${index === 0 ? "website-intro" : ""}`} key={scene.id} aria-labelledby={`${scene.id}-title`}>
              <div className="website-beat-copy">
                <p className="website-beat-label">{scene.label}</p>
                {index === 0 ? <h1 id={`${scene.id}-title`}>{scene.title}</h1> : <h2 id={`${scene.id}-title`}>{scene.title}</h2>}
                <p className="website-beat-body">{scene.body}</p>
                <Link href={scene.href} className="website-link" data-track={index === 0 ? "hero_growth_conversation" : `journey_${scene.id}`}>{scene.link}<ArrowUpRight size={16} aria-hidden /></Link>
              </div>
            </section>
          ))}
        </div>
        <span className="website-art-note">Illustrative website design</span>
        <span className="website-scroll-prompt">Discover what’s possible <ArrowDown size={14} aria-hidden /></span>
      </div>
      <div className="website-anchors" aria-hidden="true">{scenes.map((scene, i) => <span key={scene.id} id={scene.id} style={{ top: `${i * 20}%` }} />)}</div>
    </div>
  );
}
