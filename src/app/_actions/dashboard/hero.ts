"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserLevel } from "@/app/_actions/gamification/level";
import {
	getCurrentSeason,
	getUserSeasonProgress,
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

	// シーズン進捗を取得
	const progress = await getUserSeasonProgress(user.id, currentSeason.id);

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
		season: currentSeason,
		progress,
		remainingDays,
	};

	return {
		profile: userProfile,
		weeklyStats,
		season: seasonData,
	};
}
