"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type {
	Conversation,
	ConversationInsert,
	ConversationTag,
	ConversationTagInsert,
	ConversationEvaluation,
	ConversationEvaluationInsert,
} from "./types";
import { convertToCamelCase } from "@/utils/caseConverter";

/**
 * 会話履歴を取得する
 */
export async function getConversations(userId: string, agentId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("conversations")
		.select("*")
		.eq("user_id", userId)
		.eq("agent_id", agentId)
		.order("created_at", { ascending: true });

	if (error) throw error;

	return data.map((conversation) =>
		convertToCamelCase(conversation),
	) as Conversation[];
}

/**
 * 会話を作成する
 */
export async function createConversation(conversation: ConversationInsert) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("conversations")
		.insert([conversation])
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as Conversation;
}

/**
 * 会話タグを取得する
 */
export async function getConversationTags(conversationId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("conversation_tags")
		.select("*")
		.eq("conversation_id", conversationId);

	if (error) throw error;

	return data.map((tag) => convertToCamelCase(tag)) as ConversationTag[];
}

/**
 * 会話タグを作成する
 */
export async function createConversationTag(tag: ConversationTagInsert) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("conversation_tags")
		.insert([tag])
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as ConversationTag;
}

/**
 * 会話評価を取得する
 */
export async function getConversationEvaluation(conversationId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("conversation_evaluations")
		.select("*")
		.eq("conversation_id", conversationId)
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as ConversationEvaluation;
}

/**
 * 会話評価を作成する
 */
export async function createConversationEvaluation(
	evaluation: ConversationEvaluationInsert,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("conversation_evaluations")
		.insert([evaluation])
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as ConversationEvaluation;
}
