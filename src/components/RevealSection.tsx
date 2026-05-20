"use client";

import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface RevealSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  threshold?: number;
  ariaLabelledBy?: string;
}

export default function RevealSection({
  children,
  threshold = 0.15,
  className,
  ariaLabelledBy,
  ...rest
}: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "-60px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <section
      ref={ref}
      className={className}
      aria-labelledby={ariaLabelledBy}
      {...rest}
    >
      {children}
    </section>
  );
}
