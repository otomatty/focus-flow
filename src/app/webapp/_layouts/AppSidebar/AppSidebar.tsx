"use client";

import React from "react";
import { Home, ListTodo, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "@/components/custom/UserMenu";
import { AppSidebarLogo } from "./AppSidebarLogo";
import { NavMain } from "./NavMain";

interface AppSidebarProps {
	className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
	const pathname = usePathname();

	const mainMenuItems = [
		{
			title: "ホーム",
			url: "/webapp",
			icon: Home,
			isActive: pathname === "/webapp",
		},
		{
			title: "タスク",
			url: "/webapp/tasks",
			icon: ListTodo,
			isActive: pathname === "/webapp/tasks",
		},
		{
			title: "設定",
			url: "/webapp/settings",
			icon: Settings,
			isActive: pathname === "/webapp/settings",
		},
	];

	return (
		<Sidebar collapsible="icon" className={className}>
			<SidebarHeader>
				<AppSidebarLogo />
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<NavMain items={mainMenuItems} />
			</SidebarContent>
			<Separator />
			<SidebarFooter>
				<UserMenu />
			</SidebarFooter>
		</Sidebar>
	);
}
