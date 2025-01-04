// データベースの型定義
export interface DbQuestType {
	id: string;
	name: string;
	description: string;
	validation_rules: {
		required_fields: string[];
		rules: Record<
			string,
			{
				type: string;
				min?: number;
				max?: number;
			}
		>;
	};
	created_at: string | null;
}

export interface DbQuestDifficulty {
	id: string;
	name: string;
	level: number;
	exp_multiplier: number;
	created_at: string | null;
}

export interface DbQuest {
	id: string;
	title: string;
	description: string;
	quest_type_id: string;
	difficulty_id: string;
	requirements: Record<string, number>;
	base_reward_exp: number;
	reward_badge_id?: string;
	duration_type: "daily" | "weekly" | "monthly";
	is_party_quest: boolean;
	min_level: number;
	max_participants?: number;
	is_active: boolean;
	created_at: string | null;
	updated_at: string | null;
	quest_type: DbQuestType;
	difficulty: DbQuestDifficulty;
}

// アプリケーションの型定義
export interface QuestType {
	id: string;
	name: string;
	description: string;
	validationRules: {
		requiredFields: string[];
		rules: Record<
			string,
			{
				type: string;
				min?: number;
				max?: number;
			}
		>;
	};
	createdAt: string;
}

export interface QuestDifficulty {
	id: string;
	name: string;
	level: number;
	expMultiplier: number;
	createdAt: string;
}

export interface Quest {
	id: string;
	title: string;
	description: string;
	questTypeId: string;
	difficultyId: string;
	requirements: Record<string, number>;
	baseRewardExp: number;
	rewardBadgeId?: string;
	durationType: "daily" | "weekly" | "monthly";
	isPartyQuest: boolean;
	minLevel: number;
	maxParticipants?: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface QuestWithDetails extends Quest {
	questType: QuestType;
	difficulty: QuestDifficulty;
}

export interface QuestFilters {
	questType?: string;
	difficulty?: string;
	durationType?: string;
	isPartyQuest?: boolean;
	isActive?: boolean;
}
