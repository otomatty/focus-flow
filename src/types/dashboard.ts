export type AnnouncementType = "contributor" | "promotion";
export type QuestRarity = "common" | "rare" | "epic" | "legendary";
export type TaskDifficulty = "easy" | "medium" | "hard";
export type TaskStatus =
	| "not_started"
	| "in_progress"
	| "in_review"
	| "blocked"
	| "completed"
	| "cancelled";
export type PartyMemberStatus = "online" | "focusing" | "offline";

export interface Task {
	id: string;
	user_id: string;
	project_id: string | null;
	title: string;
	description: string | null;
	start_date: string | null;
	due_date: string | null;
	priority: string | null;
	category: string | null;
	status: TaskStatus | null;
	progress_percentage: number | null;
	is_recurring: boolean | null;
	recurring_pattern: unknown | null;
	ai_generated: boolean | null;
	difficulty_level: number | null;
	estimated_duration: unknown | null;
	actual_duration: unknown | null;
	style: {
		color: string | null;
		icon: string | null;
	} | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface Quest {
	id: string;
	title: string;
	description: string;
	rarity: string;
	progress: number;
	maxProgress: number;
	reward: {
		exp: number;
		badge?: string;
	};
}

export interface Habit {
	id: string;
	title: string;
	description: string;
	frequency: unknown;
	targetCount: number;
	currentCount: number;
	streak: number;
	isActive: boolean;
	createdAt: string;
}

export interface PartyMember {
	id: string;
	name: string;
	avatarUrl: string;
	level: number;
	weeklyStats: {
		plannedSessions: number;
		completedSessions: number;
		focusTime: number;
		lastActive: Date;
		streak: number;
		points: number;
		contribution: number;
		growth: number;
		bestFocusTime: number;
		achievementCount: number;
	};
	status: PartyMemberStatus;
}

export interface PartyGoal {
	targetSessions: number;
	currentSessions: number;
	deadline: Date;
}

export interface WeeklyPartyCardProps {
	members: PartyMember[];
	goal: PartyGoal;
}
