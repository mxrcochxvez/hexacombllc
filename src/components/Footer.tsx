import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">
        <Link href="/" className="footer-logo" aria-label="Hexacomb home">
          <span className="logo-hex" aria-hidden />
          Hexacomb
        </Link>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/website-audit">Audit</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <p>Built with care. Delivered with clarity.</p>
      </div>
    </footer>
  );
}
