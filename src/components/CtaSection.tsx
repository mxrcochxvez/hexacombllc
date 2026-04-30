import { ContactFormClient } from "@/components/ContactFormClient";

export default function CtaSection() {
  return (
    <section className="brand-cta" id="contact" aria-labelledby="contact-heading">
      <div className="brand-cta-glow" aria-hidden />
      <div className="container brand-cta-inner">
        <div className="brand-cta-copy">
          <h2 id="contact-heading">Ready to modernize?</h2>
          <p>
            Let&rsquo;s talk about your business. No pressure, no jargon — just a
            conversation.
          </p>
        </div>
        <div
          className="brand-contact-panel"
          id="consultation-form"
          aria-label="Free consultation form"
        >
          <ContactFormClient />
        </div>
      </div>
    </section>
  );
}
