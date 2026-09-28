"use client";

import { useCallback, useMemo, useState } from "react";
import { clientCaseStudies, type CaseStudy } from "@/lib/cases";
import AccordionGallery from "./AccordionGallery";
import CaseStudyModal from "./CaseStudyModal";
import CentralValleyMap from "./CentralValleyMap";

export default function PortfolioShowcase() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cycling, setCycling] = useState(true);

  const galleryItems = useMemo(
    () =>
      clientCaseStudies.map((item) => ({
        image: item.imageSrc,
        label: `${item.title} · ${item.city}`,
        alt: `${item.title} website, ${item.city}`,
      })),
    []
  );

  const onActiveChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const onOpen = useCallback((index: number) => {
    const item = clientCaseStudies[index];
    if (item) setSelectedCase(item);
  }, []);

  const currentCase = clientCaseStudies[activeSlide] ?? clientCaseStudies[0];

  return (
    <div id="projects">
      <section className="hobro-white hobro-cases">
        <div className="hobro-shell">
          <div className="hobro-cases-head">
            <h2>Work in the valley</h2>
            <div className="hobro-cases-head-note">
              <p>They step forward on their own. Open the one you want.</p>
              <button
                type="button"
                className="hobro-cases-cycle"
                aria-pressed={cycling}
                aria-label={cycling ? "Pause project rotation" : "Play project rotation"}
                onClick={() => setCycling((on) => !on)}
              >
                {cycling ? "Pause" : "Play"}
              </button>
            </div>
          </div>

          <div className="hobro-cases-gallery">
            <AccordionGallery
              items={galleryItems}
              defaultIndex={0}
              height={440}
              expandRatio={0.58}
              radius={16}
              gap={12}
              accentColor="#f4efe4"
              overlayColor="#161513"
              listLabel="Work in the valley"
              autoplay={cycling && selectedCase === null}
              autoplayMs={4200}
              onActiveChange={onActiveChange}
              onOpen={onOpen}
            />
          </div>

          <div className="hobro-cases-details-bar">
            <div className="hobro-cases-details-meta" key={currentCase.id}>
              <span className="hobro-cases-details-tagline">
                {currentCase.city}, CA
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
              <span>See this project</span>
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

        </div>
      </section>

      <CentralValleyMap />

      <CaseStudyModal
        caseStudy={selectedCase}
        isOpen={selectedCase !== null}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
}
