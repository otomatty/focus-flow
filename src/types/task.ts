import type { Database } from "./supabase";

export type Task = Omit<
	Database["public"]["Tables"]["tasks"]["Row"],
	"estimated_duration" | "ai_analysis" | "experience_points"
> & {
	estimated_duration: string | null;
	ai_analysis: AIAnalysis | null;
	experience_points: number;
};

export type TaskStatus = "not_started" | "in_progress" | "completed";
export type TaskPriority = "high" | "medium" | "low";
export type TaskView = "list" | "kanban" | "gantt";

export interface TaskBreakdown {
	orderIndex: number;
	title: string;
	description?: string;
	estimatedDuration: string;
	experiencePoints: number;
	skillCategory: string;
}

export interface AIAnalysis {
	suggestedPriority: "high" | "medium" | "low";
	suggestedCategory: string;
	suggestedDueDate: string;
	totalEstimatedDuration: string;
	totalExperiencePoints: number;
	skillDistribution: Record<string, number>;
	breakdowns: TaskBreakdown[];
}
