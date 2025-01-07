"use server";

import { createClient } from "@/lib/supabase/server";
import type {
	ConversationEvaluation,
	ConversationEvaluationInsert,
	UserAgentRelationshipUpdate,
	GetEvaluationStatisticsArgs,
	GetEvaluationStatisticsReturns,
} from "./types";
import { convertToCamelCase } from "@/utils/caseConverter";

/**
 * 会話を評価し、関係性パラメーターを更新する
 */
export async function evaluateConversation(
	evaluation: ConversationEvaluationInsert,
	userId: string,
	agentId: string,
) {
	const supabase = await createClient();

	// トランザクションを開始
	const { data: evaluationData, error: evaluationError } = await supabase
		.schema("ff_agents")
		.from("conversation_evaluations")
		.insert([evaluation])
		.select()
		.single();

	if (evaluationError) throw evaluationError;

	// 関係性パラメーターの更新
	const relationshipUpdate: UserAgentRelationshipUpdate = {
		intimacy: evaluationData.intimacy_change,
		shared_experience: evaluationData.shared_experience_change,
		emotional_understanding: evaluationData.emotional_understanding_change,
		total_interactions: 1, // インクリメント
		last_interaction_at: new Date().toISOString(),
	};

	const { error: relationshipError } = await supabase
		.schema("ff_agents")
		.from("user_agent_relationships")
		.update(relationshipUpdate)
		.eq("user_id", userId)
		.eq("agent_id", agentId);

	if (relationshipError) throw relationshipError;

	return convertToCamelCase(evaluationData) as ConversationEvaluation;
}

/**
 * 会話評価の統計を取得する
 */
export async function getEvaluationStatistics(userId: string, agentId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.rpc("get_evaluation_statistics", {
			p_user_id: userId,
			p_agent_id: agentId,
		});

	if (error) throw error;

	return convertToCamelCase(data) as GetEvaluationStatisticsReturns;
}

/**
 * 会話評価の履歴を取得する
 */
export async function getEvaluationHistory(
	userId: string,
	agentId: string,
	limit = 10,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("conversation_evaluations")
		.select("*")
		.eq("user_id", userId)
		.eq("agent_id", agentId)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) throw error;

	return data.map((evaluation) =>
		convertToCamelCase(evaluation),
	) as ConversationEvaluation[];
}
