"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// タスク分解の作成
export async function createTaskBreakdown(data: {
	parent_task_id: string;
	title: string;
	description?: string;
	estimated_duration?: string;
	order_index?: number;
	experience_points?: number;
	skill_category?: string;
}) {
	const supabase = await createClient();
	const { data: breakdown, error } = await supabase
		.schema("ff_tasks")
		.from("task_breakdowns")
		.insert({
			...data,
			status: "not_started",
			order_index: data.order_index || 0,
			experience_points: data.experience_points || 0,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`タスク分解の作成に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
	return breakdown;
}

// タスク分解の更新
export async function updateTaskBreakdown(
	id: string,
	data: {
		title?: string;
		description?: string;
		estimated_duration?: string;
		actual_duration?: string;
		order_index?: number;
		status?: string;
		experience_points?: number;
		skill_category?: string;
	},
) {
	const supabase = await createClient();
	const { data: breakdown, error } = await supabase
		.schema("ff_tasks")
		.from("task_breakdowns")
		.update(data)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new Error(`タスク分解の更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
	return breakdown;
}

// タスク分解の削除
export async function deleteTaskBreakdown(id: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_breakdowns")
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`タスク分解の削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスク分解の順序更新
export async function updateTaskBreakdownOrder(
	parentTaskId: string,
	orderUpdates: { id: string; order_index: number; title: string }[],
) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_breakdowns")
		.upsert(
			orderUpdates.map((update) => ({
				id: update.id,
				parent_task_id: parentTaskId,
				order_index: update.order_index,
				title: update.title,
			})),
		);

	if (error) {
		throw new Error(`タスク分解の順序更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスク分解の一括更新
export async function bulkUpdateTaskBreakdowns(
	parentTaskId: string,
	updates: {
		id: string;
		title?: string;
		description?: string;
		estimated_duration?: string;
		actual_duration?: string;
		order_index?: number;
		status?: string;
		experience_points?: number;
		skill_category?: string;
	}[],
) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_breakdowns")
		.upsert(
			updates.map((update) => ({
				...update,
				parent_task_id: parentTaskId,
				order_index: update.order_index ?? 0,
				title: update.title ?? "未設定",
			})),
		);

	if (error) {
		throw new Error(`タスク分解の一括更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスク分解の取得
export async function getTaskBreakdowns(parentTaskId: string) {
	const supabase = await createClient();
	const { data: breakdowns, error } = await supabase
		.schema("ff_tasks")
		.from("task_breakdowns")
		.select("*")
		.eq("parent_task_id", parentTaskId)
		.order("order_index", { ascending: true });

	if (error) {
		throw new Error(`タスク分解の取得に失敗しました: ${error.message}`);
	}

	return breakdowns;
}

// タスク分解の詳細取得
export async function getTaskBreakdown(id: string) {
	const supabase = await createClient();
	const { data: breakdown, error } = await supabase
		.schema("ff_tasks")
		.from("task_breakdowns")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`タスク分解の取得に失敗しました: ${error.message}`);
	}

	if (!breakdown) {
		throw new Error("タスク分解が見つかりませんでした");
	}

	return breakdown;
}
