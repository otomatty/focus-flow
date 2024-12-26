export interface Database {
	public: {
		Tables: {
			tasks: {
				Row: {
					id: string;
					created_at: string | null;
					updated_at: string | null;
					title: string;
					description: string | null;
					status: "not_started" | "in_progress" | "completed";
					priority: "high" | "medium" | "low";
					due_date: string | null;
					category: string | null;
					estimated_duration: string | null;
					actual_duration: unknown;
					user_id: string;
					ai_generated: boolean | null;
					ai_analysis: {
						suggestedPriority: "high" | "medium" | "low";
						suggestedCategory: string;
						suggestedDueDate: string;
						totalEstimatedDuration: string;
						totalExperiencePoints: number;
						skillDistribution: Record<string, number>;
						breakdowns: {
							orderIndex: number;
							title: string;
							description?: string;
							estimatedDuration: string;
							experiencePoints: number;
							skillCategory: string;
						}[];
					} | null;
					experience_points: number;
					skill_distribution: Record<string, number>;
				};
				Insert: {
					id?: string;
					created_at?: string | null;
					updated_at?: string | null;
					title: string;
					description?: string | null;
					status?: "not_started" | "in_progress" | "completed";
					priority?: "high" | "medium" | "low";
					due_date?: string | null;
					category?: string | null;
					estimated_duration?: string | null;
					actual_duration?: unknown;
					user_id: string;
					ai_generated?: boolean | null;
					ai_analysis?: {
						suggestedPriority: "high" | "medium" | "low";
						suggestedCategory: string;
						suggestedDueDate: string;
						totalEstimatedDuration: string;
						totalExperiencePoints: number;
						skillDistribution: Record<string, number>;
						breakdowns: {
							orderIndex: number;
							title: string;
							description?: string;
							estimatedDuration: string;
							experiencePoints: number;
							skillCategory: string;
						}[];
					} | null;
					experience_points?: number;
					skill_distribution?: Record<string, number>;
				};
				Update: {
					id?: string;
					created_at?: string | null;
					updated_at?: string | null;
					title?: string;
					description?: string | null;
					status?: "not_started" | "in_progress" | "completed";
					priority?: "high" | "medium" | "low";
					due_date?: string | null;
					category?: string | null;
					estimated_duration?: string | null;
					actual_duration?: unknown;
					user_id?: string;
					ai_generated?: boolean | null;
					ai_analysis?: {
						suggestedPriority: "high" | "medium" | "low";
						suggestedCategory: string;
						suggestedDueDate: string;
						totalEstimatedDuration: string;
						totalExperiencePoints: number;
						skillDistribution: Record<string, number>;
						breakdowns: {
							orderIndex: number;
							title: string;
							description?: string;
							estimatedDuration: string;
							experiencePoints: number;
							skillCategory: string;
						}[];
					} | null;
					experience_points?: number;
					skill_distribution?: Record<string, number>;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
