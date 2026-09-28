"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { gsap } from "gsap";
import "./MagicBento.css";

export interface BentoCardProps {
  title: string;
  description: string;
  color?: string;
}

interface MagicBentoProps {
  cards: BentoCardProps[];
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

const DEFAULT_SPOTLIGHT_RADIUS = 340;
const DEFAULT_GLOW_COLOR = "245, 158, 11";

function calculateSpotlightValues(radius: number) {
  return {
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75,
  };
}

function updateCardGlow(
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
}

function GlobalSpotlight({
  gridRef,
  enabled,
  spotlightRadius,
  glowColor,
}: {
  gridRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  spotlightRadius: number;
  glowColor: string;
}) {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 720px;
      height: 720px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.22) 0%,
        rgba(${glowColor}, 0.1) 18%,
        rgba(${glowColor}, 0.04) 36%,
        transparent 68%
      );
      z-index: 40;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const clearGlow = () => {
      gridRef.current?.querySelectorAll(".magic-bento-card").forEach((card) => {
        (card as HTMLElement).style.setProperty("--glow-intensity", "0");
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll(".magic-bento-card");
      if (!mouseInside) {
        clearGlow();
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) glowIntensity = 1;
        else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlow(cardElement, event.clientX, event.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: event.clientX,
        top: event.clientY,
        duration: 0.12,
        ease: "power2.out",
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.9
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.9
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.45,
        ease: "power2.out",
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", clearGlow);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", clearGlow);
      spotlightRef.current?.remove();
      spotlightRef.current = null;
    };
  }, [enabled, glowColor, gridRef, spotlightRadius]);

  return null;
}

export default function MagicBento({
  cards,
  enableSpotlight = true,
  enableBorderGlow = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {enableSpotlight ? (
        <GlobalSpotlight
          gridRef={gridRef}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      ) : null}

      <div
        className="hobro-bento card-grid bento-section"
        ref={gridRef}
        style={{ "--glow-color": glowColor } as CSSProperties}
      >
        {cards.map((card) => (
          <article
            key={card.title}
            className={`magic-bento-card${enableBorderGlow ? " magic-bento-card--border-glow" : ""}`}
            style={{ backgroundColor: card.color ?? "#111111" }}
          >
            <h3 className="magic-bento-card__title">{card.title}</h3>
            <p className="magic-bento-card__description">{card.description}</p>
          </article>
        ))}
      </div>
    </>
  );
}
