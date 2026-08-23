export default function SiteSignalDecorations() {
  return (
    <div className="site-signal-decorations" aria-hidden="true">
      <span className="site-signal-lane site-signal-lane-east">
        <i className="site-signal-packet" />
        <i className="site-signal-packet" />
      </span>
      <span className="site-signal-lane site-signal-lane-west">
        <i className="site-signal-packet" />
      </span>
    </div>
  );
}
