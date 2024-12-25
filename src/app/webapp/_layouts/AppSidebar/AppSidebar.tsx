"use client";

import React from "react";
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
	return (
		<Sidebar collapsible="icon" className={className}>
			<SidebarHeader>
				<AppSidebarLogo />
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<Separator />
			<SidebarFooter>
				<UserMenu />
			</SidebarFooter>
		</Sidebar>
	);
}
