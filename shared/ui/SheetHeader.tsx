"use client";

import type { ReactNode } from "react";
import { BackIcon, CloseIcon } from "./icons";

export function SheetHeader({
  title,
  onClose,
  closeIcon = "x",
  right,
}: {
  title: string;
  onClose: () => void;
  closeIcon?: "x" | "back";
  right?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-2.5 bg-bg py-4">
      <div className="flex w-11 justify-start">{right}</div>
      <h2 className="flex-1 truncate text-center text-[19px] font-bold">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center justify-center p-1.5 text-ink"
        aria-label={closeIcon === "back" ? "Back" : "Close"}
      >
        {closeIcon === "back" ? <BackIcon /> : <CloseIcon />}
      </button>
    </div>
  );
}
