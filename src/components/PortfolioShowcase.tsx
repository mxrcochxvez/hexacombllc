"use client";

import { useState, useMemo } from "react";
import { clientCaseStudies, type CaseStudy } from "@/lib/cases";
import CaseStudyModal from "./CaseStudyModal";
import CentralValleyMap from "./CentralValleyMap";
import MorphSlider from "./MorphSlider";

export default function PortfolioShowcase() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderItems = useMemo(
    () =>
      clientCaseStudies.map((item) => ({
        image: item.imageSrc,
        caption: `${item.title} · ${item.city}`,
        id: item.id,
        title: item.title,
        city: item.city,
      })),
    []
  );

  const currentCase = clientCaseStudies[activeSlide] ?? clientCaseStudies[0];

  return (
    <div id="projects">
      <section className="hobro-white hobro-cases">
        <div className="hobro-shell">
          <div className="hobro-cases-head">
            <p>Live sites</p>
            <h2>Work in the valley</h2>
          </div>

          <div className="hobro-cases-slider-container">
            <MorphSlider
              items={sliderItems}
              transition="shear"
              intensity={0.55}
              aberration={0.35}
              drift={0.4}
              autoplay
              autoplayDelay={4.5}
              radius={16}
              onIndexChange={setActiveSlide}
            />
          </div>

          <div className="hobro-cases-details-bar">
            <div className="hobro-cases-details-meta">
              <span className="hobro-cases-details-tagline">
                Active Project • {currentCase.city}, CA
              </span>
              <h3 className="hobro-cases-details-title">{currentCase.title}</h3>
              <p className="hobro-cases-details-desc">{currentCase.summary}</p>
              <div className="hobro-cases-details-tags">
                {currentCase.tags.map((tag) => (
                  <span key={tag} className="hobro-cases-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="hobro-cases-open-btn"
              onClick={() => setSelectedCase(currentCase)}
            >
              <span>check out site</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="hobro-cases-cards">
            {clientCaseStudies.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`hobro-case-card ${activeSlide === idx ? "is-active" : ""}`}
                onClick={() => setSelectedCase(item)}
              >
                <div className="hobro-case-card-header">
                  <span className="hobro-case-card-city">{item.city}</span>
                </div>
                <h4 className="hobro-case-card-title">{item.title}</h4>
                <p className="hobro-case-card-summary">{item.summary}</p>
                <div className="hobro-case-card-footer">
                  <span>{item.tags.join(" · ")}</span>
                  <span>View Details ↗</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <CentralValleyMap cases={clientCaseStudies} onSelect={setSelectedCase} />

      <CaseStudyModal
        caseStudy={selectedCase}
        isOpen={selectedCase !== null}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
}
