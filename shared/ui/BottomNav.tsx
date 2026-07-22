"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, LineChart, BarChart3 } from "lucide-react";

const TABS = [
	{
		href: "/",
		label: "Workout",
		icon: <Dumbbell strokeWidth={1.8} />,
	},
	{
		href: "/progress",
		label: "Progress",
		icon: <LineChart strokeWidth={1.8} />,
	},
	{
		href: "/stats",
		label: "Statistics",
		icon: <BarChart3 strokeWidth={1.8} />,
	},
] as const;

export function BottomNav() {
	const pathname = usePathname();

	if (pathname === "/login") return null;

	return (
		<nav
			className="fixed inset-x-0 bottom-0 z-30 flex justify-center gap-2 border-t border-line bg-black/90 py-2.25 backdrop-blur-md md:inset-x-auto md:bottom-5.5 md:left-1/2 md:w-auto md:-translate-x-1/2 md:rounded-full md:border md:bg-[rgba(24,24,26,0.94)] md:p-1.5 md:shadow-[0_10px_34px_rgba(0,0,0,0.55)]"
			style={{ paddingBottom: "max(9px, env(safe-area-inset-bottom))" }}
		>
			{TABS.map((tab) => {
				const active =
					tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
				return (
					<Link
						key={tab.href}
						href={tab.href}
						className={`flex flex-col items-center gap-1 rounded-xl px-6 py-1.5 text-[11px] font-semibold md:flex-row md:gap-2 md:rounded-full md:px-5 md:py-2 ${active ? "text-blue md:bg-surface-2" : "text-muted-2 hover:text-ink"
							}`}
					>
						<span className="h-5.5 w-5.5 md:h-4.75 md:w-4.75 [&>svg]:h-full [&>svg]:w-full">
							{tab.icon}
						</span>
						{tab.label}
					</Link>
				);
			})}
		</nav>
	);
}
