"use client";

import { useEffect, useRef, useState } from "react";

const nodes = [
  { label: "Search", detail: "Someone nearby looks for what you do" },
  { label: "Your site", detail: "They land on clear pages that load" },
  { label: "Call", detail: "The next step is obvious — call or inquire" },
];

export default function CallFlowDiagram() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((v) => (v + 1) % nodes.length), 2800);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      ref={ref}
      className="call-flow"
      data-active={active}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      aria-label="How a customer reaches you: search, your site, then a call"
    >
      <div className="call-flow-head">
        <span>Flow diagram</span>
        <strong>Search → site → call</strong>
      </div>
      <div className="call-flow-track" aria-hidden>
        <i style={{ width: `${((active + 1) / nodes.length) * 100}%` }} />
      </div>
      <ol className="call-flow-nodes">
        {nodes.map((node, index) => (
          <li key={node.label} data-on={index <= active ? "true" : "false"}>
            <button
              type="button"
              className="call-flow-node"
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <strong>{node.label}</strong>
              <small>{node.detail}</small>
            </button>
          </li>
        ))}
      </ol>
      <p className="call-flow-note">When care stops, the flow dries up. We keep the gates open.</p>
    </div>
  );
}
