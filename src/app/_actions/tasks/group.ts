"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import type {
	TaskStatus,
	TaskPriority,
	TaskType,
	TaskGroupRow,
} from "@/types/task";

// タスクグループの作成
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
		.schema("ff_tasks")
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

// タスクグループの更新
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
		.schema("ff_tasks")
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

// タスクグループの削除
export async function deleteTaskGroup(id: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_groups")
		.delete()
		.eq("id", id);

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
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_group_memberships")
		.insert({
			task_id: taskId,
			group_id: groupId,
			position: position || 0,
		});

	if (error) {
		throw new Error(`タスクのグループ追加に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクをグループから削除
export async function removeTaskFromGroup(taskId: string, groupId: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_group_memberships")
		.delete()
		.eq("task_id", taskId)
		.eq("group_id", groupId);

	if (error) {
		throw new Error(`タスクのグループ削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクの位置を更新
export async function updateTaskPosition(
	taskId: string,
	groupId: string,
	position: number,
) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_group_memberships")
		.update({ position })
		.eq("task_id", taskId)
		.eq("group_id", groupId);

	if (error) {
		throw new Error(`タスクの位置更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// グループの一覧取得（プロジェクト別）
export async function getTaskGroupsByProject(projectId: string) {
	const supabase = await createClient();
	const { data: groups, error } = await supabase
		.schema("ff_tasks")
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
		.schema("ff_tasks")
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
		.schema("ff_tasks")
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
		.schema("ff_tasks")
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
		.schema("ff_tasks")
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

	const { error } = await supabase
		.schema("ff_tasks")
		.from("task_groups")
		.upsert(updates);

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
	let query = supabase
		.schema("ff_tasks")
		.from("task_groups")
		.select(`
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
				(membership) => {
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
