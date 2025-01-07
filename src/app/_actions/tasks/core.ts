"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Task, TaskStatus, TaskFormData } from "@/types/task";
import type { TaskInsert } from "@/types/task";
import { convertToTask } from "@/utils/converters";
import type { TaskUpdate } from "@/types/task";

// タスク一覧の取得
export async function getTasks(): Promise<Task[]> {
	const supabase = await createClient();
	const { data: rows, error } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクの取得に失敗しました: ${error.message}`);
	}

	return rows?.map(convertToTask) ?? [];
}
// タスクの取得
export async function getTask(id: string): Promise<Task> {
	const supabase = await createClient();
	console.log("タスク取得開始:", id);

	try {
		// まずタスクの基本情報のみを取得
		const { data: basicTask, error: basicError } = await supabase
			.schema("ff_tasks")
			.from("tasks")
			.select("*")
			.eq("id", id)
			.single();

		if (basicError) {
			console.error("基本タスク情報の取得エラー:", basicError);
			throw new Error(
				`タスクの基本情報取得に失敗しました: ${basicError.message}`,
			);
		}

		if (!basicTask) {
			console.error("タスクが見つかりません:", id);
			throw new Error("タスクが見つかりませんでした");
		}

		console.log("基本タスク情報:", basicTask);

		// 関連情報を個別に取得
		const { data: dependencies, error: depError } = await supabase
			.schema("ff_tasks")
			.from("task_dependencies")
			.select("*")
			.eq("dependent_task_id", id);

		if (depError) {
			console.error("依存関係の取得エラー:", depError);
		} else {
			console.log("依存関係:", dependencies);
		}

		const { data: memberships, error: memError } = await supabase
			.schema("ff_tasks")
			.from("task_group_memberships")
			.select("*")
			.eq("task_id", id);

		if (memError) {
			console.error("グループメンバーシップの取得エラー:", memError);
		} else {
			console.log("グループメンバーシップ:", memberships);
		}

		const { data: breakdowns, error: breakError } = await supabase
			.schema("ff_tasks")
			.from("task_breakdown_results")
			.select("*")
			.eq("task_id", id);

		if (breakError) {
			console.error("タスク分解の取得エラー:", breakError);
		} else {
			console.log("タスク分解:", breakdowns);
		}

		return convertToTask(basicTask);
	} catch (error) {
		console.error("タスク取得中の予期せぬエラー:", error);
		throw error;
	}
}

// タスクの作成
export async function createTask(formData: TaskFormData): Promise<Task> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("認証されていません");
	}

	const taskData: TaskInsert = {
		...formData,
		user_id: user.id,
		status: "not_started",
		style: { color: null, icon: null },
		start_date: formData.start_date
			? new Date(formData.start_date).toISOString()
			: null,
		due_date: formData.due_date
			? new Date(formData.due_date).toISOString()
			: null,
		recurring_pattern: formData.recurring_pattern
			? {
					...formData.recurring_pattern,
					end_date: formData.recurring_pattern.end_date?.toISOString(),
				}
			: null,
	};

	const { data: task, error } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.insert(taskData)
		.select()
		.single();

	if (error) {
		throw new Error(`タスクの作成に失敗しました: ${error.message}`);
	}

	return convertToTask(task);
}

// タスクの更新
export async function updateTask(
	id: string,
	data: Partial<TaskUpdate>,
): Promise<Task> {
	const supabase = await createClient();
	const { data: row, error } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.update({
			...data,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id)
		.select(`
      *,
      task_dependencies!dependent_task_id(
        prerequisite_task_id,
        dependency_type,
        link_type,
        status
      ),
      task_group_memberships!task_id(
        group_id,
        position
      )
    `)
		.single();

	if (error) {
		throw new Error(`タスクの更新に失敗しました: ${error.message}`);
	}

	if (!row) {
		throw new Error("タスクが見つかりませんでした");
	}

	revalidatePath("/webapp/tasks");
	return convertToTask(row);
}

// タスクのステータス更新
export async function updateTaskStatus(
	id: string,
	status: TaskStatus,
	progress_percentage?: number,
): Promise<Task> {
	return updateTask(id, {
		status,
		progress_percentage:
			progress_percentage ?? (status === "completed" ? 100 : undefined),
	});
}

// タスクの削除
export async function deleteTask(id: string): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`タスクの削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクの検索
export async function searchTasks(query: string): Promise<Task[]> {
	const supabase = await createClient();
	const { data: tasks, error } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.select(`
      *,
      task_dependencies!dependent_task_id(
        prerequisite_task_id,
        dependency_type,
        link_type,
        status
      ),
      task_group_memberships!task_id(
        group_id,
        position
      )
    `)
		.or(
			`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`,
		)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクの検索に失敗しました: ${error.message}`);
	}

	return tasks?.map(convertToTask) ?? [];
}

// タスクの進捗更新
export async function updateTaskProgress(
	id: string,
	progress_percentage: number,
): Promise<Task> {
	if (progress_percentage < 0 || progress_percentage > 100) {
		throw new Error("進捗は0から100の間で指定してください");
	}

	return updateTask(id, {
		progress_percentage,
		status: progress_percentage === 100 ? "completed" : "in_progress",
	});
}

// タスクのスタイル更新
export async function updateTaskStyle(
	id: string,
	style: { color?: string; icon?: string },
): Promise<Task> {
	return updateTask(id, {
		style: {
			color: style.color ?? null,
			icon: style.icon ?? null,
		},
	});
}
