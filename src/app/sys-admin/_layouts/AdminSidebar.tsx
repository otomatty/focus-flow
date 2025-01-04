"use client";

import { Settings, Users, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>システム管理</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<Link href="/sys-admin/users" passHref legacyBehavior>
									<SidebarMenuButton
										isActive={pathname === "/sys-admin/users"}
										tooltip="ユーザー管理"
									>
										<Users className="size-4" />
										<span>ユーザー管理</span>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<Link href="/sys-admin/settings" passHref legacyBehavior>
									<SidebarMenuButton
										isActive={pathname === "/sys-admin/settings"}
										tooltip="システム設定"
									>
										<Settings className="size-4" />
										<span>システム設定</span>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<Link href="/sys-admin/logs" passHref legacyBehavior>
									<SidebarMenuButton
										isActive={pathname === "/sys-admin/logs"}
										tooltip="システムログ"
									>
										<FileText className="size-4" />
										<span>システムログ</span>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
