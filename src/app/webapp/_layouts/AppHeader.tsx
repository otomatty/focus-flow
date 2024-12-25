"use client";

import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { checkIsSystemAdmin } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { NotificationPopover } from "@/components/custom/NotificationPopover";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/custom/ThemeSwitcher";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppHeader() {
	const router = useRouter();
	const [isSystemAdmin, setIsSystemAdmin] = useState(false);

	useEffect(() => {
		const checkAdminStatus = async () => {
			const adminStatus = await checkIsSystemAdmin();
			setIsSystemAdmin(adminStatus);
		};

		checkAdminStatus().catch(console.error);
	}, []);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="px-4 mr-4 flex gap-2 h-14 items-center">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="h-8" />

				<div className="flex flex-1 items-center justify-end space-x-4">
					<NotificationPopover />
					{isSystemAdmin && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => router.push("/sys-admin")}
									>
										<Shield className="h-5 w-5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>システム管理者画面</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
}
