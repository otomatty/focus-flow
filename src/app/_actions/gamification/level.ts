"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type UserLevel = Database["ff_gamification"]["Tables"]["user_levels"]["Row"];
type LevelSetting =
	Database["ff_gamification"]["Tables"]["level_settings"]["Row"];
type LevelInfo = {
	currentLevel: number;
	currentExp: number;
	nextLevelExp: number;
	progress: number;
};

/**
 * ユーザーレベル情報の取得
 * @returns ユーザーレベル情報
 */
export async function getUserLevel(): Promise<UserLevel> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("認証されていません");
	}

	const { data: level, error } = await supabase
		.schema("ff_gamification")
		.from("user_levels")
		.select("*")
		.eq("user_id", user.id)
		.single();

	if (error) {
		throw new Error(`レベル情報の取得に失敗しました: ${error.message}`);
	}

	return level;
}

/**
 * レベル情報の計算
 * @param totalExp 累計経験値
 * @returns レベル情報（現在のレベル、現在の経験値、次のレベルまでの必要経験値、進捗率）
 */
export async function calculateLevelInfo(totalExp: number): Promise<LevelInfo> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_gamification")
		.rpc("calculate_level_info", {
			p_total_exp: totalExp,
		})
		.single();

	if (error) {
		throw new Error(`レベル情報の計算に失敗しました: ${error.message}`);
	}

	return {
		currentLevel: data.current_level,
		currentExp: data.current_exp,
		nextLevelExp: data.next_level_exp,
		progress: Number(data.progress),
	};
}

/**
 * レベル設定の取得
 * @param level レベル
 * @returns レベル設定情報
 */
export async function getLevelSetting(level: number): Promise<LevelSetting> {
	const supabase = await createClient();
	const { data: levelSetting, error } = await supabase
		.schema("ff_gamification")
		.from("level_settings")
		.select("*")
		.eq("level", level)
		.single();

	if (error) {
		throw new Error(`レベル設定の取得に失敗しました: ${error.message}`);
	}

	return levelSetting;
}

/**
 * 複数ユーザーのレベル情報を一括取得
 * @param userIds ユーザーIDの配列
 * @returns ユーザーレベル情報の配列
 */
export async function getUserLevels(userIds: string[]): Promise<UserLevel[]> {
	const supabase = await createClient();
	const { data: levels, error } = await supabase
		.schema("ff_gamification")
		.from("user_levels")
		.select("*")
		.in("user_id", userIds);

	if (error) {
		throw new Error(`レベル情報の取得に失敗しました: ${error.message}`);
	}

	return levels;
}

/**
 * レベル設定一覧の取得
 * @param params.minLevel 最小レベル
 * @param params.maxLevel 最大レベル
 * @returns レベル設定情報の配列
 */
export async function getLevelSettings(params?: {
	minLevel?: number;
	maxLevel?: number;
}): Promise<LevelSetting[]> {
	const supabase = await createClient();
	let query = supabase
		.schema("ff_gamification")
		.from("level_settings")
		.select("*")
		.order("level");

	if (params?.minLevel !== undefined) {
		query = query.gte("level", params.minLevel);
	}

	if (params?.maxLevel !== undefined) {
		query = query.lte("level", params.maxLevel);
	}

	const { data: settings, error } = await query;

	if (error) {
		throw new Error(`レベル設定の取得に失敗しました: ${error.message}`);
	}

	return settings;
}
