const workstreams = [
  ["CARE", "Keep it working well", "Updates, speed, security, and the behind-the-scenes upkeep your site needs."],
  ["GET FOUND", "Help customers find you", "Local search improvements and helpful content based on what people are looking for."],
  ["UNDERSTAND", "See what visitors do", "Simple reporting that shows how people use your site and where they reach out."],
  ["IMPROVE", "Make useful changes", "We update pages and messaging based on what is working, not guesswork."],
];

export default function WhyHexacomb() {
  return (
    <section id="growth-system" className="growth-system" aria-labelledby="why-heading">
      <div className="growth-shell growth-system-grid">
        <div className="growth-system-intro">
          <h2 id="why-heading">One person to keep your website moving.</h2>
          <p>Instead of juggling separate people for updates, SEO, reporting, and content, you have one website partner who handles the full picture.</p>
        </div>
        <ol className="workstream-ledger">
          {workstreams.map(([code, title, body]) => (
            <li key={code} className="workstream-row"><span className="workstream-code">{code}</span><div><h3>{title}</h3><p>{body}</p></div></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
