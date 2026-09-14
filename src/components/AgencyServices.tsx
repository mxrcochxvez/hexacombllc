const offers = [
  {
    title: "They can find you",
    body: "When someone in town searches for what you do, you show up. I keep checking that, not just on launch week.",
  },
  {
    title: "They know who to call",
    body: "Big phone number. Clear next step. Estimate, booking, or a tap-to-call. No scavenger hunt.",
  },
  {
    title: "It looks like a real company",
    body: "The site should feel as solid as the work you do. Not a leftover page with your logo dropped in.",
  },
  {
    title: "You don't have to touch it",
    body: "I keep it fast, updated, and working. You stay on the job. The website keeps selling.",
  },
];

export default function AgencyServices() {
  return (
    <section id="services" className="hobro-white hobro-services">
      <div className="hobro-shell">
        <div className="hobro-offer-head">
          <p className="hobro-kicker">What you get</p>
          <h2>A website that brings in work while you&apos;re out doing the work.</h2>
          <p>
            You should not have to think about the site. People find you, they
            trust you, they call you. I handle the rest.
          </p>
        </div>
        <div className="hobro-offer-table">
          {offers.map((offer) => (
            <article key={offer.title}>
              <h3>{offer.title}</h3>
              <p>{offer.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
