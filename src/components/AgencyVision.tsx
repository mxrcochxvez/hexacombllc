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
          <h2>Take the website off your plate.</h2>
        </div>
        <div>
          <p>
            Hexacomb is Marco Chavez, working from Clovis. There is no account
            manager relay and no offshore bench. If a page is slow or a form
            stops working, you are talking to the person who will fix it.
          </p>
          <p>
            The job is a site that keeps working when you can&apos;t. Fast
            pages, regular SEO checks, and a clear path to a call or a booked
            job, even at 11pm when you&apos;re done for the day.
          </p>
          <p className="hobro-vision-meta">Marco Chavez · Clovis, California</p>
        </div>
      </div>
    </section>
  );
}
