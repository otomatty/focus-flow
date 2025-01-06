import type { PublicUserProfile } from "@/stores/userProfileAtom";
import type { Database } from "@/types/supabase";

type UserLevel = Database["ff_gamification"]["Tables"]["user_levels"]["Row"];
type Season = Database["ff_gamification"]["Tables"]["seasons"]["Row"];
type UserProgress =
	Database["ff_gamification"]["Tables"]["user_progress"]["Row"];

export interface WeeklyStats {
	focusTime: number;
	completedTasks: number;
	avgSessionLength: number;
	taskCompletionRate: number;
}

export interface DashboardUserProfile extends PublicUserProfile {
	level: UserLevel;

	streak: {
		current: number;
		best: number;
	};
}

export interface SeasonData {
	season: Season;
	progress: UserProgress;
	remainingDays: number;
}
