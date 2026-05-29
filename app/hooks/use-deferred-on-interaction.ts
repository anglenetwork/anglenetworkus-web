"use client";

import { useCallback, useState } from "react";

/** Loads deferred UI (auth, ticker controls, etc.) after pointer, focus, or click. */
export function useDeferredOnInteraction() {
  const [armed, setArmed] = useState(false);
  const arm = useCallback(() => setArmed(true), []);

  const interactionProps = armed
    ? undefined
    : ({
        onPointerEnter: arm,
        onFocus: arm,
        onClick: arm,
      } as const);

  return { armed, interactionProps };
}
