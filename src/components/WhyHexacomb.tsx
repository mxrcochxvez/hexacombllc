"use client";

import { useEffect, useRef } from "react";

const callouts = [
  {
    title: "We speak your language",
    body: "No jargon, no vague technical lectures. You get plain explanations and clear choices.",
  },
  {
    title: "We move fast",
    body: "Most projects are delivered in weeks, not months, with a plan you can understand from day one.",
  },
  {
    title: "We grow with you",
    body: "From your first website to full digital operations, we build systems that can mature with the business.",
  },
];

export default function WhyHexacomb() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="brand-section why-section reveal-scope"
      aria-labelledby="why-heading"
    >
      <div className="container why-grid">
        <div className="why-graphic" aria-hidden>
          <svg viewBox="0 0 520 440" role="img">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              {Array.from({ length: 20 }).map((_, index) => {
                const col = index % 5;
                const row = Math.floor(index / 5);
                const x = 52 + col * 88 + (row % 2) * 44;
                const y = 54 + row * 76;
                return (
                  <path
                    key={index}
                    className={index % 4 === 0 ? "hex-cell hex-cell-fill" : "hex-cell"}
                    d={`M ${x} ${y - 34} L ${x + 40} ${y - 12} L ${x + 40} ${y + 34} L ${x} ${y + 56} L ${x - 40} ${y + 34} L ${x - 40} ${y - 12} Z`}
                  />
                );
              })}
            </g>
          </svg>
        </div>
        <div className="why-content">
          <p className="brand-kicker">Why Hexacomb</p>
          <h2 id="why-heading" className="brand-section-title">
            Expert help that still feels human.
          </h2>
          <div className="why-rule" aria-hidden />
          <div className="why-callouts">
            {callouts.map((callout, index) => (
              <article
                className="why-callout reveal-item"
                key={callout.title}
                style={{ "--reveal-delay": `${index * 150}ms` } as React.CSSProperties}
              >
                <span aria-hidden>✦</span>
                <div>
                  <h3>{callout.title}</h3>
                  <p>{callout.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
