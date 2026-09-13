const breaks = [
  {
    title: "The site gets outdated",
    body: "Your offers and services change. A neglected site still shows last year’s picture.",
  },
  {
    title: "Customers have trouble finding you",
    body: "If you are hard to find in search, people ready to buy can land on someone else.",
  },
  {
    title: "It is hard to know what is working",
    body: "You may see numbers, but not what they mean or what to do next.",
  },
];

export default function ServicesGrid() {
  return (
    <section id="website-care" className="growth-problem canal-problem" aria-labelledby="services-heading">
      <div className="growth-shell canal-sticky-shell">
        <div className="canal-sticky-copy">
          <h2 id="services-heading">When care stops, the field goes dry.</h2>
          <p>Your website needs ongoing attention. You already have a business to run — we keep the flow moving.</p>
        </div>
        <ul className="problem-strip canal-breaks">
          {breaks.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
