import type { ReactNode } from "react";
import { seasonalHeadline } from "@/lib/seasonal-theme";

export function AgencyPageHero({
  kicker,
  title,
  lead,
  actions,
  aside,
}: {
  kicker?: string;
  title: string;
  lead: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="hobro-page-hero">
      <div className={`hobro-shell${aside ? " hobro-page-hero-split" : ""}`}>
        <div>
          {kicker ? <p className="hobro-kicker">{kicker}</p> : null}
          <h1 className="hobro-page-title">{seasonalHeadline(title)}</h1>
          <div className="hobro-page-lead">{lead}</div>
          {actions ? <div className="hobro-page-actions">{actions}</div> : null}
        </div>
        {aside}
      </div>
    </section>
  );
}

