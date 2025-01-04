"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserLevel, LevelSetting } from "@/types/users/level";
import { convertToUserLevel } from "@/utils/converters";

// ユーザーレベル情報の取得
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

	return convertToUserLevel(level);
}

// 次のレベルに必要な経験値を取得
export async function getNextLevelExp(currentLevel: number): Promise<number> {
	const supabase = await createClient();
	const { data: levelSetting, error } = await supabase
		.schema("ff_gamification")
		.from("level_settings")
		.select("required_exp")
		.eq("level", currentLevel + 1)
		.single();

	if (error) {
		throw new Error(`レベル設定の取得に失敗しました: ${error.message}`);
	}

	return levelSetting.required_exp;
}

// レベル設定の取得
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

// 複数ユーザーのレベル情報を一括取得
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

	return levels.map(convertToUserLevel);
}
