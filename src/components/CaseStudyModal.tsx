"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { CaseStudy } from "@/lib/cases";

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseStudyModal({
  caseStudy,
  isOpen,
  onClose,
}: CaseStudyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    const handleClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      onClose();
    };

    const preventInnerScroll = (event: Event) => {
      event.preventDefault();
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);
    dialog.addEventListener("wheel", preventInnerScroll, { passive: false });
    dialog.addEventListener("touchmove", preventInnerScroll, { passive: false });
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("wheel", preventInnerScroll);
      dialog.removeEventListener("touchmove", preventInnerScroll);
    };
  }, [onClose]);

  if (!caseStudy) return null;

  return (
    <dialog
      ref={dialogRef}
      className="hobro-modal"
      aria-labelledby="case-study-title"
    >
      <article className="hobro-case-dialog">
        <div className="hobro-case-dialog-shot">
          <Image
            src={caseStudy.imageSrc}
            alt={`${caseStudy.title} website`}
            width={1440}
            height={900}
            priority
          />
          <button
            type="button"
            className="hobro-case-dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="hobro-case-dialog-copy">
          <p className="hobro-case-dialog-meta">
            {caseStudy.city}
          </p>
          <h2 id="case-study-title">{caseStudy.title}</h2>
          <p>{caseStudy.summary}</p>
          <a
            href={caseStudy.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hobro-case-dialog-link"
          >
            Visit the live site
          </a>
        </div>
      </article>
    </dialog>
  );
}
