import type { Database } from "./supabase";

// 基本的な列挙型
export type TaskType = Database["ff_tasks"]["Enums"]["task_type"];
export type TaskPriority = Database["ff_tasks"]["Enums"]["task_priority"];
export type TaskStatus = Database["ff_tasks"]["Enums"]["task_status"];
export type TaskDependencyType =
	Database["ff_tasks"]["Enums"]["dependency_type"];
export type TaskDependencyLinkType =
	Database["ff_tasks"]["Enums"]["dependency_link_type"];
export type TaskDependencyStatus =
	Database["ff_tasks"]["Enums"]["dependency_status"];
export type TaskRelationshipType =
	Database["ff_tasks"]["Enums"]["task_relationship_type"];

// データベースの型定義
export type TaskRow = Database["ff_tasks"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["ff_tasks"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["ff_tasks"]["Tables"]["tasks"]["Update"];

export type TaskBreakdownRow =
	Database["ff_tasks"]["Tables"]["task_breakdown_results"]["Row"];
export type TaskBreakdownInsert =
	Database["ff_tasks"]["Tables"]["task_breakdown_results"]["Insert"];
export type TaskBreakdownUpdate =
	Database["ff_tasks"]["Tables"]["task_breakdown_results"]["Update"];

export type TaskDependencyRow =
	Database["ff_tasks"]["Tables"]["task_dependencies"]["Row"];
export type TaskDependencyInsert =
	Database["ff_tasks"]["Tables"]["task_dependencies"]["Insert"];
export type TaskDependencyUpdate =
	Database["ff_tasks"]["Tables"]["task_dependencies"]["Update"];

// 拡張された型定義
export interface Task extends TaskRow {
	breakdown_results?: TaskBreakdownRow[];
	dependencies?: TaskDependencyRow[];
}

// フォームデータ型
export interface TaskFormData {
	title: string;
	description?: string;
	task_type?: TaskType;
	priority?: TaskPriority;
	status?: TaskStatus;
	start_date?: string | null;
	due_date?: string | null;
	estimated_duration?: string | null;
	actual_duration?: string | null;
	progress_percentage?: number | null;
	recurring_pattern?: {
		frequency: string;
		interval: number;
		end_date?: Date;
	} | null;
	category_id?: string | null;
	skill_category_id?: string | null;
	project_id?: string | null;
	parent_task_id?: string | null;
	assigned_user_id?: string | null;
}

// Server Actions用の結果型
export interface TaskActionResult {
	success: boolean;
	message: string;
	data?: Task;
	error?: string;
}

export interface TaskListActionResult {
	success: boolean;
	message: string;
	data?: Task[];
	error?: string;
}
