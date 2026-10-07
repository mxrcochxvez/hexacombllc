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
          <h2>What should the site be bringing in?</h2>
          <p>
            New business, or one whose website went quiet. Say what you do,
            the towns you cover, and drop the link if you have one. I write
            back from Clovis, usually within a day. The first note is about
            your jobs, not a list of packages.
          </p>
          <p>
            <a href="mailto:marco@hexacombllc.com">marco@hexacombllc.com</a>
            <br />
            <a href="tel:+15594927402">(559) 492-7402</a>
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
