import { createClient } from "@/lib/supabase/server";
import type { Task, TaskStatus } from "@/types/dashboard";

// 日次タスクの取得
export async function getDailyTasks() {
	const supabase = await createClient();
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const { data: tasks, error } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.select("*")
		.gte("due_date", today.toISOString())
		.lt("due_date", new Date(today.getTime() + 86400000).toISOString())
		.order("created_at", { ascending: false });

	if (error) {
		console.error("日次タスクの取得に失敗しました:", error);
		return {
			total: 0,
			completed: 0,
			tasks: [],
		};
	}

	const formattedTasks = tasks.map((task) => ({
		...task,
		status: task.status as TaskStatus,
		style: task.style ? JSON.parse(JSON.stringify(task.style)) : null,
	}));

	return {
		total: tasks.length,
		completed: tasks.filter((task) => task.status === "completed").length,
		tasks: formattedTasks,
	};
}

// タスク一覧の取得
export async function getTasks(): Promise<Task[]> {
	const supabase = await createClient();

	const { data: tasks, error } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("タスクの取得に失敗しました:", error);
		return [];
	}

	return tasks.map((task) => ({
		...task,
		status: task.status as TaskStatus,
		style: task.style ? JSON.parse(JSON.stringify(task.style)) : null,
	}));
}
