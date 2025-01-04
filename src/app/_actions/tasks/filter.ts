"use server";

import { createClient } from "@/lib/supabase/server";
import { convertToCamelCase } from "@/utils/caseConverter";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

interface FilterParams {
	status: TaskStatus | null;
	priority: TaskPriority | null;
}

export async function getFilteredTasks({ status, priority }: FilterParams) {
	try {
		const supabase = await createClient();

		let query = supabase
			.schema("ff_tasks")
			.from("tasks")
			.select(`
			*,
			task_group_memberships (
				task_id,
				position,
				tasks (
					id,
					title,
					description,
					status,
					priority,
					due_date,
					progress_percentage,
					style
				)
			)
		`);

		// ステータスでフィルタリング
		if (status) {
			query = query.eq("status", status);
		}

		// 優先度でフィルタリング
		if (priority) {
			query = query.eq("priority", priority);
		}

		// 作成日時の降順でソート
		query = query.order("created_at", { ascending: false });

		const { data: tasks, error } = await query;

		if (error) {
			console.error("タスクのフィルタリングエラー:", error);
			throw error;
		}

		return tasks.map((task) => convertToCamelCase(task)) as unknown as Task[];
	} catch (error) {
		console.error("タスクのフィルタリング中にエラーが発生しました:", error);
		throw error;
	}
}
