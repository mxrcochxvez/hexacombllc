"use client";

import dynamic from "next/dynamic";

const skeletonLabel = "mb-1.5 block h-3.5 w-24 rounded-sm bg-ink/8 font-display text-sm font-semibold";
const skeletonInput = "h-10 w-full rounded-md border border-border bg-surface";

const ContactFormClient = dynamic(
  () => import("@/components/ContactForm").then((mod) => mod.ContactForm),
  {
    ssr: false,
    loading: () => (
      <div role="status" aria-label="Loading contact form" aria-busy="true">
        {/* Name + Email row */}
        <div className="mb-4 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="mb-4 sm:mb-0">
            <span className={skeletonLabel} aria-hidden />
            <div className={skeletonInput} aria-hidden />
          </div>
          <div>
            <span className={skeletonLabel} aria-hidden />
            <div className={skeletonInput} aria-hidden />
          </div>
        </div>
        {/* Business + Phone row */}
        <div className="mb-4 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="mb-4 sm:mb-0">
            <span className={skeletonLabel} aria-hidden />
            <div className={skeletonInput} aria-hidden />
          </div>
          <div>
            <span className={skeletonLabel} aria-hidden />
            <div className={skeletonInput} aria-hidden />
          </div>
        </div>
        {/* Website */}
        <div className="mb-4">
          <span className={skeletonLabel} aria-hidden />
          <div className={skeletonInput} aria-hidden />
        </div>
        {/* Message */}
        <div className="mb-4">
          <span className={skeletonLabel} aria-hidden />
          <div className="h-20 w-full rounded-md border border-border bg-surface" aria-hidden />
        </div>
        {/* Turnstile */}
        <div className="mb-5 h-16 w-full max-w-[300px] rounded-md bg-surface" aria-hidden />
        {/* Submit */}
        <div className="h-12 w-full rounded-md bg-accent/30" aria-hidden />
      </div>
    ),
  }
);

export { ContactFormClient };
