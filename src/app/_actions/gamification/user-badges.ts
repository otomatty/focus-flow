"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type UserBadge = Database["ff_gamification"]["Tables"]["user_badges"]["Row"];
type Badge = Database["ff_gamification"]["Tables"]["badges"]["Row"];

/**
 * ユーザーの獲得バッジ一覧を取得
 * @param userId - ユーザーID
 */
export async function getUserBadges(
	userId: string,
): Promise<(UserBadge & { badge: Badge })[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_badges")
		.select(`
      *,
      badge:badges (*)
    `)
		.eq("user_id", userId)
		.order("acquired_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch user badges: ${error.message}`);
	}

	return data;
}

/**
 * バッジを獲得済みかチェック
 * @param userId - ユーザーID
 * @param badgeId - バッジID
 */
export async function hasBadge(
	userId: string,
	badgeId: string,
): Promise<boolean> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_badges")
		.select("id")
		.eq("user_id", userId)
		.eq("badge_id", badgeId)
		.single();

	if (error && error.code !== "PGRST116") {
		// PGRST116 は "結果が見つからない" エラー
		throw new Error(`Failed to check badge status: ${error.message}`);
	}

	return !!data;
}

/**
 * バッジを獲得
 * @param userId - ユーザーID
 * @param badgeId - バッジID
 */
export async function acquireBadge(
	userId: string,
	badgeId: string,
): Promise<UserBadge> {
	const supabase = await createClient();

	// 既に獲得済みかチェック
	const hasAlready = await hasBadge(userId, badgeId);
	if (hasAlready) {
		throw new Error("Badge already acquired");
	}

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_badges")
		.insert({
			user_id: userId,
			badge_id: badgeId,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to acquire badge: ${error.message}`);
	}

	return data;
}

/**
 * 最近獲得したバッジを取得
 * @param userId - ユーザーID
 * @param limit - 取得数
 */
export async function getRecentBadges(
	userId: string,
	limit = 5,
): Promise<(UserBadge & { badge: Badge })[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_badges")
		.select(`
      *,
      badge:badges (*)
    `)
		.eq("user_id", userId)
		.order("acquired_at", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(`Failed to fetch recent badges: ${error.message}`);
	}

	return data;
}

/**
 * バッジの獲得を取り消し（管理者用）
 * @param userId - ユーザーID
 * @param badgeId - バッジID
 */
export async function revokeBadge(userId: string, badgeId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_gamification")
		.from("user_badges")
		.delete()
		.eq("user_id", userId)
		.eq("badge_id", badgeId);

	if (error) {
		throw new Error(`Failed to revoke badge: ${error.message}`);
	}
}
