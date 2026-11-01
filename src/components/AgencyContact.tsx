import { ContactFormClient } from "@/components/ContactFormClient";
export default function AgencyContact({
  initialMessage,
}: {
  initialMessage?: string;
}) {
  return (
    <section
      id="contact"
      className="hobro-contact premium-contact"
      aria-labelledby="contact-heading"
    >
      <div className="premium-shell hobro-contact-grid">
        <div>
          <p className="premium-eyebrow">LET’S START A CONVERSATION</p>
          <h2 id="contact-heading">
            What’s next
            <br />
            <em>for your business?</em>
          </h2>
          <p>
            Tell me what you do, where you work, and what your website should be
            doing better. I’ll write back personally, usually within a day.
          </p>
          <div className="premium-contact-links">
            <a href="mailto:marco@hexacombllc.com">marco@hexacombllc.com</a>
            <a href="tel:+15594927402">(559) 492-7402</a>
          </div>
          <p className="premium-small">
            Based in Clovis. Working with businesses across the Central Valley.
          </p>
        </div>
        <div className="hobro-contact-panel">
          <div className="hobro-contact-form">
            <ContactFormClient initialMessage={initialMessage} />
          </div>
        </div>
      </div>
    </section>
  );
}
