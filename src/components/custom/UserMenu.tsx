// データフェッチはServerActionsを使用してlayout.tsxで行う

"use client";

import { User, ChevronsUpDown, LogOut, Settings } from "lucide-react";
import {
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { userDataAtom } from "@/stores/userDataAtom";
import { signOut } from "@/app/_actions/auth";

interface UserMenuProps {
	additionalMenuItems?: React.ReactNode;
	className?: string;
}

export function UserMenu({ additionalMenuItems, className }: UserMenuProps) {
	const router = useRouter();
	const { toast } = useToast();
	const userData = useAtomValue(userDataAtom);

	if (!userData?.profile) {
		return null;
	}

	const getInitials = (displayName: string | null): string => {
		if (!displayName) return "U";
		return displayName
			.split(" ")
			.map((name) => name.charAt(0))
			.join("")
			.toUpperCase();
	};

	const handleLogout = async () => {
		try {
			const result = await signOut();
			if (result.error) {
				throw result.error;
			}
			toast({
				title: "ログアウト",
				description: "ログアウトしました",
			});
			router.push("/auth/login");
		} catch (error) {
			console.error("ログアウトエラー:", error);
			toast({
				title: "エラー",
				description: "ログアウトに失敗しました",
				variant: "destructive",
			});
		}
	};

	return (
		<SidebarMenu className={className}>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 mr-2">
								<AvatarImage src={userData.profile.profileImage ?? undefined} />
								<AvatarFallback>
									{getInitials(userData.profile.displayName)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{userData.profile.displayName}
								</span>
								<span className="truncate text-xs">
									{userData.profile.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end">
						<DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => router.push("/webapp/profile")}
							className="cursor-pointer"
						>
							<User className="mr-2 h-4 w-4" />
							プロフィール
						</DropdownMenuItem>
						{additionalMenuItems}
						<DropdownMenuItem
							onClick={() => router.push("/webapp/settings")}
							className="cursor-pointer"
						>
							<Settings className="mr-2 h-4 w-4" />
							設定
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleLogout}
							className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 dark:text-red-400 cursor-pointer"
						>
							<LogOut className="mr-2 h-4 w-4" />
							ログアウト
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
