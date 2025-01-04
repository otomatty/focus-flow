"use client";

import React from "react";
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
import { AnnouncementCard } from "./AnnouncementCard";
import { sampleDashboardData } from "@/app/webapp/_fixtures/sample-dashboard-data";

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
			<SidebarContent className="flex flex-col justify-between gap-4">
				<NavMain />
				<AnnouncementCard announcements={sampleDashboardData.announcements} />
			</SidebarContent>
			<Separator />
			<SidebarFooter className="space-y-4">
				<UserMenu />
			</SidebarFooter>
		</Sidebar>
	);
}
