export interface Quest {
	id: string;
	title: string;
	description: string;
	quest_type: "TASK_COMPLETION" | "TIME_MANAGEMENT" | "STREAK" | "ACHIEVEMENT";
	requirements: {
		type: string;
		target: number;
		current: number;
	}[];
	reward_exp: number;
	reward_badge_id: string | null;
	created_at: string;
	duration_type: "daily" | "weekly" | "initial";
	is_pickup?: boolean;
	background_image?: string;
	layout_size?: "small" | "medium" | "large";
	layout_position?: {
		row_span?: number;
		col_span?: number;
		row_start?: number;
		col_start?: number;
	};
	theme?: {
		color: string;
		gradient?: {
			from: string;
			to: string;
		};
		text?: string;
		badge?: string;
	};
}

export interface UserQuest {
	id: string;
	user_id: string;
	quest_id: string;
	status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
	progress: {
		current: number;
		target: number;
		percentage: number;
	};
	start_date: string;
	end_date: string;
	completed_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface QuestWithUserQuest {
	quest: Quest;
	userQuest: UserQuest;
}
