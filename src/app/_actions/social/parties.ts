"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Party = Database["ff_social"]["Tables"]["parties"]["Row"];
type PartyMember = Database["ff_social"]["Tables"]["party_members"]["Row"];
type PartyGenerationHistory =
	Database["ff_social"]["Tables"]["party_generation_history"]["Row"];

type PartyWithMemberCount = Party & {
	members: [
		{
			count: number;
		},
	];
};

/**
 * パーティーを取得
 * @param params.partyId - パーティーのID
 * @returns パーティー情報とメンバー情報
 */
export async function getParty(params: {
	partyId: string;
}): Promise<Party & { members: PartyMember[] }> {
	const supabase = await createClient();

	// パーティー情報を取得
	const { data: party, error: partyError } = await supabase
		.schema("ff_social")
		.from("parties")
		.select("*")
		.eq("id", params.partyId)
		.single();

	if (partyError) {
		throw new Error(`Failed to fetch party: ${partyError.message}`);
	}

	// メンバー情報を取得
	const { data: members, error: membersError } = await supabase
		.schema("ff_social")
		.from("party_members")
		.select("*")
		.eq("party_id", params.partyId);

	if (membersError) {
		throw new Error(`Failed to fetch party members: ${membersError.message}`);
	}

	return {
		...party,
		members,
	};
}

/**
 * アクティブなパーティー一覧を取得
 * @param params.userId - ユーザーID（指定した場合、そのユーザーが参加しているパーティーのみを取得）
 * @param params.limit - 取得する最大件数
 * @param params.offset - 取得開始位置
 * @returns パーティー情報の配列
 */
export async function getActiveParties(params?: {
	userId?: string;
	limit?: number;
	offset?: number;
}): Promise<Party[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_social")
		.from("parties")
		.select("*")
		.eq("is_active", true);

	if (params?.userId) {
		query = query.filter(
			"id",
			"in",
			`(select party_id from ff_social.party_members where user_id = '${params.userId}')`,
		);
	}

	if (params?.limit) {
		query = query.limit(params.limit);
	}

	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query.order("start_date", {
		ascending: true,
	});

	if (error) {
		throw new Error(`Failed to fetch active parties: ${error.message}`);
	}

	return data;
}

/**
 * パーティーに参加
 * @param params.partyId - 参加するパーティーのID
 * @param params.userId - 参加するユーザーのID
 * @returns パーティーメンバー情報
 * @throws {Error} パーティーが満員の場合やユーザーが既に他のパーティーに所属している場合
 */
export async function joinParty(params: {
	partyId: string;
	userId: string;
}): Promise<PartyMember> {
	const supabase = await createClient();

	// パーティーの情報を取得
	const { data: party, error: partyError } = await supabase
		.schema("ff_social")
		.from("parties")
		.select("*, members:party_members(count)")
		.eq("id", params.partyId)
		.single();

	if (partyError) {
		throw new Error(`Failed to fetch party: ${partyError.message}`);
	}

	// メンバー数をチェック
	const currentMembers = (party as PartyWithMemberCount).members[0].count;
	if (currentMembers >= party.max_members) {
		throw new Error("Party is full");
	}

	// ユーザーの既存のパーティー参加をチェック
	const { data: existingMembership, error: membershipError } = await supabase
		.schema("ff_social")
		.from("party_members")
		.select("id")
		.eq("user_id", params.userId)
		.single();

	if (membershipError && membershipError.code !== "PGRST116") {
		throw new Error(
			`Failed to check existing membership: ${membershipError.message}`,
		);
	}

	if (existingMembership) {
		throw new Error("User is already a member of another party");
	}

	// パーティーに参加
	const { data: member, error: joinError } = await supabase
		.schema("ff_social")
		.from("party_members")
		.insert({
			party_id: params.partyId,
			user_id: params.userId,
		})
		.select()
		.single();

	if (joinError) {
		throw new Error(`Failed to join party: ${joinError.message}`);
	}

	return member;
}

/**
 * パーティーから離脱
 * @param params.partyId - 離脱するパーティーのID
 * @param params.userId - 離脱するユーザーのID
 */
export async function leaveParty(params: {
	partyId: string;
	userId: string;
}): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_social")
		.from("party_members")
		.delete()
		.eq("party_id", params.partyId)
		.eq("user_id", params.userId);

	if (error) {
		throw new Error(`Failed to leave party: ${error.message}`);
	}
}

/**
 * パーティーのクエストを完了
 * @param params.partyId - 完了するパーティーのID
 * @param params.userId - クエスト完了を報告するユーザーのID
 * @returns クエストの完了が成功したかどうか
 */
export async function completePartyQuest(params: {
	partyId: string;
	userId: string;
}): Promise<boolean> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_social")
		.rpc("complete_party_quest", {
			p_party_id: params.partyId,
			p_user_id: params.userId,
		});

	if (error) {
		throw new Error(`Failed to complete party quest: ${error.message}`);
	}

	return data;
}

/**
 * パーティー生成履歴を取得
 * @param params.limit - 取得する最大件数
 * @param params.offset - 取得開始位置
 * @returns パーティー生成履歴の配列
 */
export async function getPartyGenerationHistory(params?: {
	limit?: number;
	offset?: number;
}): Promise<PartyGenerationHistory[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_social")
		.from("party_generation_history")
		.select("*");

	if (params?.limit) {
		query = query.limit(params.limit);
	}

	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query.order("generation_date", {
		ascending: false,
	});

	if (error) {
		throw new Error(
			`Failed to fetch party generation history: ${error.message}`,
		);
	}

	return data;
}

/**
 * ユーザーのパーティー参加履歴を取得
 * @param params.userId - ユーザーID
 * @param params.limit - 取得する最大件数
 * @param params.offset - 取得開始位置
 * @returns パーティー情報の配列
 */
export async function getUserPartyHistory(params: {
	userId: string;
	limit?: number;
	offset?: number;
}): Promise<Party[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_social")
		.from("parties")
		.select("*")
		.filter(
			"id",
			"in",
			`(select party_id from ff_social.party_members where user_id = '${params.userId}')`,
		);

	if (params?.limit) {
		query = query.limit(params.limit);
	}

	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query.order("start_date", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to fetch user party history: ${error.message}`);
	}

	return data;
}
