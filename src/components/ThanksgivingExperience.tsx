"use client";

import { useEffect, useRef, useState } from "react";
import { ThanksgivingJazzEngine } from "@/lib/thanksgiving-audio";

const LEAVES = [
  { x: "6%", size: "22px", color: "#c85a22", dur: "15s", delay: "0s", drift: "38px" },
  { x: "18%", size: "18px", color: "#d98a2b", dur: "19s", delay: "-4s", drift: "-32px" },
  { x: "31%", size: "24px", color: "#9f3c18", dur: "17s", delay: "-9s", drift: "46px" },
  { x: "47%", size: "19px", color: "#b86b24", dur: "21s", delay: "-2s", drift: "-40px" },
  { x: "62%", size: "22px", color: "#8b2f1c", dur: "16s", delay: "-7s", drift: "34px" },
  { x: "76%", size: "20px", color: "#d48426", dur: "18s", delay: "-12s", drift: "-28px" },
  { x: "89%", size: "23px", color: "#b6481e", dur: "20s", delay: "-5s", drift: "30px" },
];

export function ThanksgivingRibbon() {
  return (
    <div className="tg-ribbon" role="region" aria-label="Thanksgiving greeting">
      <div className="tg-ribbon-inner">
        <span className="tg-ribbon-badge">Happy Thanksgiving</span>
        <span>
          Grateful for the Fresno &amp; Clovis businesses we get to build with
          every day.
        </span>
      </div>
    </div>
  );
}

export default function ThanksgivingExperience() {
  const engineRef = useRef<ThanksgivingJazzEngine | null>(null);
  const userPausedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForGesture, setWaitingForGesture] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [leavesPaused, setLeavesPaused] = useState(false);

  useEffect(() => {
    const engine = new ThanksgivingJazzEngine();
    engineRef.current = engine;

    let active = true;

    const tryStart = async () => {
      if (!active || userPausedRef.current) return;
      const started = await engine.start();
      if (!active) return;
      if (started) {
        setIsPlaying(true);
        setWaitingForGesture(false);
        removeGestureListeners();
      } else {
        setWaitingForGesture(true);
      }
    };

    const handleFirstGesture = () => {
      void tryStart();
    };

    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    // Attempt immediate autoplay; fall back cleanly to first interaction if blocked
    void tryStart();
    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    return () => {
      active = false;
      removeGestureListeners();
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const togglePlayback = async () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isPlaying) {
      userPausedRef.current = true;
      engine.pause();
      setIsPlaying(false);
      setWaitingForGesture(false);
    } else {
      userPausedRef.current = false;
      const started = await engine.start();
      setIsPlaying(started);
      setWaitingForGesture(!started);
    }
  };

  const handleVolumeChange = (nextVolume: number) => {
    setVolume(nextVolume);
    engineRef.current?.setVolume(nextVolume);
  };

  return (
    <>
      <div
        className="tg-leaves"
        data-paused={leavesPaused}
        aria-hidden="true"
      >
        {LEAVES.map((leaf, index) => (
          <svg
            key={index}
            className="tg-leaf"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={
              {
                "--leaf-x": leaf.x,
                "--leaf-size": leaf.size,
                "--leaf-color": leaf.color,
                "--leaf-dur": leaf.dur,
                "--leaf-delay": leaf.delay,
                "--leaf-drift": leaf.drift,
              } as React.CSSProperties
            }
          >
            <path d="M12 2L14.2 7.2L19.5 5.5L16.8 10.4L21.5 12.2L16.2 14.5L17.4 18.8L12.8 16.4V22H11.2V16.4L6.6 18.8L7.8 14.5L2.5 12.2L7.2 10.4L4.5 5.5L9.8 7.2L12 2Z" />
          </svg>
        ))}
      </div>

      <aside
        className="tg-player"
        data-playing={isPlaying}
        aria-label="Thanksgiving background music player"
      >
        <div className="tg-player-art" aria-hidden="true">
          {/* Playful Snoopy-inspired beagle & autumn doghouse silhouette */}
          <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
            <path
              d="M6 26L16 18L26 26H6Z"
              fill="#b84a20"
            />
            <path
              d="M11 16C11 12.8 13.8 11 17.5 11C20.5 11 22.8 12.4 23.4 14.4C24.2 14.7 24.6 15.6 24.1 16.4C23.5 17.3 21.8 17.4 20.4 17.4H11.5C11.2 17.4 11 16.8 11 16Z"
              fill="#ffffff"
              stroke="#2c1b12"
              strokeWidth="1.5"
            />
            <ellipse cx="14.2" cy="15.2" rx="2.1" ry="3.2" fill="#2c1b12" />
            <circle cx="23.5" cy="14.8" r="1.2" fill="#2c1b12" />
            <circle cx="19.5" cy="13.8" r="0.8" fill="#2c1b12" />
          </svg>
          {isPlaying && <span className="tg-player-notes">♪</span>}
        </div>

        <div className="tg-player-meta">
          <span className="tg-player-title">Thanksgiving Jazz</span>
          <span className="tg-player-status">
            {isPlaying
              ? "Playing · Snoopy Autumn Trio"
              : waitingForGesture
                ? "Click anywhere or press Play"
                : "Paused"}
          </span>
        </div>

        <div className="tg-player-controls">
          <button
            type="button"
            className="tg-player-btn"
            onClick={() => void togglePlayback()}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <input
            type="range"
            className="tg-player-volume"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            aria-label="Music volume"
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
          />

          <button
            type="button"
            className="tg-player-btn tg-player-btn-secondary"
            onClick={() => setLeavesPaused((prev) => !prev)}
          >
            {leavesPaused ? "Show leaves" : "Pause leaves"}
          </button>
        </div>
      </aside>
    </>
  );
}
