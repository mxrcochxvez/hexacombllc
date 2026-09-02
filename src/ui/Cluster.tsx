import type { ClusterProps } from "./types";

export function Cluster({ gap = "cluster", children }: ClusterProps) {
  return (
    <div className="ui-cluster" data-gap={gap}>
      {children}
    </div>
  );
}
