"use server";

import type { Database } from "@/types/supabase";
import type { Task, TaskStyle, AIAnalysisResult } from "@/types/task";

export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"] & {
	style?: unknown;
	progress_percentage?: number;
	task_type?: string;
	ai_analysis?: unknown;
	experience_points?: number;
	skill_distribution?: unknown;
};

export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"] & {
	style?: TaskStyle;
	progress_percentage?: number;
	task_type?: string;
	ai_analysis?: {
		suggestedPriority: string;
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

// データベースの結果をTask型に変換
export async function convertToTask(row: TaskRow): Promise<Task> {
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
