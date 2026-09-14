"use client";

import Image from "next/image";
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
          <Image
            src="/images/fresno_satellite_dark.jpg"
            alt="Night aerial of Fresno and the orchard grid around it, looking toward the Sierra."
            width={1376}
            height={768}
            sizes="(max-width: 800px) calc(100vw - 2.5rem), 48vw"
          />
          <figcaption>Fresno, looking east toward the Sierra.</figcaption>
        </figure>
      </div>
    </section>
  );
}
