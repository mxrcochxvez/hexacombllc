/** Start below-the-fold services once nearby; keyboard focus can also opt in. */
export function observeNearby(element: Element, start: () => void) {
  if (typeof IntersectionObserver === "undefined") {
    start();
    return () => {};
  }
  let started = false;
  const observer = new IntersectionObserver((entries) => {
    if (!started && entries.some((entry) => entry.isIntersecting)) {
      started = true;
      observer.disconnect();
      start();
    }
  }, { rootMargin: "400px" });
  observer.observe(element);
  return () => {
    started = true;
    observer.disconnect();
  };
}

/** Keep optional video off the critical resource path, with cancellable work. */
export function afterPagePaint(win: Window, start: () => void) {
  let cancelled = false;
  let frame = 0;
  let idle = 0;
  let timer = 0;
  const run = () => { if (!cancelled) start(); };
  const loaded = () => {
    frame = win.requestAnimationFrame(() => {
      frame = win.requestAnimationFrame(() => {
        if (cancelled) return;
        if (typeof win.requestIdleCallback === "function") {
          idle = win.requestIdleCallback(run, { timeout: 2000 });
        } else {
          timer = win.setTimeout(run, 0);
        }
      });
    });
  };
  if (win.document.readyState === "complete") loaded();
  else win.addEventListener("load", loaded, { once: true });
  return () => {
    cancelled = true;
    win.removeEventListener("load", loaded);
    win.cancelAnimationFrame(frame);
    if (idle) win.cancelIdleCallback(idle);
    if (timer) win.clearTimeout(timer);
  };
}
