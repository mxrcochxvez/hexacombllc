const problems = [
  ["The site gets outdated", "Your offers, services, and business change. Your website should keep up."],
  ["Customers have trouble finding you", "If your business is hard to find in search, potential customers can end up choosing someone else."],
  ["It is hard to know what is working", "You may see website numbers, but not what they mean or what to do next."],
];

export default function ServicesGrid() {
  return (
    <section className="growth-problem" aria-labelledby="services-heading">
      <div className="growth-shell">
        <div className="growth-problem-heading">
          <div><h2 id="services-heading">Your website needs ongoing care.</h2></div>
          <p>You already have a business to run. We make sure your website keeps doing its job.</p>
        </div>
        <ul className="problem-strip">
          {problems.map(([title, body]) => (
            <li key={title}><h3>{title}</h3><p>{body}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
