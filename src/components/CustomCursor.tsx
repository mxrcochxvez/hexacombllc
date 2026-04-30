"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const canUseCursor =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUseCursor) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;
    let frame = 0;

    document.documentElement.classList.add("has-custom-cursor");

    const move = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const setHover = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      cursor.classList.toggle(
        "is-hovering",
        Boolean(target.closest("a, button, input, textarea, select, summary"))
      );
    };

    const tick = () => {
      cursorX += (pointerX - cursorX) * 0.34;
      cursorY += (pointerY - cursorY) * 0.34;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", setHover);
    window.addEventListener("pointerout", setHover);
    frame = window.requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", setHover);
      window.removeEventListener("pointerout", setHover);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden>
      <span className="cursor-drop" />
      <span className="cursor-drip" />
    </div>
  );
}
