type PinOptions = {
  scenes: number;
  query: string;
};

export function viewportHeight() {
  return Math.max(window.innerHeight, window.visualViewport?.height ?? 0);
}

export function attachScrollPin(track: HTMLElement, stage: HTMLElement, options: PinOptions) {
  const compact = window.matchMedia(options.query);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const navH = () => {
    const header = document.querySelector("header");
    return header ? Math.round(header.getBoundingClientRect().height) : 64;
  };

  const clear = () => {
    track.style.height = "";
    stage.style.position = "";
    stage.style.top = "";
    stage.style.left = "";
    stage.style.right = "";
    stage.style.width = "";
    stage.style.height = "";
    stage.style.zIndex = "";
  };

  const layout = () => {
    if (!compact.matches || reduced.matches || track.getAttribute("data-static") === "true") {
      clear();
      return;
    }
    const nav = navH();
    const view = viewportHeight();
    const stageH = Math.max(240, Math.round(view - nav));
    track.style.height = `${stageH * options.scenes}px`;
    const rect = track.getBoundingClientRect();
    stage.style.left = "0";
    stage.style.right = "0";
    stage.style.width = "100%";
    stage.style.height = `${stageH}px`;
    stage.style.zIndex = "1";
    if (rect.top > nav) {
      stage.style.position = "absolute";
      stage.style.top = "0";
      return;
    }
    if (rect.bottom < nav + stageH) {
      stage.style.position = "absolute";
      stage.style.top = `${Math.max(0, track.offsetHeight - stageH)}px`;
      return;
    }
    stage.style.position = "fixed";
    stage.style.top = `${nav}px`;
  };

  layout();
  window.addEventListener("scroll", layout, { passive: true });
  window.addEventListener("resize", layout);
  compact.addEventListener("change", layout);
  reduced.addEventListener("change", layout);
  window.visualViewport?.addEventListener("resize", layout);
  return () => {
    window.removeEventListener("scroll", layout);
    window.removeEventListener("resize", layout);
    compact.removeEventListener("change", layout);
    reduced.removeEventListener("change", layout);
    window.visualViewport?.removeEventListener("resize", layout);
    clear();
  };
}
