import { isHalloween, seasonalCopy } from "@/lib/seasonal-theme";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      role="main"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "75vh",
        padding: "3rem 2rem",
        fontFamily: "var(--font-geologica), system-ui, sans-serif",
        textAlign: "center",
        background: isHalloween ? "#19131f" : "#f3f1eb",
        color: isHalloween ? "#f7e9ce" : "#242723",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-instrument), Georgia, serif",
          fontWeight: 400,
          fontSize: "clamp(3.5rem, 8vw, 7rem)",
          margin: 0,
          color: isHalloween ? "#f29a52" : "#242723",
        }}
      >
        404
      </h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem", maxWidth: "40ch" }}>
        {seasonalCopy("This page doesn’t exist.", "This page has vanished into the night.")}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.85rem 1.5rem",
            background: "#242723",
            color: "#f3f1eb",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.95rem",
            minHeight: "44px",
          }}
        >
          Back to Home
        </Link>
        <Link
          href="/website-audit"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.85rem 1.5rem",
            border: "1px solid #242723",
            color: "inherit",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.95rem",
            minHeight: "44px",
          }}
        >
          Run a free website audit
        </Link>
        <Link
          href="/work"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.85rem 1.5rem",
            color: "inherit",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            fontSize: "0.95rem",
            minHeight: "44px",
          }}
        >
          See selected work
        </Link>
      </div>
    </main>
  );
}
