export type AnnouncementType = "contributor" | "promotion";
export type QuestRarity = "common" | "rare" | "epic" | "legendary";
export type TaskDifficulty = "easy" | "medium" | "hard";
export type PartyMemberStatus = "online" | "focusing" | "offline";

export interface Announcement {
	id: string;
	type: AnnouncementType;
	title: string;
	description: string;
	badge?: string;
	action: {
		label: string;
		href: string;
	};
}

export interface Quest {
	id: string;
	title: string;
	description: string;
	rarity: QuestRarity;
	progress: number;
	maxProgress: number;
	reward: number;
	deadline?: string;
	requirements?: string[];
	rewards?: {
		type: "exp" | "item" | "title";
		value: string;
		amount?: number;
	}[];
}

export interface Task {
	id: string;
	title: string;
	difficulty: TaskDifficulty;
	estimatedTime: number;
	progress: number;
	comboCount: number;
	description?: string;
	dueDate?: string;
	tags?: string[];
	subtasks?: {
		id: string;
		title: string;
		isCompleted: boolean;
	}[];
}

export interface Collaborator {
	id: string;
	name: string;
	avatarUrl: string;
}

export interface Milestone {
	id: string;
	title: string;
	progress: number;
	collaborators: Collaborator[];
	isCompleted: boolean;
}

export interface Project {
	id: string;
	title: string;
	progress: number;
	milestones: Milestone[];
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

export interface Habit {
	id: string;
	title: string;
	description: string;
	targetCount: number;
	currentCount: number;
	streak: number;
	lastCompletedAt?: string;
	category?: string;
	startDate?: string;
	bestStreak?: number;
	completionHistory?: {
		date: string;
		completed: boolean;
	}[];
}
