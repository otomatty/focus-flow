import { createClient } from "@/lib/supabase/server";
import type {
	Quest,
	QuestDifficulty,
	QuestType,
	QuestWithDetails,
	DbQuest,
	DbQuestType,
	DbQuestDifficulty,
} from "@/types/quest";
import { convertToCamelCase } from "@/utils/caseConverter";

// クエストタイプ一覧を取得
export async function getQuestTypes(): Promise<QuestType[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_quest")
		.from("quest_types")
		.select("*")
		.order("name");

	if (error) throw error;
	return (data as DbQuestType[]).map((row) => ({
		id: row.id,
		name: row.name,
		description: row.description,
		validationRules: {
			requiredFields: row.validation_rules.required_fields,
			rules: row.validation_rules.rules,
		},
		createdAt: row.created_at ?? "",
	}));
}

// クエスト難易度一覧を取得
export async function getQuestDifficulties(): Promise<QuestDifficulty[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_quest")
		.from("quest_difficulties")
		.select("*")
		.order("level");

	if (error) throw error;
	return (data as DbQuestDifficulty[]).map((row) => ({
		id: row.id,
		name: row.name,
		level: row.level,
		expMultiplier: row.exp_multiplier,
		createdAt: row.created_at ?? "",
	}));
}

// クエスト一覧を取得
export async function getQuests(): Promise<QuestWithDetails[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_quest")
		.from("quests")
		.select(`
      *,
      quest_type:quest_types(*),
      difficulty:quest_difficulties(*)
    `)
		.order("created_at", { ascending: false });

	if (error) throw error;
	return (data as DbQuest[]).map((row) => ({
		id: row.id,
		title: row.title,
		description: row.description,
		questTypeId: row.quest_type_id,
		difficultyId: row.difficulty_id,
		requirements: row.requirements,
		baseRewardExp: row.base_reward_exp,
		rewardBadgeId: row.reward_badge_id,
		durationType: row.duration_type,
		isPartyQuest: row.is_party_quest,
		minLevel: row.min_level,
		maxParticipants: row.max_participants,
		isActive: row.is_active,
		createdAt: row.created_at ?? "",
		updatedAt: row.updated_at ?? "",
		questType: {
			id: row.quest_type.id,
			name: row.quest_type.name,
			description: row.quest_type.description,
			validationRules: {
				requiredFields: row.quest_type.validation_rules.required_fields,
				rules: row.quest_type.validation_rules.rules,
			},
			createdAt: row.quest_type.created_at ?? "",
		},
		difficulty: {
			id: row.difficulty.id,
			name: row.difficulty.name,
			level: row.difficulty.level,
			expMultiplier: row.difficulty.exp_multiplier,
			createdAt: row.difficulty.created_at ?? "",
		},
	}));
}

// クエストを作成
export async function createQuest(
	quest: Omit<Quest, "id" | "createdAt" | "updatedAt">,
): Promise<Quest> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_quest")
		.from("quests")
		.insert([
			{
				title: quest.title,
				description: quest.description,
				quest_type_id: quest.questTypeId,
				difficulty_id: quest.difficultyId,
				requirements: quest.requirements,
				base_reward_exp: quest.baseRewardExp,
				reward_badge_id: quest.rewardBadgeId,
				duration_type: quest.durationType,
				is_party_quest: quest.isPartyQuest,
				min_level: quest.minLevel,
				max_participants: quest.maxParticipants,
				is_active: quest.isActive,
			},
		])
		.select()
		.single();

	if (error) throw error;
	const row = data as DbQuest;
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		questTypeId: row.quest_type_id,
		difficultyId: row.difficulty_id,
		requirements: row.requirements,
		baseRewardExp: row.base_reward_exp,
		rewardBadgeId: row.reward_badge_id,
		durationType: row.duration_type,
		isPartyQuest: row.is_party_quest,
		minLevel: row.min_level,
		maxParticipants: row.max_participants,
		isActive: row.is_active,
		createdAt: row.created_at ?? "",
		updatedAt: row.updated_at ?? "",
	};
}

// クエストを更新
export async function updateQuest(
	id: string,
	quest: Partial<Quest>,
): Promise<Quest> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_quest")
		.from("quests")
		.update({
			title: quest.title,
			description: quest.description,
			quest_type_id: quest.questTypeId,
			difficulty_id: quest.difficultyId,
			requirements: quest.requirements,
			base_reward_exp: quest.baseRewardExp,
			reward_badge_id: quest.rewardBadgeId,
			duration_type: quest.durationType,
			is_party_quest: quest.isPartyQuest,
			min_level: quest.minLevel,
			max_participants: quest.maxParticipants,
			is_active: quest.isActive,
		})
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;
	const row = data as DbQuest;
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		questTypeId: row.quest_type_id,
		difficultyId: row.difficulty_id,
		requirements: row.requirements,
		baseRewardExp: row.base_reward_exp,
		rewardBadgeId: row.reward_badge_id,
		durationType: row.duration_type,
		isPartyQuest: row.is_party_quest,
		minLevel: row.min_level,
		maxParticipants: row.max_participants,
		isActive: row.is_active,
		createdAt: row.created_at ?? "",
		updatedAt: row.updated_at ?? "",
	};
}

// クエストを削除
export async function deleteQuest(id: string): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_quest")
		.from("quests")
		.delete()
		.eq("id", id);

	if (error) throw error;
}

// クエストの有効/無効を切り替え
export async function toggleQuestActive(
	id: string,
	isActive: boolean,
): Promise<Quest> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_quest")
		.from("quests")
		.update({ is_active: isActive })
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;
	const row = data as DbQuest;
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		questTypeId: row.quest_type_id,
		difficultyId: row.difficulty_id,
		requirements: row.requirements,
		baseRewardExp: row.base_reward_exp,
		rewardBadgeId: row.reward_badge_id,
		durationType: row.duration_type,
		isPartyQuest: row.is_party_quest,
		minLevel: row.min_level,
		maxParticipants: row.max_participants,
		isActive: row.is_active,
		createdAt: row.created_at ?? "",
		updatedAt: row.updated_at ?? "",
	};
}
