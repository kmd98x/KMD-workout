"use client";

import type { ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  children,
  zIndex = 40,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Stacking order relative to other fixed overlays (e.g. BottomNav at
   * z-30) — lets a caller render its own Sheet instance below the shared
   * SheetHost one so that gets pushed on top of it. */
  zIndex?: number;
}) {
  return (
    <div
      aria-hidden={!open}
      style={{ zIndex }}
      className={`fixed inset-0 transition-opacity duration-200 md:bg-black/60 md:backdrop-blur-sm ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`fixed inset-x-0 bottom-0 max-h-[92dvh] overflow-hidden rounded-t-[22px] border-t border-line bg-bg transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        } md:static md:mx-auto md:my-[6dvh] md:max-h-[88dvh] md:max-w-140 md:rounded-[22px] md:border`}
      >
        {children}
      </div>
    </div>
  );
}
