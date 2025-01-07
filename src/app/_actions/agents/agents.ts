"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { Agent, AgentInsert, AgentUpdate } from "./types";
import { convertToCamelCase } from "@/utils/caseConverter";

/**
 * デフォルトエージェントを取得する
 */
export async function getDefaultAgent() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("agents")
		.select("*")
		.eq("is_default", true)
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as Agent;
}

/**
 * エージェントを取得する
 */
export async function getAgent(agentId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("agents")
		.select("*")
		.eq("id", agentId)
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as Agent;
}

/**
 * エージェント一覧を取得する
 */
export async function getAgents() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("agents")
		.select("*");

	if (error) throw error;

	return data.map((agent) => convertToCamelCase(agent)) as Agent[];
}

/**
 * エージェントを作成する
 */
export async function createAgent(agent: AgentInsert) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("agents")
		.insert([agent])
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as Agent;
}

/**
 * エージェントを更新する
 */
export async function updateAgent(agentId: string, agent: AgentUpdate) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("agents")
		.update(agent)
		.eq("id", agentId)
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as Agent;
}

/**
 * エージェントを削除する
 */
export async function deleteAgent(agentId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_agents")
		.from("agents")
		.delete()
		.eq("id", agentId);

	if (error) throw error;
}
