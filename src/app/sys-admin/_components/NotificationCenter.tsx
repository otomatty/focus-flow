"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Zap, Users, CheckSquare, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import type { AdminNotification } from "@/app/_actions/admin/notifications";

interface NotificationCenterProps {
	notifications: AdminNotification[];
}

function getNotificationIcon(category: AdminNotification["category"]) {
	switch (category) {
		case "security":
			return <Shield className="h-4 w-4" />;
		case "performance":
			return <Zap className="h-4 w-4" />;
		case "user":
			return <Users className="h-4 w-4" />;
		case "task":
			return <CheckSquare className="h-4 w-4" />;
		case "maintenance":
			return <Settings className="h-4 w-4" />;
	}
}

function getPriorityColor(priority: AdminNotification["priority"]) {
	switch (priority) {
		case "high":
			return "bg-destructive text-destructive-foreground";
		case "medium":
			return "bg-warning text-warning-foreground";
		case "low":
			return "bg-muted text-muted-foreground";
	}
}

export function NotificationCenter({ notifications }: NotificationCenterProps) {
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-medium">通知</CardTitle>
				{unreadCount > 0 && (
					<Badge variant="destructive">{unreadCount}件の未読</Badge>
				)}
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[400px] pr-4">
					<div className="space-y-4">
						{notifications.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								新しい通知はありません
							</p>
						) : (
							notifications.map((notification) => (
								<div
									key={notification.id}
									className={`flex gap-4 p-3 rounded-lg border ${
										!notification.isRead ? "bg-muted/50" : ""
									}`}
								>
									<div className="flex h-8 w-8 items-center justify-center rounded-full border">
										{getNotificationIcon(notification.category)}
									</div>
									<div className="space-y-1 flex-1">
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium leading-none">
												{notification.title}
											</p>
											<Badge
												variant="outline"
												className={getPriorityColor(notification.priority)}
											>
												{notification.priority === "high"
													? "緊急"
													: notification.priority === "medium"
														? "警告"
														: "通知"}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{notification.message}
										</p>
										<div className="flex items-center justify-between">
											<p className="text-xs text-muted-foreground">
												{formatDistanceToNow(new Date(notification.timestamp), {
													addSuffix: true,
													locale: ja,
												})}
											</p>
											{notification.actionRequired &&
												notification.actionUrl && (
													<Button
														variant="ghost"
														size="sm"
														asChild
														className="h-6 px-2"
													>
														<Link href={notification.actionUrl}>対応する</Link>
													</Button>
												)}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
