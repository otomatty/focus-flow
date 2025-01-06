"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type SkillRank = Database["ff_skills"]["Tables"]["skill_ranks"]["Row"];
type RankPromotionRequirement =
	Database["ff_skills"]["Tables"]["rank_promotion_requirements"]["Row"];

/**
 * スキルランク一覧を取得
 */
export async function getSkillRanks(): Promise<SkillRank[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("skill_ranks")
		.select("*")
		.order("display_order", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch skill ranks: ${error.message}`);
	}

	return data;
}

/**
 * 特定のランクの詳細を取得
 */
export async function getSkillRank(rankId: string): Promise<SkillRank> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("skill_ranks")
		.select("*")
		.eq("id", rankId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch skill rank: ${error.message}`);
	}

	return data;
}

/**
 * スラッグでランクを検索
 */
export async function getSkillRankBySlug(slug: string): Promise<SkillRank> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("skill_ranks")
		.select("*")
		.eq("slug", slug)
		.single();

	if (error) {
		throw new Error(`Failed to fetch skill rank: ${error.message}`);
	}

	return data;
}

/**
 * 経験値から適切なランクを取得
 */
export async function getAppropriateRank(exp: number): Promise<SkillRank> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("skill_ranks")
		.select("*")
		.lte("required_exp", exp)
		.order("required_exp", { ascending: false })
		.limit(1)
		.single();

	if (error) {
		throw new Error(`Failed to fetch appropriate rank: ${error.message}`);
	}

	return data;
}

/**
 * ランク昇進の要件を取得
 */
export async function getRankPromotionRequirements(params: {
	fromRankId: string;
	toRankId: string;
	categoryId: string;
}): Promise<RankPromotionRequirement> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("rank_promotion_requirements")
		.select("*")
		.eq("from_rank_id", params.fromRankId)
		.eq("to_rank_id", params.toRankId)
		.eq("category_id", params.categoryId)
		.single();

	if (error) {
		throw new Error(
			`Failed to fetch rank promotion requirements: ${error.message}`,
		);
	}

	return data;
}

/**
 * 次のランクの要件を取得
 */
export async function getNextRankRequirements(params: {
	currentRankId: string;
	categoryId: string;
}): Promise<RankPromotionRequirement | null> {
	const supabase = await createClient();

	// 現在のランクの表示順を取得
	const { data: currentRank, error: rankError } = await supabase
		.schema("ff_skills")
		.from("skill_ranks")
		.select("display_order")
		.eq("id", params.currentRankId)
		.single();

	if (rankError) {
		throw new Error(`Failed to fetch current rank: ${rankError.message}`);
	}

	// 次のランクを取得
	const { data: nextRank, error: nextRankError } = await supabase
		.schema("ff_skills")
		.from("skill_ranks")
		.select("id")
		.eq("display_order", currentRank.display_order + 1)
		.single();

	if (nextRankError && nextRankError.code !== "PGRST116") {
		throw new Error(`Failed to fetch next rank: ${nextRankError.message}`);
	}

	if (!nextRank) {
		return null; // 最高ランクの場合
	}

	// 昇進要件を取得
	const { data: requirements, error: requirementsError } = await supabase
		.schema("ff_skills")
		.from("rank_promotion_requirements")
		.select("*")
		.eq("from_rank_id", params.currentRankId)
		.eq("to_rank_id", nextRank.id)
		.eq("category_id", params.categoryId)
		.single();

	if (requirementsError && requirementsError.code !== "PGRST116") {
		throw new Error(
			`Failed to fetch rank promotion requirements: ${requirementsError.message}`,
		);
	}

	return requirements;
}
