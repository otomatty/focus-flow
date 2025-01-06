"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Quest = Database["ff_gamification"]["Tables"]["quests"]["Row"];
type QuestType = Database["ff_gamification"]["Tables"]["quest_types"]["Row"];
type QuestDifficulty =
	Database["ff_gamification"]["Tables"]["quest_difficulties"]["Row"];
type UserQuest = Database["ff_gamification"]["Tables"]["user_quests"]["Row"];

/**
 * 利用可能なクエスト一覧を取得
 * @param userId - ユーザーID
 * @param userLevel - ユーザーレベル
 */
export async function getAvailableQuests(
	userId: string,
	userLevel: number,
): Promise<(Quest & { type: QuestType; difficulty: QuestDifficulty })[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("quests")
		.select(`
      *,
      type:quest_types(*),
      difficulty:quest_difficulties(*)
    `)
		.eq("is_active", true)
		.lte("min_level", userLevel)
		.order("min_level", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch available quests: ${error.message}`);
	}

	return data;
}

/**
 * クエストの詳細情報を取得
 * @param questId - クエストID
 */
export async function getQuestDetails(
	questId: string,
): Promise<Quest & { type: QuestType; difficulty: QuestDifficulty }> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("quests")
		.select(`
      *,
      type:quest_types(*),
      difficulty:quest_difficulties(*)
    `)
		.eq("id", questId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch quest details: ${error.message}`);
	}

	return data;
}

/**
 * クエストを受注
 * @param userId - ユーザーID
 * @param questId - クエストID
 */
export async function acceptQuest(
	userId: string,
	questId: string,
): Promise<UserQuest> {
	const supabase = await createClient();

	// クエスト情報を取得
	const quest = await getQuestDetails(questId);

	// 期間を計算
	const startDate = new Date();
	const endDate = new Date();
	switch (quest.duration_type) {
		case "daily":
			endDate.setDate(endDate.getDate() + 1);
			break;
		case "weekly":
			endDate.setDate(endDate.getDate() + 7);
			break;
		case "monthly":
			endDate.setMonth(endDate.getMonth() + 1);
			break;
	}

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_quests")
		.insert({
			user_id: userId,
			quest_id: questId,
			status: "in_progress",
			start_date: startDate.toISOString(),
			end_date: endDate.toISOString(),
			progress: {},
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to accept quest: ${error.message}`);
	}

	return data;
}

/**
 * クエストの進捗を更新
 * @param userId - ユーザーID
 * @param questId - クエストID
 * @param progress - 進捗データ
 */
export async function updateQuestProgress(
	userId: string,
	questId: string,
	progress: Record<string, number>,
) {
	const supabase = await createClient();

	const { error } = await supabase.rpc("update_quest_progress", {
		p_user_id: userId,
		p_quest_type: questId,
		p_progress: progress,
	});

	if (error) {
		throw new Error(`Failed to update quest progress: ${error.message}`);
	}
}

/**
 * ユーザーの進行中のクエスト一覧を取得
 * @param userId - ユーザーID
 */
export async function getActiveQuests(userId: string): Promise<
	(UserQuest & {
		quest: Quest & { type: QuestType; difficulty: QuestDifficulty };
	})[]
> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_quests")
		.select(`
      *,
      quest:quests (
        *,
        type:quest_types(*),
        difficulty:quest_difficulties(*)
      )
    `)
		.eq("user_id", userId)
		.eq("status", "in_progress")
		.order("end_date", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch active quests: ${error.message}`);
	}

	return data;
}

/**
 * クエスト履歴を取得
 * @param userId - ユーザーID
 * @param limit - 取得数
 */
export async function getQuestHistory(
	userId: string,
	limit = 10,
): Promise<(UserQuest & { quest: Quest })[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_quests")
		.select(`
      *,
      quest:quests(*)
    `)
		.eq("user_id", userId)
		.not("status", "eq", "in_progress")
		.order("completed_at", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(`Failed to fetch quest history: ${error.message}`);
	}

	return data;
}
