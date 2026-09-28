"use client";

import { ContactFormClient } from "@/components/ContactFormClient";
import SpotlightCard from "@/components/SpotlightCard";

export default function AgencyContact({
  initialMessage,
}: {
  initialMessage?: string;
}) {
  return (
    <section id="contact" className="hobro-contact">
      <div className="hobro-shell hobro-contact-grid">
        <div>
          <p className="hobro-kicker">Contact</p>
          <h2>Let&apos;s take the website off your plate.</h2>
          <p>
            Starting fresh or replacing a site that stopped working. Write a
            few lines. I answer from Clovis, usually within a day.
          </p>
          <p>
            <a href="mailto:marco@hexacombllc.com">marco@hexacombllc.com</a>
          </p>
        </div>
        <SpotlightCard
          className="hobro-contact-panel"
          spotlightColor="rgba(255, 210, 140, 0.38)"
        >
          <div className="hobro-contact-form">
            <ContactFormClient initialMessage={initialMessage} />
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
