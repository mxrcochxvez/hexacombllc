"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Waves from "@/components/Waves";

const exploreLinks = [
  { href: "/pricing", label: "Plans & pricing" },
  { href: "/website-audit", label: "Website audit" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/human-rights", label: "Nonprofit & causes" },
  { href: "/intake", label: "Project intake" },
  { href: "/#contact", label: "Start a project" },
];

export default function Footer() {
  const [timeString, setTimeString] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTimeString(`${formatted} PT`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="hobro-footer">
      <div className="hobro-footer-waves" aria-hidden="true">
        <Waves
          lineColor="rgba(228, 194, 122, 0.72)"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
      <div className="hobro-footer-scrim" aria-hidden="true" />
      <div className="hobro-shell hobro-footer-content">
        <div className="hobro-footer-wordmark">HEXACOMB</div>
        <div className="hobro-footer-grid">
          <div>
            <span className="hobro-footer-title">Studio</span>
            <p>
              Clovis &amp; Fresno, California
              <br />
              {timeString}
            </p>
            <p>Your website should be working for you when you can&apos;t.</p>
          </div>
          <div>
            <span className="hobro-footer-title">Explore</span>
            <ul className="hobro-footer-links">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="hobro-footer-title">Contact</span>
            <a href="mailto:marco@hexacombllc.com">marco@hexacombllc.com</a>
            <p>Reply from Marco, usually within a day.</p>
          </div>
        </div>
        <div className="hobro-footer-bottom">
          <span>© {year} Hexacomb LLC</span>
          <span>Built in the Central Valley</span>
          <span>
            <Link href="/dashboard">Studio portal</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
