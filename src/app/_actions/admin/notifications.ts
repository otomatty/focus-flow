"use server";

import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export interface AdminNotification {
	id: string;
	category: "security" | "performance" | "user" | "task" | "maintenance";
	priority: "high" | "medium" | "low";
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	actionRequired: boolean;
	actionUrl?: string;
}

export const getAdminNotifications = cache(async () => {
	const supabase = await createClient();
	const notifications: AdminNotification[] = [];

	// セキュリティ関連の通知を取得
	const { data: securityLogs } = await supabase
		.schema("ff_logs")
		.from("system_logs")
		.select("*")
		.eq("event_source", "security")
		.order("created_at", { ascending: false })
		.limit(5);

	if (securityLogs) {
		notifications.push(
			...securityLogs.map((log) => ({
				id: `security-${log.id}`,
				category: "security" as const,
				priority: "high" as const,
				title: log.event_type,
				message:
					typeof log.event_data === "object" &&
					log.event_data &&
					!Array.isArray(log.event_data) &&
					"message" in log.event_data
						? String(log.event_data.message)
						: log.event_source,
				timestamp: log.created_at ?? new Date().toISOString(),
				isRead: false,
				actionRequired: true,
			})),
		);
	}

	// パフォーマンス関連の通知を取得
	const { data: dbSize } = await supabase.rpc("get_db_size");
	const { data: storageSize } = await supabase.rpc("get_storage_size");

	if (dbSize?.[0]?.size_mb && dbSize[0].size_mb > 800) {
		notifications.push({
			id: "db-size-warning",
			category: "performance",
			priority: "medium",
			title: "データベース容量警告",
			message: `データベースの使用量が80%を超えています（${Math.round(dbSize[0].size_mb)}MB）`,
			timestamp: new Date().toISOString(),
			isRead: false,
			actionRequired: true,
			actionUrl: "/sys-admin/maintenance",
		});
	}

	if (storageSize?.[0]?.size_gb && storageSize[0].size_gb > 4) {
		notifications.push({
			id: "storage-size-warning",
			category: "performance",
			priority: "medium",
			title: "ストレージ容量警告",
			message: `ストレージの使用量が80%を超えています（${Math.round(storageSize[0].size_gb)}GB）`,
			timestamp: new Date().toISOString(),
			isRead: false,
			actionRequired: true,
			actionUrl: "/sys-admin/maintenance",
		});
	}

	// ユーザー管理関連の通知を取得
	const { data: pendingUsers } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("id")
		.eq("status", "pending")
		.limit(1);

	if (pendingUsers && pendingUsers.length > 0) {
		notifications.push({
			id: "pending-users",
			category: "user",
			priority: "medium",
			title: "承認待ちユーザー",
			message: "新規ユーザーの承認待ちがあります",
			timestamp: new Date().toISOString(),
			isRead: false,
			actionRequired: true,
			actionUrl: "/sys-admin/users",
		});
	}

	// タスク管理関連の通知を取得
	const { data: overdueTasks } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.select("id")
		.eq("status", "pending")
		.lt("due_date", new Date().toISOString())
		.limit(1);

	if (overdueTasks && overdueTasks.length > 0) {
		notifications.push({
			id: "overdue-tasks",
			category: "task",
			priority: "low",
			title: "期限切れタスク",
			message: "期限切れのタスクが存在します",
			timestamp: new Date().toISOString(),
			isRead: false,
			actionRequired: true,
			actionUrl: "/sys-admin/tasks",
		});
	}

	return notifications.sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
	);
});
