"use client";

import { useEffect } from "react";

/** iOS Safari ignores `user-scalable=no` and `touch-action` for pinch zoom;
 * its non-standard gesture events are the only way to suppress it. */
export function DisableZoom() {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", prevent);
    document.addEventListener("gesturechange", prevent);
    return () => {
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
    };
  }, []);

  return null;
}
