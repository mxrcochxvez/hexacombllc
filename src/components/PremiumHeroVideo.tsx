"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function PremiumHeroVideo({
  src,
  poster,
}: {
  src: string | null;
  poster: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () => {
      setEnabled(!motion.matches && !connection?.saveData);
      setPaused(motion.matches || !!connection?.saveData);
    };
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (enabled) void ref.current?.play().catch(() => setPaused(true));
  }, [enabled]);
  async function toggle() {
    if (!enabled) {
      setEnabled(true);
      setPaused(false);
      return;
    }
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setPaused(false);
      } catch {
        setPaused(true);
      }
    } else {
      video.pause();
      setPaused(true);
    }
  }
  return (
    <div className="premium-film">
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          preload
          unoptimized
          sizes="(max-width: 800px) 340px, 370px"
          className="premium-film-poster"
        />
      )}
      {src && (
        <video
          ref={ref}
          src={enabled ? src : undefined}
          poster={poster ?? undefined}
          autoPlay={enabled}
          muted={muted}
          loop
          playsInline
          controls
          preload="none"
          aria-label="Hexacomb website design film"
          onVolumeChange={() => setMuted(ref.current?.muted ?? true)}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
        />
      )}
      {!src && (
        <div className="premium-film-placeholder">
          <span className="premium-film-mark" aria-hidden="true">
            ⬡
          </span>
          <p>
            Made for your
            <br />
            <em>next chapter.</em>
          </p>
          <small>Video placement · awaiting your selected film</small>
        </div>
      )}
      {src && (
        <button
          className="premium-film-sound"
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Turn video sound on" : "Mute video"}
        >
          {muted ? "Sound on" : "Mute"}
        </button>
      )}
      {src && (
        <button
          className="premium-film-control"
          onClick={toggle}
          type="button"
          aria-label={paused ? "Play hero video" : "Pause hero video"}
        >
          {paused ? "Play film" : "Pause film"}
        </button>
      )}
    </div>
  );
}
