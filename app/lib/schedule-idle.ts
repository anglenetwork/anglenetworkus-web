/** Defer non-critical client work until the browser is idle. */
export function scheduleIdleTask(
  task: () => void,
  fallbackMs = 2000,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(task, { timeout: fallbackMs });
    return () => window.cancelIdleCallback(id);
  }

  const id = globalThis.setTimeout(task, 1);
  return () => globalThis.clearTimeout(id);
}
