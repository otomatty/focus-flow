"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
	Task,
	TaskStatus,
	TaskPriority,
	TaskType,
	TaskStyle,
	AIAnalysisResult,
} from "@/types/task";
import type { Database } from "@/types/supabase";
import type { Json } from "@/types/supabase";
import type { TaskFormData } from "@/app/_components/task/TaskForm";
import type { TaskInsert } from "@/types/task";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"] & {
	style?: unknown;
	progress_percentage?: number;
	task_type?: TaskType;
	ai_analysis?: unknown;
	experience_points?: number;
	skill_distribution?: unknown;
};

type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"] & {
	style?: TaskStyle;
	progress_percentage?: number;
	task_type?: TaskType;
	ai_analysis?: {
		suggestedPriority: TaskPriority;
		suggestedCategory: string;
		suggestedDueDate: string;
		totalEstimatedDuration: string;
		totalExperiencePoints: number;
		skillDistribution: Record<string, number>;
		breakdowns: {
			order_index: number;
			title: string;
			description?: string;
			estimated_duration: string;
			experience_points: number;
			skill_category: string;
		}[];
	};
	experience_points?: number;
	skill_distribution?: Record<string, number>;
};

type FilterStatus = TaskStatus | "all";
type FilterPriority = TaskPriority | "all";
type FilterTaskType = TaskType | "all";

type TaskGroupRow = Database["public"]["Tables"]["task_groups"]["Row"] & {
	task_group_memberships?: {
		task_id: string;
		position: number;
		tasks?: {
			id: string;
			title: string;
			description?: string;
			status: TaskStatus;
			priority: TaskPriority;
			due_date?: string;
			progress_percentage: number;
			task_type: TaskType;
			style?: TaskStyle;
			experience_points?: number;
			skill_distribution?: Record<string, number>;
		} | null;
	}[];
	task_group_views?: {
		view_type: string;
		settings: Json;
		last_used_at: string;
	}[];
	children?: TaskGroupRow[];
};

type ProjectWithGroups = Database["public"]["Tables"]["projects"]["Row"] & {
	task_groups: TaskGroupRow[];
};

// データベースの結果をTask型に変換
function convertToTask(row: TaskRow): Task {
	const { estimated_duration, actual_duration, style, ai_analysis, ...rest } =
		row;
	return {
		...rest,
		estimated_duration: estimated_duration?.toString() ?? null,
		actual_duration: actual_duration?.toString() ?? null,
		style: (style as TaskStyle) ?? { color: null, icon: null },
		ai_analysis: ai_analysis as AIAnalysisResult | null,
	};
}

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
		throw new Error("認証されていません");
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

// フィルター付きタスク取得
export async function getFilteredTasks({
	status,
	priority,
	task_type,
	project_id,
	group_id,
}: {
	status?: FilterStatus;
	priority?: FilterPriority;
	task_type?: FilterTaskType;
	project_id?: string;
	group_id?: string;
}) {
	const supabase = await createClient();
	let query = supabase.from("tasks").select(`
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
		`);

	if (status && status !== "all") {
		query = query.eq("status", status);
	}

	if (priority && priority !== "all") {
		query = query.eq("priority", priority);
	}

	if (task_type && task_type !== "all") {
		query = query.eq("task_type", task_type);
	}

	if (project_id) {
		query = query.eq("project_id", project_id);
	}

	if (group_id) {
		query = query.eq("task_group_memberships.group_id", group_id);
	}

	const { data: tasks, error } = await query.order("created_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`タスクの取得に失敗しました: ${error.message}`);
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

// タスクグループ関連の操作
export async function createTaskGroup(data: {
	name: string;
	description?: string;
	project_id?: string;
	parent_group_id?: string;
	view_type?: string;
	view_settings?: Record<string, unknown>;
}) {
	const supabase = await createClient();
	const { data: group, error } = await supabase
		.from("task_groups")
		.insert({
			...data,
			view_type: data.view_type || "list",
			view_settings: data.view_settings || {},
		})
		.select()
		.single();

	if (error) {
		throw new Error(`タスクグループの作成に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
	return group;
}

export async function updateTaskGroup(
	id: string,
	data: {
		name?: string;
		description?: string;
		parent_group_id?: string;
		view_type?: string;
		view_settings?: Record<string, unknown>;
	},
) {
	const supabase = await createClient();
	const { data: group, error } = await supabase
		.from("task_groups")
		.update(data)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new Error(`タスクグループの更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
	return group;
}

export async function deleteTaskGroup(id: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("task_groups").delete().eq("id", id);

	if (error) {
		throw new Error(`タスクグループの削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクグループメンバーシップの操作
export async function addTaskToGroup(
	taskId: string,
	groupId: string,
	position?: number,
) {
	const supabase = await createClient();
	const { error } = await supabase.from("task_group_memberships").insert({
		task_id: taskId,
		group_id: groupId,
		position: position || 0,
	});

	if (error) {
		throw new Error(`タスクのグループ追加に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

export async function removeTaskFromGroup(taskId: string, groupId: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("task_group_memberships")
		.delete()
		.eq("task_id", taskId)
		.eq("group_id", groupId);

	if (error) {
		throw new Error(`タスクのグループ削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

export async function updateTaskPosition(
	taskId: string,
	groupId: string,
	position: number,
) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("task_group_memberships")
		.update({ position })
		.eq("task_id", taskId)
		.eq("group_id", groupId);

	if (error) {
		throw new Error(`タスクの位置更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスク依存関係の操作
export async function createTaskDependency(data: {
	dependent_task_id: string;
	prerequisite_task_id: string;
	dependency_type?: "required" | "optional" | "conditional";
	link_type?:
		| "finish_to_start"
		| "start_to_start"
		| "finish_to_finish"
		| "start_to_finish";
	lag_time?: string;
}) {
	const supabase = await createClient();
	const { error } = await supabase.from("task_dependencies").insert({
		...data,
		dependency_type: data.dependency_type || "required",
		link_type: data.link_type || "finish_to_start",
	});

	if (error) {
		throw new Error(`タスク依存関係の作成に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

export async function updateTaskDependency(
	dependentTaskId: string,
	prerequisiteTaskId: string,
	data: {
		dependency_type?: "required" | "optional" | "conditional";
		link_type?:
			| "finish_to_start"
			| "start_to_start"
			| "finish_to_finish"
			| "start_to_finish";
		lag_time?: string;
		status?: "blocked" | "pending" | "satisfied" | "skipped";
	},
) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("task_dependencies")
		.update(data)
		.eq("dependent_task_id", dependentTaskId)
		.eq("prerequisite_task_id", prerequisiteTaskId);

	if (error) {
		throw new Error(`タスク依存関係の更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

export async function deleteTaskDependency(
	dependentTaskId: string,
	prerequisiteTaskId: string,
) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("task_dependencies")
		.delete()
		.eq("dependent_task_id", dependentTaskId)
		.eq("prerequisite_task_id", prerequisiteTaskId);

	if (error) {
		throw new Error(`タスク依存関係の削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスク分解の操作
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

export async function deleteTaskBreakdown(id: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("task_breakdowns")
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`タスク分解の削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

export async function updateTaskBreakdownOrder(
	parentTaskId: string,
	orderUpdates: { id: string; order_index: number; title: string }[],
) {
	const supabase = await createClient();
	const { error } = await supabase.from("task_breakdowns").upsert(
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

// タスクビューの操作
export async function updateTaskGroupView(
	groupId: string,
	viewType: string,
	settings: Record<string, unknown>,
) {
	const supabase = await createClient();
	const { error } = await supabase.from("task_group_views").upsert({
		group_id: groupId,
		view_type: viewType,
		settings: settings as Json,
		last_used_at: new Date().toISOString(),
	});

	if (error) {
		throw new Error(`タスクビューの更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

export async function getTaskGroupViews(groupId: string) {
	const supabase = await createClient();
	const { data: views, error } = await supabase
		.from("task_group_views")
		.select("*")
		.eq("group_id", groupId)
		.order("last_used_at", { ascending: false });

	if (error) {
		throw new Error(`タスクビューの取得に失敗しました: ${error.message}`);
	}

	return views;
}

// タスクの一括操作
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

export async function bulkDeleteTasks(taskIds: string[]): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase.from("tasks").delete().in("id", taskIds);

	if (error) {
		throw new Error(`タスクの一括削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// プロジェクトの一覧取得
export async function getProjects() {
	const supabase = await createClient();
	const { data: projects, error } = await supabase
		.from("projects")
		.select(`
			*,
			task_groups!project_id(
				id,
				name,
				description,
				parent_group_id,
				view_type,
				view_settings,
				created_at,
				updated_at
			)
		`)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`プロジェクトの取得に失敗しました: ${error.message}`);
	}

	return projects;
}

// プロジェクトの取得
export async function getProject(id: string) {
	const supabase = await createClient();
	const { data: project, error } = await supabase
		.from("projects")
		.select(`
			*,
			task_groups!project_id(
				id,
				name,
				description,
				parent_group_id,
				view_type,
				view_settings,
				created_at,
				updated_at
			),
			tasks!project_id(
				id,
				title,
				description,
				status,
				priority,
				due_date,
				progress_percentage,
				task_type,
				style,
				created_at,
				updated_at
			)
		`)
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`プロジェクトの取得に失敗しました: ${error.message}`);
	}

	if (!project) {
		throw new Error("プロジェクトが見つかりませんでした");
	}

	return project;
}

// グループの一覧取得（プロジェクト別）
export async function getTaskGroupsByProject(projectId: string) {
	const supabase = await createClient();
	const { data: groups, error } = await supabase
		.from("task_groups")
		.select(`
			*,
			task_group_memberships!group_id(
				task_id,
				position
			),
			task_group_views!group_id(
				view_type,
				settings,
				last_used_at
			)
		`)
		.eq("project_id", projectId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクグループの取得に失敗しました: ${error.message}`);
	}

	return groups;
}

// グループの一覧取得（親グループ別）
export async function getTaskGroupsByParent(parentGroupId: string) {
	const supabase = await createClient();
	const { data: groups, error } = await supabase
		.from("task_groups")
		.select(`
			*,
			task_group_memberships!group_id(
				task_id,
				position
			),
			task_group_views!group_id(
				view_type,
				settings,
				last_used_at
			)
		`)
		.eq("parent_group_id", parentGroupId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクグループの取得に失敗しました: ${error.message}`);
	}

	return groups;
}

// グループの詳細取得
export async function getTaskGroup(id: string) {
	const supabase = await createClient();
	const { data: group, error } = await supabase
		.from("task_groups")
		.select(`
			*,
			task_group_memberships!group_id(
				task_id,
				position,
				tasks!task_id(
					id,
					title,
					description,
					status,
					priority,
					due_date,
					progress_percentage,
					task_type,
					style,
					created_at,
					updated_at
				)
			),
			task_group_views!group_id(
				view_type,
				settings,
				last_used_at
			)
		`)
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`タスクグループの取得に失敗しました: ${error.message}`);
	}

	if (!group) {
		throw new Error("タスクグループが見つかりませんでした");
	}

	return group;
}

// ルートグループの一覧取得
export async function getRootTaskGroups() {
	const supabase = await createClient();
	const { data: groups, error } = await supabase
		.from("task_groups")
		.select(`
			*,
			task_group_memberships!group_id(
				task_id,
				position
			),
			task_group_views!group_id(
				view_type,
				settings,
				last_used_at
			)
			`)
		.is("parent_group_id", null)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクグループの取得に失敗しました: ${error.message}`);
	}

	return groups;
}

// グループの検索
export async function searchTaskGroups(query: string) {
	const supabase = await createClient();
	const { data: groups, error } = await supabase
		.from("task_groups")
		.select(`
			*,
			task_group_memberships!group_id(
				task_id,
				position
			),
			task_group_views!group_id(
				view_type,
				settings,
				last_used_at
			)
		`)
		.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`タスクグループの検索に失敗しました: ${error.message}`);
	}

	return groups;
}

// プロジェクトとグループのツリー構造の取得
export async function getProjectTree(
	projectId: string,
): Promise<ProjectWithGroups> {
	const supabase = await createClient();
	const { data: project, error: projectError } = await supabase
		.from("projects")
		.select(`
			*,
			task_groups:task_groups(
				id,
				name,
				description,
				parent_group_id,
				view_type,
				view_settings,
				created_at,
					updated_at,
					task_group_memberships(
						task_id,
						position,
						tasks(
							id,
							title,
							description,
							status,
							priority,
							due_date,
							progress_percentage,
							task_type,
							style
						)
					)
			)
		`)
		.eq("id", projectId)
		.single();

	if (projectError) {
		throw new Error(
			`プロジェクトの取得に失敗しました: ${projectError.message}`,
		);
	}

	if (!project) {
		throw new Error("プロジェクトが見つかりませんでした");
	}

	// グループをツリー構造に変換
	const groups = (project.task_groups as unknown as TaskGroupRow[]) || [];
	const groupMap = new Map<string, TaskGroupRow & { children: TaskGroupRow[] }>(
		groups.map((group) => [group.id, { ...group, children: [] }]),
	);

	const rootGroups: TaskGroupRow[] = [];
	for (const group of groups) {
		if (group.parent_group_id) {
			const parent = groupMap.get(group.parent_group_id);
			if (parent?.children) {
				const groupWithChildren = groupMap.get(group.id);
				if (groupWithChildren) {
					parent.children.push(groupWithChildren);
				}
			}
		} else {
			const groupWithChildren = groupMap.get(group.id);
			if (groupWithChildren) {
				rootGroups.push(groupWithChildren);
			}
		}
	}

	return {
		...project,
		task_groups: rootGroups,
	};
}

// グループの並び順更新
export async function updateTaskGroupOrder(
	parentGroupId: string | null,
	groupIds: string[],
) {
	const supabase = await createClient();
	const updates = groupIds.map((id, index) => ({
		id,
		parent_group_id: parentGroupId,
		position: index,
		updated_at: new Date().toISOString(),
		name: "", // 必須フィールドを追加
	}));

	const { error } = await supabase.from("task_groups").upsert(updates);

	if (error) {
		throw new Error(`グループの並び順更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// グループのフィルタリング
export async function getFilteredTaskGroups({
	status,
	priority,
	task_type,
	project_id,
	parent_group_id,
	view_type,
	has_tasks,
}: {
	status?: TaskStatus;
	priority?: TaskPriority;
	task_type?: TaskType;
	project_id?: string;
	parent_group_id?: string | null;
	view_type?: string;
	has_tasks?: boolean;
}): Promise<TaskGroupRow[]> {
	const supabase = await createClient();
	let query = supabase.from("task_groups").select(`
		*,
		task_group_memberships(
			task_id,
			position,
			tasks(
				id,
				title,
				description,
				status,
				priority,
				due_date,
				progress_percentage,
				task_type,
				style
			)
		),
		task_group_views(
			view_type,
			settings,
			last_used_at
		)
	`);

	if (project_id) {
		query = query.eq("project_id", project_id);
	}

	if (parent_group_id === null) {
		query = query.is("parent_group_id", null);
	} else if (parent_group_id) {
		query = query.eq("parent_group_id", parent_group_id);
	}

	if (view_type) {
		query = query.eq("view_type", view_type);
	}

	const { data: groups, error } = await query.order("position", {
		ascending: true,
	});

	if (error) {
		throw new Error(`タスクグループの取得に失敗しました: ${error.message}`);
	}

	// タスクのフィルタリング
	let filteredGroups = (groups as unknown as TaskGroupRow[]) || [];
	if (status || priority || task_type || has_tasks) {
		filteredGroups = filteredGroups.map((group) => ({
			...group,
			task_group_memberships: (group.task_group_memberships || []).filter(
				(membership: {
					task_id: string;
					position: number;
					tasks?: {
						id: string;
						title: string;
						description?: string;
						status: TaskStatus;
						priority: TaskPriority;
						due_date?: string;
						progress_percentage: number;
						task_type: TaskType;
						style?: TaskStyle;
					} | null;
				}) => {
					const task = membership.tasks;
					if (!task) return false;
					if (status && task.status !== status) return false;
					if (priority && task.priority !== priority) return false;
					if (task_type && task.task_type !== task_type) return false;
					return true;
				},
			),
		}));

		if (has_tasks) {
			filteredGroups = filteredGroups.filter(
				(group) => (group.task_group_memberships || []).length > 0,
			);
		}
	}

	return filteredGroups;
}

// グループの統計情報取得
export async function getTaskGroupStats(groupId: string) {
	const supabase = await createClient();
	const { data: group, error } = await supabase
		.from("task_groups")
		.select(`
			*,
			task_group_memberships(
				task_id,
				tasks(
					id,
					status,
					priority,
					progress_percentage,
					task_type,
					experience_points,
					skill_distribution
				)
			)
		`)
		.eq("id", groupId)
		.single();

	if (error) {
		throw new Error(`タスクグループの取得に失敗しました: ${error.message}`);
	}

	if (!group) {
		throw new Error("タスクグループが見つかりませんでした");
	}

	interface TaskWithStats {
		id: string;
		status: TaskStatus;
		priority: TaskPriority;
		task_type: TaskType;
		progress_percentage: number;
		experience_points: number;
		skill_distribution: Record<string, number>;
	}

	const tasks = (
		(group.task_group_memberships as unknown as {
			task_id: string;
			tasks: TaskWithStats | null;
		}[]) || []
	)
		.map((membership) => membership.tasks)
		.filter((task): task is TaskWithStats => task !== null);

	// 統計情報の計算
	const stats = {
		total_tasks: tasks.length,
		status_counts: {} as Record<TaskStatus, number>,
		priority_counts: {} as Record<TaskPriority, number>,
		type_counts: {} as Record<TaskType, number>,
		total_experience_points: 0,
		average_progress: 0,
		skill_distribution: {} as Record<string, number>,
	};

	// ステータス、優先度、タイプごとの集計
	for (const task of tasks) {
		if (task.status) {
			stats.status_counts[task.status] =
				(stats.status_counts[task.status] || 0) + 1;
		}
		if (task.priority) {
			stats.priority_counts[task.priority] =
				(stats.priority_counts[task.priority] || 0) + 1;
		}
		if (task.task_type) {
			stats.type_counts[task.task_type] =
				(stats.type_counts[task.task_type] || 0) + 1;
		}

		// 経験値の集計
		stats.total_experience_points += task.experience_points || 0;

		// 進捗の平均
		stats.average_progress += task.progress_percentage || 0;

		// スキル分布の集計
		if (task.skill_distribution) {
			for (const [skill, points] of Object.entries(task.skill_distribution)) {
				stats.skill_distribution[skill] =
					(stats.skill_distribution[skill] || 0) + points;
			}
		}
	}

	if (tasks.length > 0) {
		stats.average_progress = Math.round(stats.average_progress / tasks.length);
	}

	return stats;
}
