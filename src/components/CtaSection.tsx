import { ContactFormClient } from "@/components/ContactFormClient";

const trustItems = [
  "Reply within one business day",
  "Fresno-based, no offshore handoffs",
  "Straight answers, no jargon or pressure",
];

export default function CtaSection() {
  return (
    <section id="contact" style={{ padding: 0 }} className="bg-deep" aria-labelledby="contact-heading">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:items-start">
        <div className="lg:pt-3">
          <h2
            id="contact-heading"
            className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight text-on-deep"
          >
            Let&rsquo;s talk about your business
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-on-deep-muted">
            Tell us what you&rsquo;re dealing with. We come back with honest next steps, not a
            sales pitch.
          </p>
          <ul className="mt-8 space-y-3" aria-label="What to expect">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-on-deep-muted">
                <span
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          id="consultation-form"
          className="rounded-lg border border-on-deep/10 bg-canvas p-6 shadow-[0_24px_60px_-30px_oklch(15%_0.03_265/0.6)] sm:p-8"
          aria-label="Contact form"
        >
          <ContactFormClient />
        </div>
      </div>
    </section>
  );
}
