"use client";

import { useEffect, useRef, useState } from "react";

interface DeviceOrientationEventWithPermission {
  requestPermission?: () => Promise<string>;
}

export default function DeviceTilt({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isTouchDevice || prefersReducedMotion) return;

    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;

    // iOS 13+ requires permission request for deviceorientation
    const requestPermission = async () => {
      if (typeof DOE.requestPermission === "function") {
        try {
          const response = await DOE.requestPermission();
          if (response === "granted") {
            setEnabled(true);
          }
        } catch {
          // permission denied or error
        }
      }
    };

    // Try to enable on first user interaction (required for iOS permission)
    const handleFirstInteraction = () => {
      requestPermission();
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };

    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    window.addEventListener("click", handleFirstInteraction, { once: true });

    // For Android and devices that don't need permission, enable after a frame
    // to avoid the synchronous setState-in-effect lint warning.
    let rafId = 0;
    if (typeof DOE.requestPermission !== "function") {
      rafId = requestAnimationFrame(() => setEnabled(true));
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let frame = 0;

    const MAX_TILT = 0.6; // barely perceptible nudge

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0; // left/right tilt (-90 to 90)
      const beta = event.beta ?? 0;   // front/back tilt (-180 to 180)

      // Very low sensitivity so it feels like a gentle suggestion, not a swing
      targetRotateY = Math.max(-MAX_TILT, Math.min(MAX_TILT, gamma * 0.03));
      targetRotateX = Math.max(-MAX_TILT, Math.min(MAX_TILT, (beta - 45) * 0.02));
    };

    const tick = () => {
      // Heavy smoothing — slow, gentle follow
      currentRotateX += (targetRotateX - currentRotateX) * 0.04;
      currentRotateY += (targetRotateY - currentRotateY) * 0.04;

      wrapper.style.transform = `perspective(1200px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("deviceorientation", handleOrientation);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.cancelAnimationFrame(frame);
      wrapper.style.transform = "";
    };
  }, [enabled]);

  return (
    <div
      ref={wrapperRef}
      style={{
        transformStyle: "preserve-3d",
        willChange: enabled ? "transform" : undefined,
        transition: enabled ? undefined : "transform 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}
