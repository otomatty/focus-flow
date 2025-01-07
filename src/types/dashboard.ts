import type { Database } from "./supabase";

type UserHabit = Database["ff_habits"]["Tables"]["user_habits"]["Row"];
type HabitProgress = Database["ff_habits"]["Tables"]["habit_progress"]["Row"];

export interface Habit extends UserHabit {
	currentCount: number;
	targetCount: number;
	streak: number;
	bestStreak: number;
	lastCompletedAt: string | null;
	completionHistory?: {
		date: string;
		completed: boolean;
	}[];
}

export interface WeeklyPartyData {
	members: PartyMemberData[];
	goal: {
		currentSessions: number;
		targetSessions: number;
		deadline: Date;
	};
}

export interface PartyMemberData {
	id: string;
	name: string;
	level: number;
	avatarUrl: string | null;
	status: "online" | "focusing" | "offline";
	weeklyStats: {
		focusTime: number;
		achievementCount: number;
		points: number;
		streak: number;
		growth: number;
		lastActive: Date;
		completedSessions: number;
		plannedSessions: number;
		contribution: number;
		bestFocusTime: number;
	};
}

export interface CpuAccount {
	id: string;
	name: string;
	level: number;
	avatarUrl: string | null;
	personality: "supportive" | "competitive" | "analytical" | "creative";
	baseStats: {
		focusTime: number;
		achievementRate: number;
		sessionCompletion: number;
		consistency: number;
	};
}
