"use client";

import { useEffect, useRef } from "react";

const services = [
  {
    icon: "✦",
    title: "Web Design & Development",
    description:
      "Custom websites that load quickly, explain your business clearly, and make it easy for customers to take the next step.",
  },
  {
    icon: "⌘",
    title: "Custom Software",
    description:
      "Practical tools for the workflows spreadsheets, paper forms, and off-the-shelf software can no longer handle.",
  },
  {
    icon: "◈",
    title: "AI & Automation",
    description:
      "AI-powered workflows that save time without making your team feel like they need to become engineers.",
  },
  {
    icon: "◆",
    title: "IT Modernization",
    description:
      "Cleaner systems, safer operations, and simpler technology decisions for businesses ready to grow up digitally.",
  },
];

export default function ServicesGrid() {
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
      className="brand-section services-section honeycomb-bg reveal-scope"
      id="services"
      aria-labelledby="services-heading"
    >
      <div className="container">
        <p className="brand-kicker">What we do</p>
        <h2 id="services-heading" className="brand-section-title">
          Everything your business needs — under one roof.
        </h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <article
              className="service-card reveal-item"
              key={service.title}
              style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}
            >
              <span className="service-card-icon" aria-hidden>
                {service.icon}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
