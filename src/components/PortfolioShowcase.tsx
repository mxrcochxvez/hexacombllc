"use client";

import { useState } from "react";
import Image from "next/image";
import { clientCaseStudies, type CaseStudy } from "@/lib/cases";
import CaseStudyModal from "./CaseStudyModal";
import CentralValleyMap from "./CentralValleyMap";

export default function PortfolioShowcase() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  return (
    <div id="projects">
      <section className="hobro-white hobro-cases">
        <div className="hobro-shell">
          <div className="hobro-cases-head">
            <p>Live sites</p>
            <h2>Work in the valley</h2>
          </div>
          <div className="hobro-cases-grid">
            {clientCaseStudies.map((item) => (
              <button
                key={item.id}
                type="button"
                className="hobro-case"
                onClick={() => setSelectedCase(item)}
              >
                <div className="hobro-case-media">
                  <Image
                    src={item.imageSrc}
                    alt={`${item.title} website`}
                    width={1440}
                    height={900}
                  />
                </div>
                <span className="hobro-case-caption">
                  <span>{item.title}</span>
                  <span>{item.city}</span>
                </span>
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
