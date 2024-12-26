"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

// タスク一覧の取得
export async function getTasks() {
	const supabase = await createClient();
	const { data: tasks, error } = await supabase
		.from("tasks")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクの取得に失敗しました: ${error.message}`);
	}

	return tasks;
}

// タスクの取得
export async function getTask(id: string): Promise<Task> {
	const supabase = await createClient();
	const { data: task, error } = await supabase
		.from("tasks")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`タスクの取得に失敗しました: ${error.message}`);
	}

	if (!task) {
		throw new Error("タスクが見つかりませんでした");
	}

	return task;
}

// タスクの作成
export async function createTask(task: TaskInsert) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("tasks")
		.insert(task)
		.select()
		.single();

	if (error) {
		throw new Error(`タスクの作成に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
	return data;
}

// タスクの更新
async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
	const supabase = await createClient();
	const { data: task, error } = await supabase
		.from("tasks")
		.update(data)
		.eq("id", id)
		.select("*")
		.single();

	if (error) {
		throw new Error(`タスクの更新に失敗しました: ${error.message}`);
	}

	if (!task) {
		throw new Error("タスクが見つかりませんでした");
	}

	return task;
}

// タスクのステータス更新
export async function updateTaskStatus(
	id: string,
	status: Task["status"],
): Promise<Task> {
	return updateTask(id, { status, updated_at: new Date().toISOString() });
}

// タスクの削除
export async function deleteTask(id: string): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase.from("tasks").delete().eq("id", id);

	if (error) {
		throw new Error(`タスクの削除に失敗しました: ${error.message}`);
	}
}

// タスクの検索
export async function searchTasks(query: string) {
	const supabase = await createClient();
	const { data: tasks, error } = await supabase
		.from("tasks")
		.select("*")
		.or(
			`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`,
		)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクの検索に失敗しました: ${error.message}`);
	}

	return tasks;
}

// フィルター付きタスク取得
export async function getFilteredTasks({
	status,
	priority,
}: {
	status?: Task["status"];
	priority?: Task["priority"];
}) {
	const supabase = await createClient();
	let query = supabase.from("tasks").select("*");

	if (status && status !== "all") {
		query = query.eq("status", status);
	}

	if (priority && priority !== "all") {
		query = query.eq("priority", priority);
	}

	const { data: tasks, error } = await query.order("created_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`タスクの取得に失敗しました: ${error.message}`);
	}

	return tasks;
}
