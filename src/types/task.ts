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
