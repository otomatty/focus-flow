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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAtom, useAtomValue } from "jotai";
import {
	notificationsAtom,
	notificationsLoadingAtom,
	unreadNotificationsCountAtom,
	notificationStylesAtom,
} from "@/stores/notifications";
import { markNotificationAsRead } from "@/app/_actions/notifications";

// 通知の種類に応じたアイコン
const TypeIcon = ({
	actionType,
	className,
}: {
	actionType: string | null;
	className?: string;
}) => {
	switch (actionType) {
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
			return <Info className={cn("h-4 w-4 text-blue-500", className)} />;
	}
};

export function NotificationPopover() {
	const [notifications, setNotifications] = useAtom(notificationsAtom);
	const [isLoading, setIsLoading] = useAtom(notificationsLoadingAtom);
	const unreadCount = useAtomValue(unreadNotificationsCountAtom);
	const typeStyles = useAtomValue(notificationStylesAtom);

	const handleNotificationClick = async (notificationId: string) => {
		try {
			await markNotificationAsRead(notificationId);
			setNotifications(
				notifications.map((notification) =>
					notification.id === notificationId
						? { ...notification, read_at: new Date().toISOString() }
						: notification,
				),
			);
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
		}
	};

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
						{isLoading ? (
							<div className="flex justify-center items-center h-[200px]">
								<span className="text-sm text-muted-foreground">
									読み込み中...
								</span>
							</div>
						) : notifications.length === 0 ? (
							<div className="flex justify-center items-center h-[200px]">
								<span className="text-sm text-muted-foreground">
									通知はありません
								</span>
							</div>
						) : (
							notifications.map((notification) => (
								<button
									type="button"
									key={notification.id}
									className={cn(
										"w-full text-left flex flex-col gap-1 p-4 hover:bg-muted/50 border-l-4",
										typeStyles[
											notification.action_type as keyof typeof typeStyles
										] || typeStyles.info,
										!notification.read_at ? "bg-muted/30" : "",
									)}
									onClick={() => handleNotificationClick(notification.id)}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<TypeIcon actionType={notification.action_type} />
											<span className="text-sm font-medium">
												{(notification.action_data as { title: string })
													?.title || "通知"}
											</span>
											{!notification.read_at && (
												<Circle className="h-2 w-2 fill-current text-blue-500" />
											)}
										</div>
										<span className="text-xs text-muted-foreground">
											{notification.created_at &&
												formatDistanceToNow(new Date(notification.created_at), {
													addSuffix: true,
													locale: ja,
												})}
										</span>
									</div>
									<p className="text-sm text-muted-foreground pl-6">
										{notification.body}
									</p>
								</button>
							))
						)}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
