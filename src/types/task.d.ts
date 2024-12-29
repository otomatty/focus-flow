import type { Database } from "./supabase";

export type TaskType = "task" | "milestone" | "summary";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "not_started" | "in_progress" | "completed";

export interface TaskStyle {
	color: string | null;
	icon: string | null;
}

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
		dependency_type: "required" | "optional" | "conditional";
		link_type:
			| "finish_to_start"
			| "start_to_start"
			| "finish_to_finish"
			| "start_to_finish";
		lag_time?: string;
	}[];
}

export interface AIAnalysis {
	feasibilityAnalysis: {
		isExecutable: boolean;
		reasonsIfNotExecutable: string[];
		suggestedImprovements: string[];
		evaluationDetails: {
			specificity: { score: number; comments: string[] };
			timeConstraints: { score: number; comments: string[] };
			skillRequirements: { score: number; comments: string[] };
			dependencies: { score: number; comments: string[] };
			resources: { score: number; comments: string[] };
		};
	};
	breakdowns: {
		order_index: number;
		title: string;
		description?: string;
		estimated_duration: string;
		experience_points: number;
		skill_category: string;
	}[];
	suggestedPriority: TaskPriority;
	suggestedCategory: string;
	suggestedDueDate: string;
	totalExperiencePoints: number;
	totalEstimatedDuration: string;
	skillDistribution: Record<string, number>;
	dependencies: {
		prerequisite_breakdown_index: number;
		dependent_breakdown_index: number;
		dependency_type: "required" | "optional" | "conditional";
		link_type:
			| "finish_to_start"
			| "start_to_start"
			| "finish_to_finish"
			| "start_to_finish";
		lag_time?: string;
	}[];
}

export type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
	style: TaskStyle;
	ai_analysis: AIAnalysisResult | null;
};

export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"] & {
	style?: TaskStyle;
	ai_analysis?: AIAnalysisResult | null;
};
