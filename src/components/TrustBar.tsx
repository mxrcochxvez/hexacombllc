const trustItems = [
  "Local businesses served",
  "Fast turnaround",
  "No tech jargon",
  "AI-powered workflows",
  "Built to grow with you",
];

export default function TrustBar() {
  const marqueeItems = [...trustItems, ...trustItems, ...trustItems];

  return (
    <section className="trust-bar" aria-label="Hexacomb trust signals">
      <div className="trust-marquee">
        <div className="trust-track">
          {marqueeItems.map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <strong aria-hidden>✦</strong>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
