import type { SectionProps } from "./types";

export function Section({ pad = "section", tone = "canvas", labeledBy, className, children }: SectionProps) {
  const classes = ["ui-section", className].filter(Boolean).join(" ");
  return (
    <section className={classes} data-pad={pad} data-tone={tone} aria-labelledby={labeledBy}>
      <div className="ui-section__inner">{children}</div>
    </section>
  );
}
