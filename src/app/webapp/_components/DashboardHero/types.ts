import type { PublicUserProfile } from "@/stores/userProfileAtom";
import type { Database } from "@/types/supabase";

type UserLevel = Database["ff_gamification"]["Tables"]["user_levels"]["Row"];

export interface WeeklyStatsData {
	focusTime: number;
	completedTasks: number;
	avgSessionLength: number;
	taskCompletionRate: number;
	completedHabits: number;
}

export interface DashboardUserProfile extends PublicUserProfile {
	level: UserLevel;

	streak: {
		current: number;
		best: number;
	};
}

export interface RankRequirements {
	required_points: number;
	focus_time_requirement?: string;
	task_completion_requirement?: number;
	daily_focus_requirement?: string;
	weekly_focus_requirement?: string;
	maintenance_requirements?: {
		focus_time?: string;
		task_completion?: number;
		daily_activity?: boolean;
		weekly_goals?: number;
		minimum_points?: number;
	};
}

export interface SeasonData {
	season: {
		id: string;
		season_number: number;
		name: string;
		start_date: string;
		end_date: string;
		status: string;
		rules: {
			point_multipliers: {
				focus_session: number;
				task_completion: number;
				streak_bonus: number;
			};
		};
	};
	progress: {
		current_points: number;
		current_rank: string;
		highest_rank: string;
	};
	rankRequirements: RankRequirements;
	remainingDays: number;
}
