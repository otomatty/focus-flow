"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

type LearningResourceRecommendation =
	Database["ff_skills"]["Tables"]["learning_resource_recommendations"]["Row"];

type RecommendationType =
	| "skill_based"
	| "learning_path"
	| "similar_users"
	| "next_step"
	| "trending"
	| "personalized";

interface RecommendationData {
	reason: string[];
	relevance_factors: Record<string, number>;
	skill_alignment: number | null;
	difficulty_match: number | null;
	time_commitment_match: number | null;
}

/**
 * 推奨情報を作成/更新
 */
export async function upsertRecommendation(params: {
	userId: string;
	resourceId: string;
	recommendationType: RecommendationType;
	score: number;
	data: Partial<RecommendationData>;
}): Promise<LearningResourceRecommendation> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_resource_recommendations")
		.upsert({
			user_id: params.userId,
			resource_id: params.resourceId,
			recommendation_type: params.recommendationType,
			recommendation_score: params.score,
			recommendation_data: params.data as unknown as Json,
			updated_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to upsert recommendation: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーの推奨リソース一覧を取得
 */
export async function getUserRecommendations(
	userId: string,
	params?: {
		type?: RecommendationType;
		minScore?: number;
		includeDismissed?: boolean;
		limit?: number;
		offset?: number;
	},
): Promise<LearningResourceRecommendation[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_skills")
		.from("learning_resource_recommendations")
		.select("*")
		.eq("user_id", userId);

	if (params?.type) {
		query = query.eq("recommendation_type", params.type);
	}

	if (params?.minScore) {
		query = query.gte("recommendation_score", params.minScore);
	}

	if (!params?.includeDismissed) {
		query = query.eq("is_dismissed", false);
	}

	query = query.order("recommendation_score", { ascending: false });

	if (params?.limit) {
		query = query.limit(params.limit);
	}

	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(`Failed to fetch recommendations: ${error.message}`);
	}

	return data;
}

/**
 * 推奨を非表示にする
 */
export async function dismissRecommendation(
	recommendationId: string,
): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_skills")
		.from("learning_resource_recommendations")
		.update({ is_dismissed: true })
		.eq("id", recommendationId);

	if (error) {
		throw new Error(`Failed to dismiss recommendation: ${error.message}`);
	}
}

/**
 * 推奨スコアを更新
 */
export async function updateRecommendationScore(params: {
	recommendationId: string;
	newScore: number;
	additionalData?: Partial<RecommendationData>;
}): Promise<LearningResourceRecommendation> {
	const supabase = await createClient();

	const updates: Partial<LearningResourceRecommendation> = {
		recommendation_score: params.newScore,
		updated_at: new Date().toISOString(),
	};

	if (params.additionalData) {
		const { data: current } = await supabase
			.schema("ff_skills")
			.from("learning_resource_recommendations")
			.select("recommendation_data")
			.eq("id", params.recommendationId)
			.single();

		updates.recommendation_data = {
			...(current?.recommendation_data as unknown as RecommendationData),
			...params.additionalData,
		} as unknown as Json;
	}

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_resource_recommendations")
		.update(updates)
		.eq("id", params.recommendationId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update recommendation score: ${error.message}`);
	}

	return data;
}

/**
 * 特定タイプの推奨をすべて非表示
 */
export async function dismissRecommendationsByType(
	userId: string,
	recommendationType: RecommendationType,
): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_skills")
		.from("learning_resource_recommendations")
		.update({ is_dismissed: true })
		.eq("user_id", userId)
		.eq("recommendation_type", recommendationType);

	if (error) {
		throw new Error(
			`Failed to dismiss recommendations by type: ${error.message}`,
		);
	}
}
