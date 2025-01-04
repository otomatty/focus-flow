"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Users,
	Settings,
	Database,
	Power,
	Shield,
	HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface QuickActionButton {
	icon: React.ReactNode;
	label: string;
	href: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
}

const QUICK_ACTIONS: QuickActionButton[] = [
	{
		icon: <Users className="h-4 w-4" />,
		label: "ユーザー管理",
		href: "/sys-admin/users",
	},
	{
		icon: <Settings className="h-4 w-4" />,
		label: "システム設定",
		href: "/sys-admin/settings",
	},
	{
		icon: <Database className="h-4 w-4" />,
		label: "バックアップ",
		href: "/sys-admin/backup",
	},
	{
		icon: <Power className="h-4 w-4" />,
		label: "メンテナンスモード",
		href: "/sys-admin/maintenance",
		variant: "destructive",
	},
	{
		icon: <Shield className="h-4 w-4" />,
		label: "セキュリティ",
		href: "/sys-admin/security",
	},
	{
		icon: <HelpCircle className="h-4 w-4" />,
		label: "ヘルプ",
		href: "/sys-admin/help",
		variant: "outline",
	},
];

export function QuickActions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>クイックアクション</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
					{QUICK_ACTIONS.map((action) => (
						<Button
							key={action.href}
							variant={action.variant || "secondary"}
							className="h-24 flex-col gap-2"
							asChild
						>
							<Link href={action.href}>
								{action.icon}
								<span className="text-xs">{action.label}</span>
							</Link>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
