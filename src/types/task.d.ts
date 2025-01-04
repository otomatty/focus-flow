import type { Database } from "./supabase";

// 基本的な列挙型
export type TaskType = "task" | "milestone" | "summary";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "not_started" | "in_progress" | "completed";
export type TaskDependencyType = Database["public"]["Enums"]["dependency_type"];
export type TaskDependencyLinkType =
	Database["public"]["Enums"]["dependency_link_type"];
export type TaskDependencyStatus =
	Database["public"]["Enums"]["dependency_status"];
export type TaskRelationshipType =
	Database["public"]["Enums"]["task_relationship_type"];

// スタイル関連の型
export type TaskStyle =
	| {
			color?: string | null;
			icon?: string | null;
	  }
	| Record<string, unknown>;

export type TaskStyleJson = TaskStyle;

// データベースの型定義
export type TaskRow = Database["ff_tasks"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["ff_tasks"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["ff_tasks"]["Tables"]["tasks"]["Update"];

export type TaskBreakdownRow =
	Database["ff_tasks"]["Tables"]["task_breakdowns"]["Row"];
export type TaskBreakdownInsert =
	Database["ff_tasks"]["Tables"]["task_breakdowns"]["Insert"];
export type TaskBreakdownUpdate =
	Database["ff_tasks"]["Tables"]["task_breakdowns"]["Update"];

export type TaskDependencyRow =
	Database["ff_tasks"]["Tables"]["task_dependencies"]["Row"];
export type TaskDependencyInsert =
	Database["ff_tasks"]["Tables"]["task_dependencies"]["Insert"];
export type TaskDependencyUpdate =
	Database["ff_tasks"]["Tables"]["task_dependencies"]["Update"];

export type TaskExperienceRow =
	Database["ff_tasks"]["Tables"]["task_experience"]["Row"];
export type TaskExperienceInsert =
	Database["ff_tasks"]["Tables"]["task_experience"]["Insert"];
export type TaskExperienceUpdate =
	Database["ff_tasks"]["Tables"]["task_experience"]["Update"];

export type TaskGroupRow =
	Database["ff_tasks"]["Tables"]["task_groups"]["Row"] & {
		task_group_memberships?: {
			task_id: string;
			position: number;
			tasks?: {
				id: string;
				title: string;
				description: string | null;
				status: TaskStatus;
				priority: TaskPriority;
				due_date: string | null;
				progress_percentage: number | null;
				task_type: TaskType;
				style: TaskStyle;
			};
		}[];
		task_group_views?: {
			view_type: string;
			settings: Record<string, unknown>;
			last_used_at: string | null;
		}[];
	};
export type TaskGroupInsert =
	Database["ff_tasks"]["Tables"]["task_groups"]["Insert"];
export type TaskGroupUpdate =
	Database["ff_tasks"]["Tables"]["task_groups"]["Update"];

export type TaskGroupMembershipRow =
	Database["ff_tasks"]["Tables"]["task_group_memberships"]["Row"];
export type TaskGroupMembershipInsert =
	Database["ff_tasks"]["Tables"]["task_group_memberships"]["Insert"];
export type TaskGroupMembershipUpdate =
	Database["ff_tasks"]["Tables"]["task_group_memberships"]["Update"];

export type TaskGroupViewRow =
	Database["ff_tasks"]["Tables"]["task_group_views"]["Row"];
export type TaskGroupViewInsert =
	Database["ff_tasks"]["Tables"]["task_group_views"]["Insert"];
export type TaskGroupViewUpdate =
	Database["ff_tasks"]["Tables"]["task_group_views"]["Update"];

export type TaskRelationshipRow =
	Database["ff_tasks"]["Tables"]["task_relationships"]["Row"];
export type TaskRelationshipInsert =
	Database["ff_tasks"]["Tables"]["task_relationships"]["Insert"];
export type TaskRelationshipUpdate =
	Database["ff_tasks"]["Tables"]["task_relationships"]["Update"];

export type TaskReminderRow =
	Database["ff_tasks"]["Tables"]["task_reminders"]["Row"];
export type TaskReminderInsert =
	Database["ff_tasks"]["Tables"]["task_reminders"]["Insert"];
export type TaskReminderUpdate =
	Database["ff_tasks"]["Tables"]["task_reminders"]["Update"];

// AI分析関連の型
export interface AIAnalysisResult {
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
	dependencies: {
		prerequisite_breakdown_index: number;
		dependent_breakdown_index: number;
		dependency_type: TaskDependencyType;
		link_type: TaskDependencyLinkType;
		lag_time?: string;
	}[];
}

export interface AIAnalysis {
	breakdowns: {
		title: string;
		description?: string;
		estimated_duration: string;
		experience_points: number;
		skill_category: string;
	}[];
	category?: string;
	skill_category?: string;
	experience_points?: number;
}

// 拡張された型定義
export interface Task extends TaskRow {
	style: TaskStyle | null;
	ai_analysis?: AIAnalysisResult | null;
	breakdowns?: TaskBreakdownRow[];
	dependencies?: TaskDependencyRow[];
	experience?: TaskExperienceRow;
	groups?: TaskGroupRow[];
	relationships?: TaskRelationshipRow[];
	reminders?: TaskReminderRow[];
}

// Server Actions用の入力型
export interface CreateTaskInput {
	title: string;
	description?: string;
	due_date?: string;
	priority?: TaskPriority;
	category?: string;
	estimated_duration?: string;
	project_id?: string;
	style?: TaskStyle;
	ai_analysis?: AIAnalysisResult;
}

export interface UpdateTaskInput {
	id: string;
	title?: string;
	description?: string;
	due_date?: string;
	priority?: TaskPriority;
	category?: string;
	status?: TaskStatus;
	estimated_duration?: string;
	actual_duration?: string;
	progress_percentage?: number;
	project_id?: string;
	style?: TaskStyle;
}

export interface CreateTaskBreakdownInput {
	parent_task_id: string;
	title: string;
	description?: string;
	estimated_duration?: string;
	order_index: number;
}

export interface UpdateTaskBreakdownInput {
	id: string;
	title?: string;
	description?: string;
	estimated_duration?: string;
	status?: TaskStatus;
	order_index?: number;
}

export interface CreateTaskDependencyInput {
	prerequisite_task_id: string;
	dependent_task_id: string;
	dependency_type: TaskDependencyType;
	link_type: TaskDependencyLinkType;
	conditions?: Record<string, string | number | boolean | null>;
	lag_time?: string;
}

export interface UpdateTaskDependencyInput {
	prerequisite_task_id: string;
	dependent_task_id: string;
	dependency_type?: TaskDependencyType;
	link_type?: TaskDependencyLinkType;
	conditions?: Record<string, string | number | boolean | null>;
	lag_time?: string;
	status?: TaskDependencyStatus;
}

// Server Actions用の戻り値の型
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

export interface TaskBreakdownActionResult {
	success: boolean;
	message: string;
	data?: TaskBreakdownRow;
	error?: string;
}

export interface TaskDependencyActionResult {
	success: boolean;
	message: string;
	data?: TaskDependencyRow;
	error?: string;
}

export interface TaskWithParent extends DecomposedTask {
	parentTask?: string;
	analysis?: AIAnalysis;
}

export interface AnalyzedTask extends Task {
	category?: string;
	skill_category?: string;
	experience_points?: number;
}

export interface TaskBreakdown {
	title: string;
	description?: string;
	estimated_duration: string;
	experience_points: number;
	skill_category: string;
}

export interface DecomposedTask {
	title: string;
	description: string;
	estimated_duration: string;
	type: "task";
	priority: "high" | "medium" | "low";
	status: "not_started";
	progress_percentage: number;
	category?: string;
	skill_category?: string;
	experience_points: number;
	difficulty_level: number;
	style: {
		color: string | null;
		icon: string | null;
	};
	dependencies?: {
		prerequisite_task_title: string;
		dependency_type: "required" | "optional" | "conditional";
		link_type:
			| "finish_to_start"
			| "start_to_start"
			| "finish_to_finish"
			| "start_to_finish";
	}[];
}

export interface TaskAnalysisContext {
	projectContext?: {
		projectId: string;
		projectName: string;
		projectDescription: string;
		relatedTasks: TaskSummary[];
	};
	userContext?: {
		skillLevels: Record<string, number>;
		completedTasks: TaskSummary[];
		preferences: {
			workingHours: string[];
			preferredTaskSize: string;
		};
	};
	teamContext?: {
		availableSkills: string[];
		teamSize: number;
		workingHours: {
			start: string;
			end: string;
			timezone: string;
		};
	};
}

export interface TaskComplexity {
	score: number;
	factors: string[];
	level: "low" | "medium" | "high";
	technicalDebtRisk: number;
}

export interface TaskRisk {
	type: "technical" | "resource" | "schedule" | "scope";
	probability: number;
	impact: number;
	description: string;
	mitigation: string;
}

export interface TaskRecommendation {
	breakdownStrategy: "top-down" | "bottom-up" | "middle-out";
	suggestedSkills: string[];
	estimatedEffort: {
		optimistic: string;
		realistic: string;
		pessimistic: string;
	};
	parallelizationPotential: number;
	suggestedTeamSize: number;
}

export interface TaskQualityMetrics {
	clarity: number;
	completeness: number;
	feasibility: number;
	testability: number;
	maintainability: number;
}

export interface EnhancedAIAnalysis extends AIAnalysis {
	complexity: TaskComplexity;
	risks: TaskRisk[];
	recommendations: TaskRecommendation;
	qualityMetrics: TaskQualityMetrics;
}

export interface TaskTemplate {
	title: string;
	description: string;
	estimatedDuration?: string;
	priority?: TaskPriority;
	category?: string;
	skillCategory?: string;
	experiencePoints?: number;
	style?: TaskStyle;
}

// タスクの経験値計算用の入力型
export interface TaskExperienceInput {
	title: string;
	description?: string;
	estimatedDuration?: string;
	category?: string;
	skillCategory?: string;
}

// タスクの依存関係の型
export interface TaskDependency {
	prerequisite_task_id: string;
	type?: "required" | "optional" | "conditional";
	link_type?:
		| "finish_to_start"
		| "start_to_start"
		| "finish_to_finish"
		| "start_to_finish";
}

// 共通のプロパティ型
export interface WithPriority {
	priority: "high" | "medium" | "low";
}

export interface WithSchedule {
	start_date?: string;
	due_date?: string;
}

export interface WithStyle {
	style?: {
		color?: string;
		icon?: string;
	};
}

export interface WithRecurring {
	is_recurring: boolean;
	recurring_pattern?: {
		frequency: "daily" | "weekly" | "monthly";
		interval: number;
		end_date?: string;
	};
}

// AIタスク作成用のフォームデータ型
export interface AITaskFormData extends WithPriority, WithSchedule, WithStyle {
	title: string;
	description?: string;
	estimated_duration?: string;
	status?:
		| "not_started"
		| "in_progress"
		| "in_review"
		| "blocked"
		| "completed"
		| "cancelled";
	progress_percentage?: number;
	actual_duration?: string;
	category?: string;
	difficulty_level?: number;
	dependencies?: {
		task_id: string;
		type: "required" | "optional" | "conditional";
		link_type:
			| "finish_to_start"
			| "start_to_start"
			| "finish_to_finish"
			| "start_to_finish";
		lag_time?: string;
		conditions?: string;
		id: string;
	}[];
	experience_points?: number;
	skill_category?: string;
	skill_distribution?: Record<string, number>;
	project_id?: string;
	parent_group_id?: string;
	view_type?: "list" | "kanban" | "gantt" | "mindmap";
}

// 通常のタスク作成用のフォームデータ型
export interface StandardTaskFormData
	extends WithPriority,
		WithSchedule,
		WithStyle,
		WithRecurring {
	title: string;
	description: string;
	project_id?: string;
	category?: string;
	estimated_duration?: number; // 分単位
}
