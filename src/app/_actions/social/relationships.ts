"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Follow = Database["ff_social"]["Tables"]["follows"]["Row"];
type FollowStats = Database["ff_social"]["Tables"]["follow_stats"]["Row"];
type Block = Database["ff_social"]["Tables"]["blocks"]["Row"];
type FollowStatus = Database["ff_social"]["Enums"]["follow_status"];

/**
 * ユーザーをフォロー
 * @param followerId フォローするユーザーのID
 * @param followingId フォローされるユーザーのID
 * @returns フォロー情報
 */
export async function followUser(
	followerId: string,
	followingId: string,
): Promise<Follow> {
	const supabase = await createClient();

	// ブロック関係をチェック
	const { data: blockData } = await supabase
		.schema("ff_social")
		.from("blocks")
		.select("id")
		.or(
			`blocker_id.eq.${followingId},blocked_id.eq.${followerId},blocker_id.eq.${followerId},blocked_id.eq.${followingId}`,
		)
		.single();

	if (blockData) {
		throw new Error("Cannot follow blocked user");
	}

	const { data, error } = await supabase
		.schema("ff_social")
		.from("follows")
		.upsert({
			follower_id: followerId,
			following_id: followingId,
			status: "accepted",
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to follow user: ${error.message}`);
	}

	return data;
}

/**
 * フォローを解除
 * @param followerId フォローするユーザーのID
 * @param followingId フォローされるユーザーのID
 */
export async function unfollowUser(
	followerId: string,
	followingId: string,
): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_social")
		.from("follows")
		.delete()
		.eq("follower_id", followerId)
		.eq("following_id", followingId);

	if (error) {
		throw new Error(`Failed to unfollow user: ${error.message}`);
	}
}

/**
 * フォロー関係を取得
 * @param followerId フォローするユーザーのID
 * @param followingId フォローされるユーザーのID
 * @returns フォロー情報
 */
export async function getFollowStatus(
	followerId: string,
	followingId: string,
): Promise<Follow | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_social")
		.from("follows")
		.select("*")
		.eq("follower_id", followerId)
		.eq("following_id", followingId)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(`Failed to get follow status: ${error.message}`);
	}

	return data;
}

/**
 * フォロワー一覧を取得
 * @param userId フォローされるユーザーのID
 * @returns フォロー情報
 */
export async function getFollowers(
	userId: string,
	params?: {
		status?: FollowStatus;
		limit?: number;
		offset?: number;
	},
): Promise<Follow[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_social")
		.from("follows")
		.select("*")
		.eq("following_id", userId);

	if (params?.status) {
		query = query.eq("status", params.status);
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

	const { data, error } = await query.order("created_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to get followers: ${error.message}`);
	}

	return data;
}

/**
 * フォロー中のユーザー一覧を取得
 * @param userId フォローされるユーザーのID
 * @returns フォロー情報
 */
export async function getFollowing(
	userId: string,
	params?: {
		status?: FollowStatus;
		limit?: number;
		offset?: number;
	},
): Promise<Follow[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_social")
		.from("follows")
		.select("*")
		.eq("follower_id", userId);

	if (params?.status) {
		query = query.eq("status", params.status);
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

	const { data, error } = await query.order("created_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to get following: ${error.message}`);
	}

	return data;
}

/**
 * フォロー統計を取得
 * @param userId フォローされるユーザーのID
 * @returns フォロー統計情報
 */
export async function getFollowStats(userId: string): Promise<FollowStats> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_social")
		.from("follow_stats")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		throw new Error(`Failed to get follow stats: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーをブロック
 * @param blockerId ブロックするユーザーのID
 * @param blockedId ブロックされるユーザーのID
 * @returns ブロック情報
 */
export async function blockUser(
	blockerId: string,
	blockedId: string,
	reason?: string,
): Promise<Block> {
	const supabase = await createClient();

	// 既存のフォロー関係を削除
	await supabase
		.schema("ff_social")
		.from("follows")
		.delete()
		.or(
			`and(follower_id.eq.${blockerId},following_id.eq.${blockedId}),and(follower_id.eq.${blockedId},following_id.eq.${blockerId})`,
		);

	const { data, error } = await supabase
		.schema("ff_social")
		.from("blocks")
		.upsert({
			blocker_id: blockerId,
			blocked_id: blockedId,
			reason,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to block user: ${error.message}`);
	}

	return data;
}

/**
 * ブロックを解除
 * @param blockerId ブロックするユーザーのID
 * @param blockedId ブロックされるユーザーのID
 */
export async function unblockUser(
	blockerId: string,
	blockedId: string,
): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_social")
		.from("blocks")
		.delete()
		.eq("blocker_id", blockerId)
		.eq("blocked_id", blockedId);

	if (error) {
		throw new Error(`Failed to unblock user: ${error.message}`);
	}
}

/**
 * ブロック状態を確認
 * @param blockerId ブロックするユーザーのID
 * @param blockedId ブロックされるユーザーのID
 * @returns ブロック情報
 */
export async function getBlockStatus(
	blockerId: string,
	blockedId: string,
): Promise<Block | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_social")
		.from("blocks")
		.select("*")
		.eq("blocker_id", blockerId)
		.eq("blocked_id", blockedId)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(`Failed to get block status: ${error.message}`);
	}

	return data;
}

/**
 * ブロックリストを取得
 * @param userId ブロックされるユーザーのID
 * @returns ブロック情報
 */
export async function getBlockedUsers(
	userId: string,
	params?: {
		limit?: number;
		offset?: number;
	},
): Promise<Block[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_social")
		.from("blocks")
		.select("*")
		.eq("blocker_id", userId);

	if (params?.limit) {
		query = query.limit(params.limit);
	}

	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query.order("created_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to get blocked users: ${error.message}`);
	}

	return data;
}
