"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Timer, BarChart2, History, Settings } from "lucide-react";

const navItems = [
	{ href: "/webapp/focus", label: "Focus", icon: Timer },
	{ href: "/webapp/focus/statistics", label: "統計", icon: BarChart2 },
	{ href: "/webapp/focus/history", label: "履歴", icon: History },
	{ href: "/webapp/focus/settings", label: "設定", icon: Settings },
];

export function FocusNavigation() {
	const pathname = usePathname();

	return (
		<nav className="flex items-center justify-center gap-2 rounded-lg bg-card p-1">
			{navItems.map(({ href, label, icon: Icon }) => (
				<Link
					key={href}
					href={href}
					className={cn(
						"flex items-center gap-2 rounded-md px-4 py-2 transition-colors",
						"hover:bg-accent hover:text-accent-foreground",
						pathname === href
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground",
					)}
				>
					<Icon className="h-4 w-4" />
					<span>{label}</span>
				</Link>
			))}
		</nav>
	);
}
