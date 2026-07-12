"use client";

import type { ReactNode } from "react";

export function Chip({
  active,
  small,
  onClick,
  children,
}: {
  active?: boolean;
  small?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border font-semibold transition-colors ${
        small ? "px-3 py-1.5 text-[12.5px]" : "px-[15px] py-[9px] text-[13.5px]"
      } ${
        active
          ? "border-blue bg-blue text-white"
          : "border-line bg-surface text-muted hover:border-muted-2"
      }`}
    >
      {children}
    </button>
  );
}
