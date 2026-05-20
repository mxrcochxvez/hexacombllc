const services = [
  {
    title: "Websites",
    description:
      "A clear site that loads fast, shows up on Google, and makes it easy for customers to call or book.",
  },
  {
    title: "Custom software",
    description:
      "Tools built for how you actually work, when spreadsheets and off-the-shelf apps are not enough.",
  },
  {
    title: "AI and automation",
    description:
      "Less time on repetitive tasks, without adding complexity for you or your staff.",
  },
  {
    title: "IT support",
    description:
      "Email, backups, security, and systems that stay running. We handle it so you do not have to.",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" style={{ padding: 0 }} className="bg-surface" aria-labelledby="services-heading">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <h2
            id="services-heading"
            className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight"
          >
            What we take off your plate
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            One partner for the technology your business depends on. No juggling freelancers
            or vendors.
          </p>
        </div>

        <ol className="mt-14 divide-y divide-border border-y border-border">
          {services.map((service, index) => (
            <li
              key={service.title}
              className="grid grid-cols-[3rem_1fr] gap-4 py-8 sm:grid-cols-[4rem_1fr] sm:gap-8 sm:py-10"
            >
              <span
                className="font-display text-2xl font-semibold tabular-nums text-accent sm:text-3xl"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">{service.title}</h3>
                <p className="mt-2 max-w-prose text-base leading-relaxed text-ink-muted">
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
