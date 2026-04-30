"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    title: "Tell us your goals",
    body: "We listen first, then translate what you need into a practical technical direction.",
  },
  {
    title: "We build the plan",
    body: "You get a clear path, plain-language tradeoffs, and the right tools for the job.",
  },
  {
    title: "We deliver & support",
    body: "We launch the work, keep it stable, and help your team understand what changed.",
  },
];

export default function ProcessSteps() {
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
      { threshold: 0.15, rootMargin: "-60px 0px -60px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="brand-section process-section reveal-scope"
      aria-labelledby="process-heading"
    >
      <div className="container">
        <p className="brand-kicker">How it works</p>
        <h2 id="process-heading" className="brand-section-title">
          A calm process for modernizing messy systems.
        </h2>
        <div className="process-wrap">
          <svg className="process-line" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden>
            <path d="M0 1 H100" pathLength="100" />
          </svg>
          <div className="process-steps">
            {steps.map((step, index) => (
              <article
                className="process-step reveal-item"
                key={step.title}
                style={{ "--reveal-delay": `${index * 150}ms` } as React.CSSProperties}
              >
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
