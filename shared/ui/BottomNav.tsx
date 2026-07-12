"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Workout",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 6.5l11 11" />
        <rect
          x="1.7"
          y="8.2"
          width="3.5"
          height="7.6"
          rx="1"
          transform="rotate(-45 3.4 12)"
        />
        <rect
          x="18.8"
          y="8.2"
          width="3.5"
          height="7.6"
          rx="1"
          transform="rotate(-45 20.6 12)"
        />
      </svg>
    ),
  },
  {
    href: "/progress",
    label: "Progress",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 15l4-5 3 3 4-6" />
      </svg>
    ),
  },
  {
    href: "/stats",
    label: "Statistics",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="12" width="4" height="8" rx="1" />
        <rect x="10" y="7" width="4" height="13" rx="1" />
        <rect x="17" y="4" width="4" height="16" rx="1" />
      </svg>
    ),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex justify-center gap-2 border-t border-line bg-black/90 py-[9px] backdrop-blur-md md:inset-x-auto md:bottom-[22px] md:left-1/2 md:w-auto md:-translate-x-1/2 md:rounded-full md:border md:bg-[rgba(24,24,26,0.94)] md:p-1.5 md:shadow-[0_10px_34px_rgba(0,0,0,0.55)]"
      style={{ paddingBottom: "max(9px, env(safe-area-inset-bottom))" }}
    >
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 rounded-xl px-6 py-1.5 text-[11px] font-semibold md:flex-row md:gap-2 md:rounded-full md:px-5 md:py-2 ${
              active ? "text-blue md:bg-surface-2" : "text-muted-2 hover:text-ink"
            }`}
          >
            <span className="h-[22px] w-[22px] md:h-[19px] md:w-[19px] [&>svg]:h-full [&>svg]:w-full">
              {tab.icon}
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
