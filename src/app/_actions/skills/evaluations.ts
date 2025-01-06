"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type SkillEvaluationMetric =
	Database["ff_skills"]["Tables"]["skill_evaluation_metrics"]["Row"];
type UserSkillEvaluation =
	Database["ff_skills"]["Tables"]["user_skill_evaluations"]["Row"];
type RankEvaluationCriteria =
	Database["ff_skills"]["Tables"]["rank_evaluation_criteria"]["Row"];
type EvaluationHistory =
	Database["ff_skills"]["Tables"]["evaluation_history"]["Row"];

/**
 * 評価指標一覧を取得
 */
export async function getEvaluationMetrics(params?: {
	category?: string;
}): Promise<SkillEvaluationMetric[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_skills")
		.from("skill_evaluation_metrics")
		.select("*");

	if (params?.category) {
		query = query.eq("category", params.category);
	}

	const { data, error } = await query.order("weight", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch evaluation metrics: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーのスキル評価を取得
 */
export async function getUserSkillEvaluations(
	userSkillId: string,
): Promise<UserSkillEvaluation[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("user_skill_evaluations")
		.select("*")
		.eq("user_skill_id", userSkillId);

	if (error) {
		throw new Error(`Failed to fetch user skill evaluations: ${error.message}`);
	}

	return data;
}

/**
 * スキル評価を更新
 */
export async function updateSkillEvaluation(params: {
	userSkillId: string;
	metricId: string;
	evaluationData: Record<string, boolean | number | string>;
	currentScore?: number;
}): Promise<UserSkillEvaluation> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("user_skill_evaluations")
		.upsert({
			user_skill_id: params.userSkillId,
			metric_id: params.metricId,
			evaluation_data: params.evaluationData,
			current_score: params.currentScore,
			last_updated: new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update skill evaluation: ${error.message}`);
	}

	// 評価履歴を記録
	await supabase
		.schema("ff_skills")
		.from("evaluation_history")
		.insert({
			user_skill_id: params.userSkillId,
			evaluation_type: "metric_update",
			evaluation_data: {
				metric_id: params.metricId,
				...params.evaluationData,
				score: params.currentScore,
			},
		});

	return data;
}

/**
 * ランク昇進の評価基準を取得
 */
export async function getRankEvaluationCriteria(params: {
	fromRankId: string;
	toRankId: string;
	categoryId: string;
}): Promise<RankEvaluationCriteria> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("rank_evaluation_criteria")
		.select("*")
		.eq("from_rank_id", params.fromRankId)
		.eq("to_rank_id", params.toRankId)
		.eq("category_id", params.categoryId)
		.single();

	if (error) {
		throw new Error(
			`Failed to fetch rank evaluation criteria: ${error.message}`,
		);
	}

	return data;
}

/**
 * 評価履歴を取得
 */
export async function getEvaluationHistory(
	userSkillId: string,
	limit = 10,
): Promise<EvaluationHistory[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("evaluation_history")
		.select("*")
		.eq("user_skill_id", userSkillId)
		.order("evaluated_at", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(`Failed to fetch evaluation history: ${error.message}`);
	}

	return data;
}

/**
 * 総合評価スコアを計算
 */
export async function calculateTotalScore(
	userSkillId: string,
): Promise<number> {
	const supabase = await createClient();

	// 評価指標と現在のスコアを取得
	const { data: evaluations, error: evalError } = await supabase
		.schema("ff_skills")
		.from("user_skill_evaluations")
		.select("*, metric:skill_evaluation_metrics!inner(*)")
		.eq("user_skill_id", userSkillId);

	if (evalError) {
		throw new Error(`Failed to fetch evaluations: ${evalError.message}`);
	}

	// 重み付けされた総合スコアを計算
	let totalScore = 0;
	let totalWeight = 0;

	for (const evaluation of evaluations) {
		if (evaluation.current_score !== null) {
			totalScore += evaluation.current_score * evaluation.metric.weight;
			totalWeight += evaluation.metric.weight;
		}
	}

	return totalWeight > 0 ? totalScore / totalWeight : 0;
}
