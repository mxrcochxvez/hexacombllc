import Image from "next/image";
import { testimonials } from "@/lib/testimonials";
export default function ClientTestimonials() {
  const approved = testimonials.filter(
    (item) =>
      item.approvedForPublication &&
      item.quote.trim() &&
      item.name.trim() &&
      item.sourceUrl.startsWith("https://"),
  );
  if (!approved.length)
    return (
      <section
        id="reviews"
        className="premium-reviews premium-section"
        aria-labelledby="reviews-title"
      >
        <div className="premium-shell">
          <p className="premium-eyebrow">03 / CLIENT REVIEWS</p>
          <h2 id="reviews-title">
            A little perspective.
            <br />
            <em>From the other side.</em>
          </h2>
          <div
            className="premium-testimonials premium-review-skeletons"
            aria-label="Review layout awaiting customer feedback"
          >
            {[1, 2, 3].map((n) => (
              <div className="premium-skeleton-card" key={n} aria-hidden="true">
                <div className="premium-skeleton-line" />
                <div className="premium-skeleton-line" />
                <div className="premium-skeleton-line premium-skeleton-short" />
                <div className="premium-skeleton-person">
                  <span />
                  <div>
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  return (
    <section
      id="reviews"
      className="premium-reviews premium-section"
      aria-labelledby="reviews-title"
    >
      <div className="premium-shell">
        <p className="premium-eyebrow">03 / CLIENT REVIEWS</p>
        <h2 id="reviews-title">In their words.</h2>
        <div className="premium-testimonials">
          {approved.map((item) => (
            <figure key={`${item.name}-${item.sourceUrl}`}>
              <blockquote>
                <p>{item.quote}</p>
              </blockquote>
              <figcaption>
                {item.photo && (
                  <Image src={item.photo} alt="" width={48} height={48} />
                )}
                <div>
                  <strong>{item.name}</strong>
                  {item.company && <span>{item.company}</span>}
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the original review
                  </a>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
