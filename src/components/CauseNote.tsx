import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CauseNote() {
  return (
    <section className="growth-cause-note" aria-labelledby="cause-heading">
      <div className="growth-shell">
        <p className="growth-cause-kicker">Human rights</p>
        <h2 id="cause-heading">This work matters to me.</h2>
        <p>
          I also build websites for human rights organizations and nonprofits.
          The point is to put a face on the cause — so people can see who is
          affected, who is doing the work, and how to help.
        </p>
        <Link
          href="/human-rights"
          className="growth-text-link"
          data-track="home_human_rights"
        >
          If that is you, read this <ArrowUpRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
