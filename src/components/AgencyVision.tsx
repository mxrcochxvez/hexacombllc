import MoltenMetal from "@/components/MoltenMetal";

export default function AgencyVision() {
  return (
    <section id="agency" className="hobro-vision">
      <div className="hobro-vision-metal" aria-hidden="true">
        <MoltenMetal
          color1="#856200"
          color2="#f2d551"
          color3="#4d3600"
          speed={0.2}
          scale={4}
          detail={3}
          glow={2.2}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.55}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction={false}
          mouseStrength={0.3}
          opacity={1}
        />
      </div>
      <div className="hobro-shell hobro-vision-grid">
        <div>
          <p className="hobro-kicker">The point</p>
          <h2>Same person. Start to finish.</h2>
        </div>
        <div>
          <p>
            Hexacomb is Marco Chavez in Clovis. There is no account manager
            to retell the problem, and nobody offshore waiting on a ticket.
            Slow page, dead form, a Google listing that went quiet — you are
            already talking to the one who will fix it.
          </p>
          <p>
            A website is not something you pay for once and leave. It is who
            speaks for the business when you are on a job. Someone has to
            keep owning that. I do.
          </p>
          <p className="hobro-vision-meta">Marco Chavez · Clovis, California</p>
        </div>
      </div>
    </section>
  );
}
