"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
	TaskDependencyType,
	TaskDependencyLinkType,
	TaskDependencyStatus,
	TaskDependencyUpdate,
} from "@/types/task";

// タスク依存関係の作成
export async function createTaskDependency(data: {
	dependent_task_id: string;
	prerequisite_task_id: string;
	dependency_type?: TaskDependencyType;
	link_type?: TaskDependencyLinkType;
	lag_time?: string;
}) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_dependencies")
		.insert({
			...data,
			dependency_type: data.dependency_type || "required",
			link_type: data.link_type || "finish_to_start",
		});

	if (error) {
		throw new Error(`タスク依存関係の作成に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスク依存関係の更新
export async function updateTaskDependency(
	dependentTaskId: string,
	prerequisiteTaskId: string,
	data: {
		dependency_type?: TaskDependencyType;
		link_type?: TaskDependencyLinkType;
		lag_time?: string;
		status?: TaskDependencyStatus;
	},
) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_dependencies")
		.update(data)
		.eq("dependent_task_id", dependentTaskId)
		.eq("prerequisite_task_id", prerequisiteTaskId);

	if (error) {
		throw new Error(`タスク依存関係の更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスク依存関係の削除
export async function deleteTaskDependency(
	dependentTaskId: string,
	prerequisiteTaskId: string,
) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_dependencies")
		.delete()
		.eq("dependent_task_id", dependentTaskId)
		.eq("prerequisite_task_id", prerequisiteTaskId);

	if (error) {
		throw new Error(`タスク依存関係の削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスク依存関係の取得
export async function getTaskDependencies(taskId: string) {
	const supabase = await createClient();
	const { data: dependencies, error } = await supabase
		.schema("ff_tasks")
		.from("task_dependencies")
		.select("*")
		.or(`dependent_task_id.eq.${taskId},prerequisite_task_id.eq.${taskId}`);

	if (error) {
		throw new Error(`タスク依存関係の取得に失敗しました: ${error.message}`);
	}

	return dependencies;
}

// タスク依存関係のステータス更新
export async function updateDependencyStatus(
	dependentTaskId: string,
	prerequisiteTaskId: string,
	status: TaskDependencyStatus,
) {
	return updateTaskDependency(dependentTaskId, prerequisiteTaskId, { status });
}

// タスク依存関係の一括更新
export async function bulkUpdateDependencies(
	dependentTaskId: string,
	updates: Omit<TaskDependencyUpdate, "dependent_task_id">[],
) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_dependencies")
		.upsert(
			updates.map((update) => ({
				...update,
				dependent_task_id: dependentTaskId,
				dependency_type: update.dependency_type || "required",
				prerequisite_task_id: update.prerequisite_task_id as string,
			})),
		);

	if (error) {
		throw new Error(`タスク依存関係の一括更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}
