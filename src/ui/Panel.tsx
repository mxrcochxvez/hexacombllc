import type { PanelProps } from "./types";

export function Panel({ children }: PanelProps) {
  return <div className="ui-panel">{children}</div>;
}
