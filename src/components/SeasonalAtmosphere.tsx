"use client";

import { useState } from "react";

/** Motion is decorative, optional, and never captures pointer events. */
export default function SeasonalAtmosphere() {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <div className="seasonal-atmosphere" data-paused={paused} aria-hidden="true">
        <div className="seasonal-fog seasonal-fog-one" />
        <div className="seasonal-fog seasonal-fog-two" />
        <span className="seasonal-ember seasonal-ember-one" />
        <span className="seasonal-ember seasonal-ember-two" />
        <span className="seasonal-ember seasonal-ember-three" />
      </div>
      <button className="seasonal-motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? "Resume atmosphere" : "Pause atmosphere"}
      </button>
    </>
  );
}
