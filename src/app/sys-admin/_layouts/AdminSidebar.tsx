"use client";

import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { AppSidebarLogo } from "@/app/webapp/_layouts/AppSidebar/AppSidebarLogo";
import { AdminNavigation } from "./AdminNavigation";
import { AdminUserMenu } from "../_components/AdminUserMenu";

export function AdminSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<AppSidebarLogo />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>システム管理</SidebarGroupLabel>
					<SidebarGroupContent>
						<AdminNavigation />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<AdminUserMenu />
			</SidebarFooter>
		</Sidebar>
	);
}
