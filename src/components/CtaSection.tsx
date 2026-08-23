import { ContactFormClient } from "@/components/ContactFormClient";
import { Check } from "lucide-react";

const trustItems = ["Your current website is enough to start", "I reply within one business day", "No jargon. No pressure."];

export default function CtaSection() {
  return (
    <section id="contact" className="growth-close" aria-labelledby="contact-heading">
      <div className="growth-shell growth-close-grid">
        <div className="growth-close-copy">
          <h2 id="contact-heading">
            Need help with your website?
            <span> Let&apos;s make a plan.</span>
          </h2>
          <p>
            Tell me what is not working or what you want to improve. I&apos;ll help you identify the best place to start.
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
