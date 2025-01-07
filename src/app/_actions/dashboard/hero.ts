"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserLevel } from "@/app/_actions/gamification/level";
import {
	getCurrentSeason,
	getUserSeasonProgress,
	getSeasonRankSettings,
} from "@/app/_actions/gamification/seasons";
import {
	getWeeklyStats,
	getUserStreaks,
} from "@/app/_actions/users/statistics";
import type {
	DashboardUserProfile,
	SeasonData,
} from "@/app/webapp/_components/DashboardHero/types";

/**
 * DashboardHero用のデータを取得
 */
export async function getDashboardHeroData() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	// 並列でデータを取得
	const [level, weeklyStats, currentSeason, streaks] = await Promise.all([
		getUserLevel(),
		getWeeklyStats(user.id),
		getCurrentSeason(),
		getUserStreaks(user.id),
	]);

	// アクティブなシーズンが存在しない場合のエラーハンドリング
	if (!currentSeason) {
		throw new Error("No active season found");
	}

	// シーズン進捗を取得
	const progress = await getUserSeasonProgress(user.id, currentSeason.id);

	// 次のランクの要件を取得
	const rankSettings = await getSeasonRankSettings(currentSeason.id);
	const currentRankIndex = rankSettings.findIndex(
		(rank) => rank.rank_name === progress.current_rank,
	);
	const nextRankRequirements =
		rankSettings[currentRankIndex + 1] || rankSettings[currentRankIndex];

	// 残り日数を計算
	const remainingDays = Math.ceil(
		(new Date(currentSeason.end_date).getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24),
	);

	// ユーザープロファイルデータを構築
	const userProfile: DashboardUserProfile = {
		displayName: user.user_metadata.name || null,
		email: user.email || "",
		profileImage: user.user_metadata.avatar_url || null,
		level,
		streak: {
			current: streaks.login.current,
			best: streaks.login.best,
		},
	};

	// シーズンデータを構築
	const seasonData: SeasonData = {
		season: {
			...currentSeason,
			rules: currentSeason.rules as {
				point_multipliers: {
					focus_session: number;
					task_completion: number;
					streak_bonus: number;
				};
			},
		},
		progress,
		rankRequirements: {
			required_points: nextRankRequirements.required_points ?? undefined,
			focus_time_requirement:
				nextRankRequirements.focus_time_requirement?.toString(),
			task_completion_requirement:
				nextRankRequirements.task_completion_requirement ?? undefined,
			daily_focus_requirement:
				nextRankRequirements.daily_focus_requirement?.toString(),
			weekly_focus_requirement:
				nextRankRequirements.weekly_focus_requirement?.toString(),
			maintenance_requirements:
				(nextRankRequirements.maintenance_requirements as {
					focus_time?: string;
					task_completion?: number;
					daily_activity?: boolean;
					weekly_goals?: number;
					minimum_points?: number;
				}) ?? undefined,
		},
		remainingDays,
	};

	return {
		profile: userProfile,
		weeklyStats,
		season: seasonData,
	};
}
