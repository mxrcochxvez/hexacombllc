"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BarChart3, FilePenLine, Search, Wrench } from "lucide-react";

const cards = [
  {
    verb: "Manage",
    title: "Keep the site sharp",
    body: "Updates, performance, and upkeep stay off your desk.",
    icon: Wrench,
  },
  {
    verb: "Search",
    title: "Keep climbing",
    body: "Pages and local SEO keep pushing for the searches that matter.",
    icon: Search,
  },
  {
    verb: "Measure",
    title: "Know what changed",
    body: "Behavior and rankings become a clear business signal.",
    icon: BarChart3,
  },
  {
    verb: "Improve",
    title: "Ship the next move",
    body: "The evidence becomes better copy, pages, and conversion paths.",
    icon: FilePenLine,
  },
];

export default function WebsiteWorkStack() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(deck);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (paused || !isVisible || !isPageVisible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % cards.length), 3600);
    return () => window.clearInterval(timer);
  }, [isPageVisible, isVisible, paused]);

  return (
    <div
      ref={deckRef}
      className="work-deck"
      data-visible={isVisible && isPageVisible}
      aria-label="The ongoing website work"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="work-deck-label"><span>Always working</span><i aria-hidden /></div>
      <div className="work-deck-stage">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const depth = (index - active + cards.length) % cards.length;
          return (
            <button
              key={card.verb}
              type="button"
              className="work-deck-card"
              style={{ "--deck-depth": depth } as React.CSSProperties}
              data-depth={depth}
              onClick={() => setActive((index + 1) % cards.length)}
              tabIndex={depth === 0 ? 0 : -1}
              aria-hidden={depth !== 0}
              aria-label={`${card.verb}: ${card.title}. Move this card to the back.`}
            >
              <span className="work-deck-card-icon"><Icon size={22} aria-hidden /></span>
              <span className="work-deck-card-verb">{card.verb}</span>
              <strong>{card.title}</strong>
              <small>{card.body}</small>
              <span className="work-deck-card-action">Move to back <ArrowUpRight size={14} aria-hidden /></span>
            </button>
          );
        })}
      </div>
      <p>Every cycle ends with a change shipped to the site.</p>
    </div>
  );
}
