const problems = [
  ["The site gets stale", "Offers change. Services change. The website does not keep up."],
  ["Search keeps moving", "Competitors publish while your rankings slowly give ground."],
  ["Reports go unread", "You get numbers, but nobody turns them into the next move."],
];

export default function ServicesGrid() {
  return (
    <section className="growth-problem" aria-labelledby="services-heading">
      <div className="growth-shell">
        <div className="growth-problem-heading">
          <div><h2 id="services-heading">The website never stays finished.</h2></div>
          <p>You already have a company to run. Your website still needs someone watching it.</p>
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
