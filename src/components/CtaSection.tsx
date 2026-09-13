import { ContactFormClient } from "@/components/ContactFormClient";
import { Check } from "lucide-react";

const trustItems = [
  "A new idea or an existing website",
  "I reply within one business day",
  "No jargon. No pressure.",
];

export default function CtaSection() {
  return (
    <section id="contact" className="growth-close canal-close" aria-labelledby="contact-heading">
      <div className="growth-shell growth-close-grid">
        <div className="growth-close-copy">
          <h2 id="contact-heading">
            Your business deserves a great website.
            <span> Let&apos;s build it.</span>
          </h2>
          <p>
            Starting fresh or ready for something better? Tell me about your business. I’ll help you work out what your website needs and where to begin.
          </p>
          <ul className="growth-close-trust" aria-label="What to expect">
            {trustItems.map((item) => (
              <li key={item}>
                <Check size={16} strokeWidth={2.8} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          id="consultation-form"
          className="growth-contact-form"
          role="region"
          aria-label="Contact form"
        >
          <div className="growth-contact-form-head">
            <span>Start here</span>
            <strong>Tell me about your business and website</strong>
          </div>
          <ContactFormClient />
        </div>
      </div>
    </section>
  );
}
