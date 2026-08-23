const workstreams = [
  ["MANAGE", "Keep it sharp", "Updates, performance, security, and technical upkeep."],
  ["RANK", "Push for visibility", "Local SEO and content built around real searches."],
  ["MEASURE", "Watch behavior", "Clear reporting on what visitors actually do."],
  ["IMPROVE", "Make the next move", "Copy and pages changed from evidence—not guesses."],
];

export default function WhyHexacomb() {
  return (
    <section id="growth-system" className="growth-system" aria-labelledby="why-heading">
      <div className="growth-shell growth-system-grid">
        <div className="growth-system-intro">
          <h2 id="why-heading">We keep pressure on the website.</h2>
          <p>Not four vendors. Not another dashboard for you to manage. One continuous operating loop.</p>
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
