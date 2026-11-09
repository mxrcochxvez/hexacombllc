"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { afterPagePaint } from "@/lib/deferred-media";

export default function PremiumHeroVideo({
  src,
  poster,
}: {
  src: string | null;
  poster: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const cancelAutoplay = useRef(() => {});
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () => {
      cancelAutoplay.current();
      const shouldPlay = !motion.matches && !connection?.saveData;
      if (!shouldPlay) {
        ref.current?.pause();
        setEnabled(false);
        setPaused(true);
        return;
      }
      // Let the poster and page finish loading/painting before downloading film.
      cancelAutoplay.current = afterPagePaint(window, () => {
        if (!motion.matches && !connection?.saveData) setEnabled(true);
      });
    };
    update();
    motion.addEventListener("change", update);
    return () => {
      cancelAutoplay.current();
      motion.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (enabled) void ref.current?.play().catch(() => setPaused(true));
  }, [enabled]);
  async function toggle() {
    cancelAutoplay.current();
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
          loading="eager"
          fetchPriority="high"
          unoptimized
          sizes="100vw"
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
          preload="none"
          aria-label="Hexacomb background film"
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
