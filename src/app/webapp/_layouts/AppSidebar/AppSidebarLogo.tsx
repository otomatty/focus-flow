import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebarLogo() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					asChild
				>
					<Link href="/webapp">
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
							<Image
								src="/images/focus-flow_logo.svg"
								alt="Focus Flow"
								width={24}
								height={24}
							/>
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate text-lg font-bold">Focus Flow</span>
						</div>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
