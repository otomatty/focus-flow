import type { Database } from "./supabase";
import type { CamelCase } from "../utils/caseConverter";

// Supabaseのプロジェクトテーブルの型
type ProjectRow = Database["ff_tasks"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["ff_tasks"]["Tables"]["projects"]["Insert"];
type ProjectUpdateRow = Database["ff_tasks"]["Tables"]["projects"]["Update"];

// プロジェクトの状態の型
export type ProjectStatus = ProjectRow["status"];
export type ProjectPriority = ProjectRow["priority"];

// キャメルケースに変換されたプロジェクトの型
export type Project = {
	[K in keyof ProjectRow as CamelCase<K & string>]: ProjectRow[K];
};

// プロジェクト作成時の型
export type ProjectCreate = {
	[K in keyof ProjectInsert as CamelCase<K & string>]: ProjectInsert[K];
};

// プロジェクト更新時の型
export type ProjectUpdate = {
	[K in keyof ProjectUpdateRow as CamelCase<K & string>]: ProjectUpdateRow[K];
};

// プロジェクトとタスクの関連の型
type ProjectTaskRow = Database["ff_tasks"]["Tables"]["project_tasks"]["Row"];
export type ProjectTask = {
	[K in keyof ProjectTaskRow as CamelCase<K & string>]: ProjectTaskRow[K];
};

// プロジェクトの表示用の拡張型
export interface ProjectWithTasks extends Project {
	tasks?: ProjectTask[];
	taskCount?: number;
	completedTaskCount?: number;
}

// プロジェクトのフィルタリング用の型
export interface ProjectFilter {
	status?: ProjectStatus;
	priority?: ProjectPriority;
	search?: string;
	isArchived?: boolean;
}

// プロジェクトのソート用の型
export type ProjectSortKey =
	| "name"
	| "createdAt"
	| "updatedAt"
	| "startDate"
	| "endDate"
	| "priority"
	| "status";
export type SortDirection = "asc" | "desc";

export interface ProjectSort {
	key: ProjectSortKey;
	direction: SortDirection;
}

// export interface Project {
// 	id: string;
// 	name: string;
// 	description?: string;
// 	status: "not_started" | "in_progress" | "completed" | "on_hold";
// 	priority: "high" | "medium" | "low";
// 	startDate?: string;
// 	endDate?: string;
// 	color?: string;
// 	isArchived?: boolean;
// 	createdAt: string;
// 	updatedAt: string;
// }

// export interface ProjectFormValues {
// 	name: string;
// 	description?: string;
// 	status: "not_started" | "in_progress" | "completed" | "on_hold";
// 	priority: "high" | "medium" | "low";
// 	startDate?: Date;
// 	endDate?: Date;
// 	color?: string;
// 	isArchived?: boolean;
// }

// export interface ProjectCreate {
// 	name: string;
// 	description?: string;
// 	status?: "not_started" | "in_progress" | "completed" | "on_hold";
// 	priority?: "high" | "medium" | "low";
// 	startDate?: string;
// 	endDate?: string;
// 	color?: string;
// 	isArchived?: boolean;
// }

// export interface ProjectUpdate extends Partial<ProjectCreate> {}

// export interface ProjectFilter {
// 	status?: "not_started" | "in_progress" | "completed" | "on_hold";
// 	priority?: "high" | "medium" | "low";
// 	search?: string;
// 	isArchived?: boolean;
// }

// export interface ProjectSort {
// 	key: keyof Project;
// 	direction: "asc" | "desc";
// }
