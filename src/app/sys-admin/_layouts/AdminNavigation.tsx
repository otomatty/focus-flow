import { Settings, Users, FileText, Trophy, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

const navigationItems = [
	{
		href: "/sys-admin/users",
		icon: Users,
		label: "ユーザー管理",
	},
	{
		href: "/sys-admin/quests",
		icon: Trophy,
		label: "クエスト管理",
	},
	{
		href: "/sys-admin/settings",
		icon: Settings,
		label: "システム設定",
	},
	{
		href: "/sys-admin/logs",
		icon: FileText,
		label: "システムログ",
	},
	{
		href: "/sys-admin/notifications",
		icon: Bell,
		label: "通知設定",
	},
] as const;

export function AdminNavigation() {
	const pathname = usePathname();

	return (
		<SidebarMenu>
			{navigationItems.map((item) => (
				<SidebarMenuItem key={item.href}>
					<Link href={item.href} passHref legacyBehavior>
						<SidebarMenuButton
							isActive={pathname === item.href}
							tooltip={item.label}
						>
							<item.icon className="size-4" />
							<span>{item.label}</span>
						</SidebarMenuButton>
					</Link>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}
