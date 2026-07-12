"use client";

import type { ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-40 transition-opacity duration-200 md:bg-black/60 md:backdrop-blur-sm ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`fixed inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[22px] border-t border-line bg-bg transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        } md:static md:mx-auto md:my-[6vh] md:max-h-[88vh] md:max-w-140 md:rounded-[22px] md:border`}
      >
        {children}
      </div>
    </div>
  );
}
