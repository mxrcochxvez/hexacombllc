import Link from "next/link";

const places = [
  { town: "Fresno", detail: "Unreelviews · The Bug Dude" },
  { town: "Clovis", detail: "Where I answer from" },
  { town: "Sanger", detail: "M5 Painting" },
] as const;

export default function CentralValleyMap() {
  return (
    <section className="hobro-map" aria-labelledby="valley-map-heading">
      <div className="hobro-shell hobro-map-layout">
        <div className="hobro-map-copy">
          <h2 id="valley-map-heading">The same place you sell.</h2>
          <p className="hobro-map-lead">
            Your customers already drive these roads. The site should know that
            too.
          </p>
          <p className="hobro-map-body">
            The work above is Fresno and Sanger. I answer from Clovis. When
            someone nearby searches on their phone, the site should feel like
            it was made for that town.
          </p>
        </div>

        <figure className="hobro-map-figure">
          <img
            src="/images/fresno_satellite_dark.jpg"
            alt=""
            width={1376}
            height={768}
          />
          <figcaption>Fresno at night, looking east toward the Sierra.</figcaption>
        </figure>

        <div className="hobro-map-proof">
          <ul className="hobro-map-places">
            {places.map((place) => (
              <li key={place.town}>
                <span className="hobro-map-town">{place.town}</span>
                <span className="hobro-map-detail">{place.detail}</span>
              </li>
            ))}
          </ul>
          <Link href="#contact" className="hobro-map-ask">
            Let&apos;s talk
          </Link>
        </div>
      </div>
    </section>
  );
}
