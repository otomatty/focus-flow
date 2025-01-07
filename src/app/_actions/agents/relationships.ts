"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type {
	UserAgentRelationship,
	UserAgentRelationshipInsert,
	UserAgentRelationshipUpdate,
	SharedExperience,
	SharedExperienceInsert,
	RelationshipParameterHistory,
	RelationshipParameterHistoryInsert,
} from "./types";
import { convertToCamelCase } from "@/utils/caseConverter";

/**
 * ユーザーとエージェントの関係性を取得する
 */
export async function getUserAgentRelationship(
	userId: string,
	agentId: string,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("user_agent_relationships")
		.select("*")
		.eq("user_id", userId)
		.eq("agent_id", agentId)
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as UserAgentRelationship;
}

/**
 * ユーザーのエージェントとの関係性一覧を取得する
 */
export async function getUserAgentRelationships(userId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("user_agent_relationships")
		.select("*")
		.eq("user_id", userId);

	if (error) throw error;

	return data.map((relationship) =>
		convertToCamelCase(relationship),
	) as UserAgentRelationship[];
}

/**
 * ユーザーとエージェントの関係性を作成または更新する
 */
export async function upsertUserAgentRelationship(
	relationship: UserAgentRelationshipInsert,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("user_agent_relationships")
		.upsert([relationship])
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as UserAgentRelationship;
}

/**
 * ユーザーとエージェントの関係性を更新する
 */
export async function updateUserAgentRelationship(
	userId: string,
	agentId: string,
	relationship: UserAgentRelationshipUpdate,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("user_agent_relationships")
		.update(relationship)
		.eq("user_id", userId)
		.eq("agent_id", agentId)
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as UserAgentRelationship;
}

/**
 * 共有経験を取得する
 */
export async function getSharedExperiences(relationshipId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("shared_experiences")
		.select("*")
		.eq("user_agent_relationship_id", relationshipId);

	if (error) throw error;

	return data.map((experience) =>
		convertToCamelCase(experience),
	) as SharedExperience[];
}

/**
 * 共有経験を作成する
 */
export async function createSharedExperience(
	experience: SharedExperienceInsert,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("shared_experiences")
		.insert([experience])
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as SharedExperience;
}

/**
 * パラメーター更新履歴を取得する
 */
export async function getRelationshipParameterHistory(relationshipId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("relationship_parameter_history")
		.select("*")
		.eq("user_agent_relationship_id", relationshipId);

	if (error) throw error;

	return data.map((history) =>
		convertToCamelCase(history),
	) as RelationshipParameterHistory[];
}

/**
 * パラメーター更新履歴を作成する
 */
export async function createRelationshipParameterHistory(
	history: RelationshipParameterHistoryInsert,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_agents")
		.from("relationship_parameter_history")
		.insert([history])
		.select()
		.single();

	if (error) throw error;

	return convertToCamelCase(data) as RelationshipParameterHistory;
}
