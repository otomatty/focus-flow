"use server";

import { createClient } from "@/lib/supabase/server";
import type {
	ProjectCreate,
	ProjectUpdate,
	ProjectFilter,
	ProjectSort,
} from "@/types/project";
import { convertToCamelCase, convertToSnakeCase } from "@/utils/caseConverter";
import { revalidatePath } from "next/cache";

/**
 * プロジェクトを作成する
 */
export async function createProject(data: ProjectCreate) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("認証されていません");
		}

		const { data: project, error } = await supabase
			.schema("ff_tasks")
			.from("projects")
			.insert({
				...convertToSnakeCase(data),
				owner_id: user.id,
				status: data.status || "not_started",
				priority: data.priority || "medium",
			})
			.select("*")
			.single();

		if (error) throw error;

		// プロジェクトメンバーとしてオーナーを追加
		const { error: memberError } = await supabase
			.schema("ff_tasks")
			.from("project_members")
			.insert({
				project_id: project.id,
				user_id: user.id,
				role: "owner",
			});

		if (memberError) throw memberError;

		revalidatePath("/webapp/projects");
		return { project: convertToCamelCase(project), error: null };
	} catch (error) {
		console.error("Error creating project:", error);
		return { project: null, error: "プロジェクトの作成に失敗しました" };
	}
}

/**
 * プロジェクトを更新する
 */
export async function updateProject(id: string, data: ProjectUpdate) {
	try {
		const supabase = await createClient();
		const { data: project, error } = await supabase
			.schema("ff_tasks")
			.from("projects")
			.update(convertToSnakeCase(data))
			.eq("id", id)
			.select("*")
			.single();

		if (error) throw error;

		revalidatePath("/webapp/projects");
		return { project: convertToCamelCase(project), error: null };
	} catch (error) {
		console.error("Error updating project:", error);
		return { project: null, error: "プロジェクトの更新に失敗しました" };
	}
}

/**
 * プロジェクトを削除する
 */
export async function deleteProject(id: string) {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.schema("ff_tasks")
			.from("projects")
			.delete()
			.eq("id", id);

		if (error) throw error;

		revalidatePath("/webapp/projects");
		return { error: null };
	} catch (error) {
		console.error("Error deleting project:", error);
		return { error: "プロジェクトの削除に失敗しました" };
	}
}

/**
 * プロジェクトを取得する
 */
export async function getProject(id: string) {
	try {
		const supabase = await createClient();
		const { data: project, error } = await supabase
			.schema("ff_tasks")
			.from("projects")
			.select(`
        *,
        tasks (
          id,
          title,
          description,
          status,
          priority,
          start_date,
          due_date,
          progress_percentage
        ),
        task_positions (
          task_id,
          position
        )
      `)
			.eq("id", id)
			.single();

		if (error) throw error;

		return { project: convertToCamelCase(project), error: null };
	} catch (error) {
		console.error("Error getting project:", error);
		return { project: null, error: "プロジェクトの取得に失敗しました" };
	}
}

/**
 * プロジェクト一覧を取得する
 */
export async function getProjects(filter?: ProjectFilter, sort?: ProjectSort) {
	try {
		const supabase = await createClient();
		let query = supabase
			.schema("ff_tasks")
			.from("projects")
			.select(`
        *,
        tasks (
          id,
          title,
          description,
          status,
          priority,
          start_date,
          due_date,
          progress_percentage
        ),
        task_positions (
          task_id,
          position
        )
      `);

		// フィルタリングの適用
		if (filter) {
			if (filter.status) {
				query = query.eq("status", filter.status);
			}
			if (filter.priority) {
				query = query.eq("priority", filter.priority);
			}
			if (filter.search) {
				query = query.ilike("name", `%${filter.search}%`);
			}
			if (filter.isArchived !== undefined) {
				query = query.eq("is_archived", filter.isArchived);
			}
		}

		// ソートの適用
		if (sort) {
			const snakeCaseKey = convertToSnakeCase(sort.key);
			query = query.order(snakeCaseKey, {
				ascending: sort.direction === "asc",
			});
		} else {
			// デフォルトは更新日時の降順
			query = query.order("updated_at", { ascending: false });
		}

		const { data: projects, error } = await query;

		if (error) throw error;

		return { projects: convertToCamelCase(projects), error: null };
	} catch (error) {
		console.error("Error getting projects:", error);
		return { projects: null, error: "プロジェクト一覧の取得に失敗しました" };
	}
}

/**
 * プロジェクトにタスクを追加する
 */
export async function addTaskToProject(
	projectId: string,
	taskId: string,
	position: number,
) {
	try {
		const supabase = await createClient();

		// タスクのproject_idを更新
		const { error: taskError } = await supabase
			.schema("ff_tasks")
			.from("tasks")
			.update({ project_id: projectId })
			.eq("id", taskId);

		if (taskError) throw taskError;

		// タスクの位置を設定
		const { error: positionError } = await supabase
			.schema("ff_tasks")
			.from("task_positions")
			.insert({
				project_id: projectId,
				task_id: taskId,
				position,
			});

		if (positionError) throw positionError;

		revalidatePath("/webapp/projects");
		return { error: null };
	} catch (error) {
		console.error("Error adding task to project:", error);
		return { error: "タスクの追加に失敗しました" };
	}
}

/**
 * プロジェクトからタスクを削除する
 */
export async function removeTaskFromProject(projectId: string, taskId: string) {
	try {
		const supabase = await createClient();

		// タスクのproject_idをnullに設定
		const { error: taskError } = await supabase
			.schema("ff_tasks")
			.from("tasks")
			.update({ project_id: null })
			.eq("id", taskId)
			.eq("project_id", projectId);

		if (taskError) throw taskError;

		// タスクの位置情報を削除
		const { error: positionError } = await supabase
			.schema("ff_tasks")
			.from("task_positions")
			.delete()
			.match({ project_id: projectId, task_id: taskId });

		if (positionError) throw positionError;

		revalidatePath("/webapp/projects");
		return { error: null };
	} catch (error) {
		console.error("Error removing task from project:", error);
		return { error: "タスクの削除に失敗しました" };
	}
}

/**
 * プロジェクト内のタスクの位置を更新する
 */
export async function updateTaskPosition(
	projectId: string,
	taskId: string,
	newPosition: number,
) {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.schema("ff_tasks")
			.from("task_positions")
			.update({ position: newPosition })
			.match({ project_id: projectId, task_id: taskId });

		if (error) throw error;

		revalidatePath("/webapp/projects");
		return { error: null };
	} catch (error) {
		console.error("Error updating task position:", error);
		return { error: "タスクの位置の更新に失敗しました" };
	}
}
