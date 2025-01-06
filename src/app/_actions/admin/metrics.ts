"use server";

import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export interface SystemMetrics {
	activeUsers: {
		total: number;
		today: number;
		newUsers: number;
	};
	tasks: {
		completed: number;
		pending: number;
		overdue: number;
	};
	resources: {
		dbSize: number;
		storageSize: number;
		realtimeConnections: number;
	};
}

export interface UserActivityData {
	date: string;
	users: number;
	newUsers: number;
}

export interface TaskCompletionData {
	date: string;
	completed: number;
	overdue: number;
}

export interface ApiRequestData {
	time: string;
	count: number;
	error: number;
}

export interface TimelineEvent {
	id: string;
	type: "user" | "system" | "error" | "success";
	title: string;
	description: string;
	timestamp: string;
}

// メトリクスの取得をキャッシュ
export const getSystemMetrics = cache(async () => {
	const supabase = await createClient();

	// アクティブユーザー数の取得
	const { data: activeUsers } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("id")
		.eq("status", "active");

	// 本日のアクティブユーザー数
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const { data: todayActiveUsers } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("id")
		.eq("status", "active")
		.gte("last_activity_at", today.toISOString());

	// 新規ユーザー数（過去30日）
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const { data: newUsers } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("id")
		.gte("created_at", thirtyDaysAgo.toISOString());

	// タスク統計
	const { data: tasks } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.select("status, due_date");
	const completedTasks =
		tasks?.filter((task) => task.status === "completed").length ?? 0;
	const pendingTasks =
		tasks?.filter(
			(task) => task.status === "not_started" || task.status === "in_progress",
		).length ?? 0;
	const overdueTasks =
		tasks?.filter(
			(task) =>
				(task.status === "not_started" || task.status === "in_progress") &&
				task.due_date &&
				new Date(task.due_date) < new Date(),
		).length ?? 0;

	// システムリソース情報の取得
	const { data: dbStats } = await supabase.rpc("get_db_size");
	const { data: storageStats } = await supabase.rpc("get_storage_size");
	const { data: realtimeStats } = await supabase.rpc(
		"get_realtime_connections",
	);

	return {
		activeUsers: {
			total: activeUsers?.length ?? 0,
			today: todayActiveUsers?.length ?? 0,
			newUsers: newUsers?.length ?? 0,
		},
		tasks: {
			completed: completedTasks,
			pending: pendingTasks,
			overdue: overdueTasks,
		},
		resources: {
			dbSize: dbStats?.[0]?.size_mb ?? 0,
			storageSize: storageStats?.[0]?.size_gb ?? 0,
			realtimeConnections: realtimeStats?.[0]?.connections ?? 0,
		},
	};
});

// ユーザーアクティビティの推移を取得
export const getUserActivityData = cache(async () => {
	const supabase = await createClient();

	const { data } = await supabase.rpc("get_user_activity_by_month", {
		months_limit: 7,
	});

	return (
		data?.map((item) => ({
			date: new Date(item.month).toLocaleDateString("ja-JP", { month: "long" }),
			users: item.active_users,
			newUsers: item.new_users,
		})) ?? []
	);
});

// タスク完了率の推移を取得
export const getTaskCompletionData = cache(async () => {
	const supabase = await createClient();

	const { data } = await supabase.rpc("get_task_completion_by_month", {
		months_limit: 7,
	});

	return (
		data?.map((item) => ({
			date: new Date(item.month).toLocaleDateString("ja-JP", { month: "long" }),
			completed: item.completion_rate,
			overdue: item.overdue_rate,
		})) ?? []
	);
});

// APIリクエスト統計を取得
export const getApiRequestData = cache(async () => {
	const supabase = await createClient();

	const { data } = await supabase.rpc("get_api_requests_by_hour", {
		hours_limit: 24,
	});

	return (
		data?.map((item) => ({
			time: `${item.hour}:00`,
			count: item.request_count,
			error: item.error_count,
		})) ?? []
	);
});

// システムアクティビティの取得
export const getSystemActivity = cache(async () => {
	const supabase = await createClient();
	const limit = 10;

	// ユーザー関連のアクティビティ
	const { data: userActivities } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("id, display_name, created_at")
		.order("created_at", { ascending: false })
		.limit(limit);

	// タスク関連のアクティビティ
	const { data: taskActivities } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.select("id, title, status, updated_at")
		.eq("status", "completed")
		.order("updated_at", { ascending: false })
		.limit(limit);

	// システムログ
	const { data: systemLogs } = await supabase
		.schema("ff_logs")
		.from("system_logs")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(limit);

	const events: TimelineEvent[] = [
		// ユーザーアクティビティの変換
		...(userActivities?.map((user) => ({
			id: `user-${user.id}`,
			type: "user" as TimelineEvent["type"],
			title: "新規ユーザー登録",
			description: `${user.display_name || "ユーザー"}が新規登録しました`,
			timestamp: user.created_at ?? new Date().toISOString(),
		})) ?? []),

		// タスクアクティビティの変換
		...(taskActivities?.map((task) => ({
			id: `task-${task.id}`,
			type: "success" as TimelineEvent["type"],
			title: "タスク完了",
			description: `タスク「${task.title}」が完了しました`,
			timestamp: task.updated_at ?? new Date().toISOString(),
		})) ?? []),

		// システムログの変換
		...(systemLogs?.map((log) => ({
			id: `log-${log.id}`,
			type: (log.severity === "error"
				? "error"
				: "system") as TimelineEvent["type"],
			title: log.event_type,
			description:
				typeof log.event_data === "object" &&
				log.event_data &&
				!Array.isArray(log.event_data) &&
				"message" in log.event_data
					? String(log.event_data.message)
					: log.event_source,
			timestamp: log.created_at ?? new Date().toISOString(),
		})) ?? []),
	];

	// タイムスタンプでソート
	return events
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
		)
		.slice(0, limit);
});
