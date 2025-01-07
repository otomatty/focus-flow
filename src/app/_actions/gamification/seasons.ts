"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Season = Database["ff_gamification"]["Tables"]["seasons"]["Row"];
type UserProgress =
	Database["ff_gamification"]["Tables"]["user_progress"]["Row"];
type UserHistory = Database["ff_gamification"]["Tables"]["user_history"]["Row"];
type RankSetting =
	Database["ff_gamification"]["Tables"]["rank_settings"]["Row"];

/**
 * 現在アクティブなシーズンを取得
 */
export async function getCurrentSeason(): Promise<Season | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("seasons")
		.select("*")
		.eq("status", "active")
		.order("start_date", { ascending: false })
		.limit(1)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// アクティブなシーズンが見つからない場合
			return null;
		}
		throw new Error(`Failed to fetch current season: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーのシーズン進捗を取得
 * @param userId - ユーザーID
 * @param seasonId - シーズンID
 */
export async function getUserSeasonProgress(
	userId: string,
	seasonId: string,
): Promise<UserProgress & { season: Season }> {
	const supabase = await createClient();

	// まず進捗データを初期化
	const { data: initializedProgress, error: initError } = await supabase
		.schema("ff_gamification")
		.rpc("initialize_user_season_progress", {
			p_user_id: userId,
			p_season_id: seasonId,
		});

	if (initError) {
		throw new Error(
			`Failed to initialize user season progress: ${initError.message}`,
		);
	}

	// 初期化されたデータとシーズン情報を取得
	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_progress")
		.select(`
			*,
			season:seasons(*)
		`)
		.eq("user_id", userId)
		.eq("season_id", seasonId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch user season progress: ${error.message}`);
	}

	return data;
}

/**
 * シーズンのランク設定を取得
 * @param seasonId - シーズンID
 */
export async function getSeasonRankSettings(
	seasonId: string,
): Promise<RankSetting[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("rank_settings")
		.select("*")
		.eq("season_id", seasonId)
		.order("required_points", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch rank settings: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーのシーズン履歴を取得
 * @param userId - ユーザーID
 * @param limit - 取得数
 */
export async function getUserSeasonHistory(
	userId: string,
	limit = 5,
): Promise<(UserHistory & { season: Season })[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("user_history")
		.select(`
      *,
      season:seasons(*)
    `)
		.eq("user_id", userId)
		.order("archived_at", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(`Failed to fetch user season history: ${error.message}`);
	}

	return data;
}

/**
 * シーズンの統計情報を取得
 * @param seasonId - シーズンID
 */
export async function getSeasonStatistics(seasonId: string) {
	const supabase = await createClient();

	const { data: userProgress, error: progressError } = await supabase
		.schema("ff_gamification")
		.from("user_progress")
		.select("*")
		.eq("season_id", seasonId);

	if (progressError) {
		throw new Error(
			`Failed to fetch season statistics: ${progressError.message}`,
		);
	}

	// 統計情報を計算
	const stats = {
		totalParticipants: userProgress.length,
		rankDistribution: {
			bronze: userProgress.filter((p) => p.current_rank === "bronze").length,
			silver: userProgress.filter((p) => p.current_rank === "silver").length,
			gold: userProgress.filter((p) => p.current_rank === "gold").length,
			platinum: userProgress.filter((p) => p.current_rank === "platinum")
				.length,
			diamond: userProgress.filter((p) => p.current_rank === "diamond").length,
		},
		averagePoints:
			userProgress.reduce((acc, p) => acc + p.current_points, 0) /
			userProgress.length,
		totalFocusTime: userProgress.reduce(
			(acc, p) => acc + Number(p.total_focus_time),
			0,
		),
		totalCompletedTasks: userProgress.reduce(
			(acc, p) => acc + p.completed_tasks,
			0,
		),
	};

	return stats;
}

/**
 * シーズンの移行状況を確認
 * @param fromSeasonId - 移行元シーズンID
 * @param toSeasonId - 移行先シーズンID
 */
export async function checkSeasonTransition(
	fromSeasonId: string,
	toSeasonId: string,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("season_transitions")
		.select("*")
		.eq("from_season_id", fromSeasonId)
		.eq("to_season_id", toSeasonId)
		.single();

	if (error && error.code !== "PGRST116") {
		throw new Error(`Failed to check season transition: ${error.message}`);
	}

	return data ?? null;
}
