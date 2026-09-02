import type { PageProps } from "./types";

export function Page({ density, width = "shell", children }: PageProps) {
  return (
    <div className="ui-page" data-density={density} data-width={width} id="main-content">
      {children}
    </div>
  );
}
