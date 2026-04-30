"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabelledBy?: string;
  threshold?: number;
}

export default function RevealSection({
  children,
  className = "",
  id,
  ariaLabelledBy,
  threshold = 0.1,
}: RevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <section
      ref={sectionRef}
      className={`reveal-scope ${className}`}
      id={id}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </section>
  );
}
