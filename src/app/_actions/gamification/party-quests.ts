"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Quest = Database["ff_gamification"]["Tables"]["quests"]["Row"];
type PartyQuestProgress =
	Database["ff_gamification"]["Tables"]["party_quest_progress"]["Row"];

/**
 * パーティークエストの一覧を取得
 * @param partyLevel - パーティーの平均レベル
 */
export async function getAvailablePartyQuests(
	partyLevel: number,
): Promise<Quest[]> {
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
		.eq("is_party_quest", true)
		.lte("min_level", partyLevel)
		.order("min_level", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch party quests: ${error.message}`);
	}

	return data;
}

/**
 * パーティークエストの進捗を取得
 * @param partyId - パーティーID
 */
export async function getPartyQuestProgress(
	partyId: string,
): Promise<PartyQuestProgress> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("party_quest_progress")
		.select("*")
		.eq("party_id", partyId)
		.single();

	if (error && error.code !== "PGRST116") {
		throw new Error(`Failed to fetch party quest progress: ${error.message}`);
	}

	if (!data) {
		return {
			id: "",
			party_id: partyId,
			progress: {},
			created_at: null,
			updated_at: null,
		};
	}

	return data;
}

/**
 * パーティークエストの進捗を更新
 * @param partyId - パーティーID
 * @param questTypeId - クエストタイプID
 * @param progress - 進捗データ
 */
export async function updatePartyQuestProgress(
	partyId: string,
	questTypeId: string,
	progress: Record<string, number>,
) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_gamification")
		.rpc("update_party_quest_progress", {
			p_party_id: partyId,
			p_quest_type_id: questTypeId,
			p_progress: progress,
		});

	if (error) {
		throw new Error(`Failed to update party quest progress: ${error.message}`);
	}
}

/**
 * パーティークエストの達成状況を確認
 * @param partyId - パーティーID
 */
export async function checkPartyQuestCompletion(
	partyId: string,
): Promise<boolean> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_social")
		.from("parties")
		.select("is_completed")
		.eq("id", partyId)
		.single();

	if (error) {
		throw new Error(`Failed to check party quest completion: ${error.message}`);
	}

	return data.is_completed ?? false;
}

/**
 * パーティークエストの参加者数を確認
 * @param partyId - パーティーID
 * @param questId - クエストID
 */
export async function validatePartySize(
	partyId: string,
	questId: string,
): Promise<boolean> {
	const supabase = await createClient();

	// クエストの最大参加人数を取得
	const { data: quest, error: questError } = await supabase
		.schema("ff_gamification")
		.from("quests")
		.select("max_participants")
		.eq("id", questId)
		.single();

	if (questError) {
		throw new Error(`Failed to fetch quest details: ${questError.message}`);
	}

	// パーティーのメンバー数を取得
	const { count, error: countError } = await supabase
		.schema("ff_social")
		.from("party_members")
		.select("*", { count: "exact" })
		.eq("party_id", partyId);

	if (countError) {
		throw new Error(`Failed to count party members: ${countError.message}`);
	}

	return (count ?? 0) <= (quest.max_participants ?? 0);
}
