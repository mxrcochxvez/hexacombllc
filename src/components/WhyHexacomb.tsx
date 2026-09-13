"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Search, ArrowRight } from "lucide-react";

const workstreams = [
  { id: "care", label: "Care.", title: "Keep it working well", body: "Updates, speed, security, and the behind-the-scenes upkeep your site needs.", outcome: "One less thing on your list.", tasks: ["Keep pages and services current", "Check the details behind the scenes", "Make the next step easy to find"] },
  { id: "find", label: "Find.", title: "Help customers find you", body: "Local search improvements and helpful content based on what people are looking for.", outcome: "Be there when they look.", tasks: ["Understand what local customers search for", "Give each service a useful page", "Keep business information consistent"] },
  { id: "understand", label: "Understand.", title: "See what visitors do", body: "Simple reporting that shows how people use your site and where they reach out.", outcome: "Less data. More direction.", tasks: ["See how people arrive", "Find where the path gets confusing", "Choose the next useful improvement"] },
  { id: "improve", label: "Improve.", title: "Make useful changes", body: "We update pages and messaging based on what is working, not guesswork.", outcome: "Keep making it better.", tasks: ["Explain the offer clearly", "Remove friction from getting in touch", "Review the response and keep learning"] },
];

export default function WhyHexacomb() {
  const [active, setActive] = useState(workstreams[0]);
  return (
    <section id="growth-system" className="growth-system care-explorer" aria-labelledby="why-heading">
      <div className="growth-shell">
        <div className="care-explorer-intro">
          <h2 id="why-heading">One person.<br />The whole picture.</h2>
          <p>Instead of juggling separate people for updates, SEO, reporting, and content, you have one website partner who handles the full picture.</p>
        </div>
        <div className="care-explorer-layout">
          <div className="care-explorer-choices" role="group" aria-label="Explore your website support">
            {workstreams.map((item) => <button key={item.id} type="button" aria-pressed={active.id === item.id} aria-controls="care-detail" onClick={() => setActive(item)}><span>{item.label}</span><ArrowUpRight size={32} aria-hidden /></button>)}
          </div>
          <div id="care-detail" className="care-detail" data-service={active.id}>
            <div className="care-preview" aria-hidden="true">
              <div className="care-preview-bar"><span>yourbusiness.com</span><span>Illustrative example</span></div>
              <div className="care-preview-page" key={active.id}>
                {active.id === "find" ? <div className="care-preview-search"><Search size={17} />A local business like yours</div> : <span className="care-preview-brand">Your business</span>}
                <strong>{active.outcome}</strong>
                {active.id === "understand" ? <div className="care-preview-path"><span>Search</span><ArrowRight size={16} /><span>Your site</span><ArrowRight size={16} /><span>Get in touch</span></div> : <div className="care-preview-lines"><i /><i /></div>}
                <div className="care-preview-action">{active.id === "care" ? "Everything in its place" : active.id === "find" ? "Close to home. Easy to find." : active.id === "understand" ? "Find the next opportunity" : "Let’s talk"}<ArrowUpRight size={18} /></div>
              </div>
            </div>
            <div className="care-detail-copy" aria-live="polite" aria-atomic="true">
              <h3>{active.title}</h3>
              <p>{active.body}</p>
              <ul>{active.tasks.map((task) => <li key={task}><Check size={16} aria-hidden />{task}</li>)}</ul>
            </div>
            <Link href="/pricing" className="growth-text-link">Find the right level of support <ArrowUpRight size={17} aria-hidden /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
