export default function SiteSignalDecorations() {
  return (
    <div className="site-signal-decorations canal-decorations" aria-hidden="true">
      <span className="site-signal-lane site-signal-lane-east canal-lane">
        <i className="site-signal-packet canal-drop" />
        <i className="site-signal-packet canal-drop" />
      </span>
      <span className="site-signal-lane site-signal-lane-west canal-lane">
        <i className="site-signal-packet canal-drop" />
      </span>
    </div>
  );
}
