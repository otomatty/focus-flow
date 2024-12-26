import type { Database } from "@/types/supabase";
import type { CamelCase } from "@/utils/caseConverter";

// Supabaseのプロジェクトテーブルの型
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdateRow = Database["public"]["Tables"]["projects"]["Update"];

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
type ProjectTaskRow = Database["public"]["Tables"]["project_tasks"]["Row"];
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
