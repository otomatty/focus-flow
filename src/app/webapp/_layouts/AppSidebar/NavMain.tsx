"use client";

import {
	ChevronRight,
	type LucideIcon,
	Construction,
	Home,
	ListTodo,
	Settings,
	Calendar,
	Focus,
	Target,
	Users,
	Trophy,
	Briefcase,
	Repeat,
	Clock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavMainItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	isInDevelopment?: boolean;
	items?: {
		title: string;
		url: string;
		isActive?: boolean;
		isInDevelopment?: boolean;
	}[];
}

const useMainMenuItems = (): NavMainItem[] => {
	const pathname = usePathname();

	return [
		{
			title: "ホーム",
			url: "/webapp",
			icon: Home,
			isActive: pathname === "/webapp",
		},
		{
			title: "プロジェクト",
			url: "/webapp/projects",
			icon: Briefcase,
			isActive: pathname === "/webapp/projects",
		},
		{
			title: "タスク",
			url: "/webapp/tasks",
			icon: ListTodo,
			isActive: pathname.startsWith("/webapp/tasks"),
			items: [
				{
					title: "タスクを確認する",
					url: "/webapp/tasks",
					isActive: pathname === "/webapp/tasks",
				},
				{
					title: "タスクを整理する",
					url: "/webapp/tasks/mindmap",
					isActive: pathname === "/webapp/tasks/mindmap",
				},
				{
					title: "タスクを作成する",
					url: "/webapp/tasks/create",
					isActive: pathname === "/webapp/tasks/create",
				},
			],
		},
		{
			title: "スケジュール",
			url: "/webapp/schedule",
			icon: Calendar,
			isActive: pathname === "/webapp/schedule",
			isInDevelopment: true,
		},
		{
			title: "タイムテーブル",
			url: "/webapp/timetable",
			icon: Clock,
			isActive: pathname === "/webapp/timetable",
			isInDevelopment: true,
		},
		{
			title: "集中モード",
			url: "/webapp/focus",
			icon: Focus,
			isActive: pathname === "/webapp/focus",
			isInDevelopment: true,
		},
		{
			title: "習慣トラッカー",
			url: "/webapp/habits",
			icon: Repeat,
			isActive: pathname === "/webapp/habits",
			isInDevelopment: true,
		},
		{
			title: "チーム",
			url: "/webapp/teams",
			icon: Users,
			isActive: pathname === "/webapp/teams",
			isInDevelopment: true,
		},
		{
			title: "目標設定",
			url: "/webapp/goals",
			icon: Target,
			isActive: pathname === "/webapp/goals",
			isInDevelopment: true,
		},
		{
			title: "クエスト",
			url: "/webapp/quests",
			icon: Trophy,
			isActive: pathname === "/webapp/quests",
			isInDevelopment: true,
		},
		{
			title: "設定",
			url: "/webapp/settings",
			icon: Settings,
			isActive: pathname === "/webapp/settings",
		},
	];
};

export function NavMain() {
	const items = useMainMenuItems();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>メインメニュー</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					// サブ項目がない場合はシンプルなメニュー項目を表示
					if (!item.items || item.items.length === 0) {
						const MenuContent = (
							<>
								{item.icon && <item.icon className="h-4 w-4" />}
								<span
									className={cn(
										item.isInDevelopment && "text-muted-foreground",
									)}
								>
									{item.title}
									{item.isInDevelopment && " (開発中)"}
								</span>
								{item.isInDevelopment && (
									<Construction className="ml-auto h-4 w-4 text-muted-foreground" />
								)}
							</>
						);

						return (
							<SidebarMenuItem key={item.title}>
								{item.isInDevelopment ? (
									<SidebarMenuButton
										tooltip={`${item.title} (開発中)`}
										isActive={false}
										className="cursor-not-allowed"
									>
										{MenuContent}
									</SidebarMenuButton>
								) : (
									<SidebarMenuButton
										asChild
										tooltip={item.title}
										isActive={item.isActive}
									>
										<Link href={item.url}>{MenuContent}</Link>
									</SidebarMenuButton>
								)}
							</SidebarMenuItem>
						);
					}

					// サブ項目がある場合は展開可能なメニュー項目を表示
					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={item.isActive}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										asChild={!item.isInDevelopment}
										tooltip={
											item.isInDevelopment
												? `${item.title} (開発中)`
												: item.title
										}
										isActive={item.isActive}
										className={cn(item.isInDevelopment && "cursor-not-allowed")}
									>
										{item.isInDevelopment ? (
											<div className="flex w-full items-center">
												{item.icon && <item.icon className="h-4 w-4" />}
												<span className="text-muted-foreground">
													{item.title}
													{item.isInDevelopment && " (開発中)"}
												</span>
												<Construction className="ml-auto h-4 w-4 text-muted-foreground" />
												<ChevronRight className="ml-1 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</div>
										) : (
											<div className="flex w-full items-center">
												{item.icon && <item.icon className="h-4 w-4" />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</div>
										)}
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												{subItem.isInDevelopment ? (
													<SidebarMenuSubButton className="cursor-not-allowed">
														<span className="text-muted-foreground">
															{subItem.title}
															{subItem.isInDevelopment && " (開発中)"}
														</span>
														<Construction className="ml-auto h-4 w-4 text-muted-foreground" />
													</SidebarMenuSubButton>
												) : (
													<SidebarMenuSubButton asChild>
														<Link href={subItem.url}>
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												)}
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
