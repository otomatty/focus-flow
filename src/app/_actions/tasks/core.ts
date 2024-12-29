"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Task, TaskStatus } from "@/types/task";
import type { TaskFormData } from "@/app/_components/task/TaskForm";
import type { TaskInsert } from "@/types/task";
import { convertToTask } from "./utils/converters";
import type { TaskUpdate } from "./utils/converters";

// タスク一覧の取得
export async function getTasks() {
	const supabase = await createClient();
	const { data: rows, error } = await supabase
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
      ),
      task_breakdowns!parent_task_id(
        id,
        title,
        description,
        estimated_duration,
        actual_duration,
        order_index,
        status,
        experience_points,
        skill_category
      )
    `)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクの取得に失敗しました: ${error.message}`);
	}

	return rows?.map(convertToTask) ?? [];
}

// タスクの取得
export async function getTask(id: string): Promise<Task> {
	const supabase = await createClient();
	const { data: row, error } = await supabase
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
      ),
      task_breakdowns!parent_task_id(
        id,
        title,
        description,
        estimated_duration,
        actual_duration,
        order_index,
        status,
        experience_points,
        skill_category
      )
    `)
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`タスクの取得に失敗しました: ${error.message}`);
	}

	if (!row) {
		throw new Error("タスクが見つかりませんでした");
	}

	return convertToTask(row);
}

// タスクの作成
export async function createTask(formData: TaskFormData): Promise<Task> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("認証されて��ません");
	}

	const taskData: TaskInsert = {
		...formData,
		user_id: user.id,
		status: "not_started",
		style: { color: null, icon: null },
		due_date: formData.due_date?.toISOString() ?? null,
	};

	const { data: task, error } = await supabase
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
	const { error } = await supabase.from("tasks").delete().eq("id", id);

	if (error) {
		throw new Error(`タスクの削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクの検索
export async function searchTasks(query: string) {
	const supabase = await createClient();
	const { data: tasks, error } = await supabase
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

	return tasks;
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
