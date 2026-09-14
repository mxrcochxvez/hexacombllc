"use client";

import { ContactFormClient } from "@/components/ContactFormClient";

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
            <a href="mailto:hi@hexacombllc.com">hi@hexacombllc.com</a>
          </p>
        </div>
        <div>
          <ContactFormClient initialMessage={initialMessage} />
        </div>
      </div>
    </section>
  );
}
