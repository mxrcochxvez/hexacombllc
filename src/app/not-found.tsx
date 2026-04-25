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
    <html lang="en">
      <body>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            background: "#faf8f5",
            color: "#1a1a1a",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 8rem)",
              margin: 0,
              color: "#d4a853",
            }}
          >
            404
          </h1>
          <p style={{ fontSize: "1.25rem", marginTop: "1rem" }}>
            This page doesn&rsquo;t exist.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "2rem",
              padding: "0.75rem 1.75rem",
              background: "#1a1a1a",
              color: "#faf8f5",
              borderRadius: "999px",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "1rem",
            }}
          >
            &larr; Back to Home
          </Link>
        </main>
      </body>
    </html>
  );
}
