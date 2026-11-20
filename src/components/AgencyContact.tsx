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
            Tell me about your business.
            <br />
            <em>I’ll help with the website.</em>
          </h2>
          <p>
            You don’t need to know what kind of website you need. Tell me
            about your business, what you want to change, or what isn’t working.
            I’ll get back to you personally with a sensible next step, usually
            within a day.
          </p>
          <div className="premium-contact-links">
            <a href="mailto:marco@hexacombllc.com">marco@hexacombllc.com</a>
            <a href="tel:+15594927402" data-phone-location="contact">(559) 492-7402</a>
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
