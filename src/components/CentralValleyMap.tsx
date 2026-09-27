"use client";

import HalftoneReveal from "./HalftoneReveal";
import type { CaseStudy } from "@/lib/cases";

export default function CentralValleyMap({
  cases,
  onSelect,
}: {
  cases: CaseStudy[];
  onSelect: (item: CaseStudy) => void;
}) {
  return (
    <section className="hobro-map" aria-labelledby="valley-map-heading">
      <div className="hobro-shell hobro-map-layout">
        <div className="hobro-map-head">
          <p className="hobro-kicker">Clients</p>
          <h2 id="valley-map-heading">The same place you sell.</h2>
          <p className="hobro-map-lead">
            Your customers already drive these roads. The site should know that
            too.
          </p>
          <ul className="hobro-map-list">
            {cases.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => onSelect(item)}>
                  <strong>{item.title}</strong>
                  <em>{item.city}</em>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <figure className="hobro-map-figure">
          <div className="hobro-map-reveal-wrapper">
            <HalftoneReveal
              src="/images/fresno_satellite_dark.jpg"
              inkColor="#111111"
              paperColor="#f4f1ea"
              mode="mono"
              dotDensity={80}
              angle={45}
              revealRadius={0.35}
              borderRadius="0px"
            />
          </div>
          <figcaption>Fresno, looking east toward the Sierra. Hover to inspect.</figcaption>
        </figure>
      </div>
    </section>
  );
}
