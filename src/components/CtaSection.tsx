import { ContactFormClient } from "@/components/ContactFormClient";
import { Check } from "lucide-react";

const trustItems = ["Current site is enough", "Reply within one business day", "No jargon. No pressure."];

export default function CtaSection() {
  return (
    <section id="contact" className="growth-close" aria-labelledby="contact-heading">
      <div className="growth-shell growth-close-grid">
        <div className="growth-close-copy">
          <h2 id="contact-heading">
            Stop carrying the website.
            <span> Put it on our desk.</span>
          </h2>
          <p>
            Tell me what is being ignored. I&rsquo;ll tell you where we should attack first.
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
            <span>Hand it over</span>
            <strong>Tell me about the website</strong>
          </div>
          <ContactFormClient />
        </div>
      </div>
    </section>
  );
}
