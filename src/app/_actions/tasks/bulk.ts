"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TaskUpdate } from "./utils/converters";

// タスクの一括更新
export async function bulkUpdateTasks(
	taskIds: string[],
	data: Partial<TaskUpdate>,
): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase
		.from("tasks")
		.update({
			...data,
			updated_at: new Date().toISOString(),
		})
		.in("id", taskIds);

	if (error) {
		throw new Error(`タスクの一括更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクの一括削除
export async function bulkDeleteTasks(taskIds: string[]): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase.from("tasks").delete().in("id", taskIds);

	if (error) {
		throw new Error(`タスクの一括削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクの一括ステータス更新
export async function bulkUpdateTaskStatus(
	taskIds: string[],
	status: string,
	progress_percentage?: number,
): Promise<void> {
	return bulkUpdateTasks(taskIds, {
		status,
		progress_percentage:
			progress_percentage ?? (status === "completed" ? 100 : undefined),
	});
}

// タスクの一括優先度更新
export async function bulkUpdateTaskPriority(
	taskIds: string[],
	priority: string,
): Promise<void> {
	return bulkUpdateTasks(taskIds, { priority });
}

// タスクの一括カテゴリー更新
export async function bulkUpdateTaskCategory(
	taskIds: string[],
	category: string,
): Promise<void> {
	return bulkUpdateTasks(taskIds, { category });
}

// タスクの一括期限更新
export async function bulkUpdateTaskDueDate(
	taskIds: string[],
	due_date: Date | null,
): Promise<void> {
	return bulkUpdateTasks(taskIds, {
		due_date: due_date?.toISOString() ?? null,
	});
}

// タスクの一括スタイル更新
export async function bulkUpdateTaskStyle(
	taskIds: string[],
	style: { color?: string; icon?: string },
): Promise<void> {
	return bulkUpdateTasks(taskIds, {
		style: {
			color: style.color ?? null,
			icon: style.icon ?? null,
		},
	});
}

// タスクの一括グループ移動
export async function bulkMoveTasksToGroup(
	taskIds: string[],
	groupId: string,
): Promise<void> {
	const supabase = await createClient();

	// 現在の最大position値を取得
	const { data: maxPositionRow } = await supabase
		.from("task_group_memberships")
		.select("position")
		.eq("group_id", groupId)
		.order("position", { ascending: false })
		.limit(1)
		.single();

	const startPosition = (maxPositionRow?.position ?? -1) + 1;

	// 新しいメンバーシップを作成
	const memberships = taskIds.map((taskId, index) => ({
		task_id: taskId,
		group_id: groupId,
		position: startPosition + index,
	}));

	const { error } = await supabase
		.from("task_group_memberships")
		.insert(memberships);

	if (error) {
		throw new Error(`タスクのグループ移動に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクの一括グループ削除
export async function bulkRemoveTasksFromGroup(
	taskIds: string[],
	groupId: string,
): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase
		.from("task_group_memberships")
		.delete()
		.in("task_id", taskIds)
		.eq("group_id", groupId);

	if (error) {
		throw new Error(`タスクのグループ削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}
