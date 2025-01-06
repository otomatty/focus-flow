"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Badge = Database["ff_gamification"]["Tables"]["badges"]["Row"];

/**
 * 全バッジ情報を取得
 */
export async function getAllBadges(): Promise<Badge[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("badges")
		.select("*")
		.order("created_at", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch badges: ${error.message}`);
	}

	return data;
}

/**
 * 特定のバッジ情報を取得
 * @param badgeId - バッジID
 */
export async function getBadgeById(badgeId: string): Promise<Badge> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("badges")
		.select("*")
		.eq("id", badgeId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch badge: ${error.message}`);
	}

	return data;
}

/**
 * バッジの条件を確認
 * @param userId - ユーザーID
 * @param conditionType - 条件タイプ
 * @param value - 現在の値
 */
export async function checkBadgeCondition(
	userId: string,
	conditionType: string,
	value: number,
): Promise<Badge[]> {
	const supabase = await createClient();

	// 条件タイプに一致するバッジを取得
	const { data: badges, error } = await supabase
		.schema("ff_gamification")
		.from("badges")
		.select("*")
		.eq("condition_type", conditionType);

	if (error) {
		throw new Error(`Failed to check badge conditions: ${error.message}`);
	}

	// 条件を満たすバッジをフィルタリング
	return badges.filter((badge) => {
		const condition = badge.condition_value as {
			count?: number;
			days?: number;
		};
		const requiredValue = condition.count || condition.days || 0;
		return value >= requiredValue;
	});
}

/**
 * 新しいバッジを作成（管理者用）
 * @param badgeData - バッジ情報
 */
export async function createBadge(badgeData: Omit<Badge, "id" | "created_at">) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("badges")
		.insert(badgeData)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create badge: ${error.message}`);
	}

	return data;
}

/**
 * バッジを更新（管理者用）
 * @param badgeId - バッジID
 * @param badgeData - 更新するバッジ情報
 */
export async function updateBadge(
	badgeId: string,
	badgeData: Partial<Omit<Badge, "id" | "created_at">>,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("badges")
		.update(badgeData)
		.eq("id", badgeId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update badge: ${error.message}`);
	}

	return data;
}

/**
 * バッジを削除（管理者用）
 * @param badgeId - バッジID
 */
export async function deleteBadge(badgeId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_gamification")
		.from("badges")
		.delete()
		.eq("id", badgeId);

	if (error) {
		throw new Error(`Failed to delete badge: ${error.message}`);
	}
}
