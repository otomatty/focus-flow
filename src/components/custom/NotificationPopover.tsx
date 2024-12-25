"use client";

import { Bell, Circle, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { sampleNotifications } from "@/data/notifications";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

const typeStyles = {
	info: "border-blue-500/50",
	warning: "border-yellow-500/50",
	error: "border-red-500/50",
	success: "border-green-500/50",
};

const TypeIcon = ({
	type,
	className,
}: {
	type: Notification["type"];
	className?: string;
}) => {
	switch (type) {
		case "info":
			return <Info className={cn("h-4 w-4 text-blue-500", className)} />;
		case "warning":
			return (
				<AlertCircle className={cn("h-4 w-4 text-yellow-500", className)} />
			);
		case "error":
			return <AlertCircle className={cn("h-4 w-4 text-red-500", className)} />;
		case "success":
			return (
				<CheckCircle2 className={cn("h-4 w-4 text-green-500", className)} />
			);
		default:
			return null;
	}
};

export function NotificationPopover() {
	const unreadCount = sampleNotifications.filter((n) => !n.isRead).length;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center">
							<div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
							<div className="relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
								{unreadCount}
							</div>
						</div>
					)}
					<span className="sr-only">{unreadCount}件の未読通知があります</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="flex items-center justify-between p-4 pb-2">
					<span className="font-medium">通知</span>
					<Link
						href="/webapp/notifications"
						className="text-sm text-muted-foreground hover:text-primary"
					>
						すべて表示
					</Link>
				</div>
				<ScrollArea className="h-[300px]">
					<div className="space-y-1">
						{sampleNotifications.slice(0, 5).map((notification) => (
							<div
								key={notification.id}
								className={cn(
									"flex flex-col gap-1 p-4 hover:bg-muted/50 border-l-4",
									typeStyles[notification.type],
									!notification.isRead ? "bg-muted/30" : "",
								)}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<TypeIcon type={notification.type} />
										<span className="text-sm font-medium">
											{notification.title}
										</span>
										{!notification.isRead && (
											<Circle className="h-2 w-2 fill-current text-blue-500" />
										)}
									</div>
									<span className="text-xs text-muted-foreground">
										{formatDistanceToNow(notification.timestamp, {
											addSuffix: true,
											locale: ja,
										})}
									</span>
								</div>
								<p className="text-sm text-muted-foreground pl-6">
									{notification.message}
								</p>
							</div>
						))}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
