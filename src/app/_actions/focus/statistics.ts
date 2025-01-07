"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type FocusStatistics =
	Database["ff_focus"]["Tables"]["focus_statistics"]["Row"];

/**
 * ユーザーの集中セッション統計情報を取得
 * @param userId - ユーザーID
 */
export async function getFocusStatistics(
	userId: string,
): Promise<FocusStatistics> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_focus")
		.from("focus_statistics")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch focus statistics: ${error.message}`);
	}

	return data;
}

/**
 * 期間指定での集中セッション統計情報を取得
 * @param userId - ユーザーID
 * @param startDate - 開始日
 * @param endDate - 終了日
 */
export async function getFocusStatisticsByPeriod(
	userId: string,
	startDate: Date,
	endDate: Date,
) {
	const supabase = await createClient();

	const { data: sessions, error } = await supabase
		.schema("ff_focus")
		.from("focus_sessions")
		.select("*")
		.eq("user_id", userId)
		.gte("actual_start_time", startDate.toISOString())
		.lte("actual_start_time", endDate.toISOString());

	if (error) {
		throw new Error(`Failed to fetch focus sessions: ${error.message}`);
	}

	// 期間内の統計情報を計算
	const stats = {
		totalSessions: sessions.length,
		totalFocusTime: sessions.reduce(
			(acc, session) =>
				acc +
				(typeof session.actual_duration === "string"
					? Number.parseInt(session.actual_duration.split(" ")[0])
					: 0),
			0,
		),
		avgFocusRating:
			sessions.reduce((acc, session) => acc + session.focus_rating, 0) /
			(sessions.length || 1),
		completionRates: {
			perfect: sessions.filter((s) => s.completion_status === "PERFECT").length,
			completed: sessions.filter((s) => s.completion_status === "COMPLETED")
				.length,
			partial: sessions.filter((s) => s.completion_status === "PARTIAL").length,
			abandoned: sessions.filter((s) => s.completion_status === "ABANDONED")
				.length,
		},
		totalExp: sessions.reduce(
			(acc, session) => acc + (session.earned_exp || 0),
			0,
		),
		timeOfDay: {
			morning: sessions.filter(
				(s) =>
					new Date(s.actual_start_time).getHours() >= 5 &&
					new Date(s.actual_start_time).getHours() < 11,
			).length,
			afternoon: sessions.filter(
				(s) =>
					new Date(s.actual_start_time).getHours() >= 11 &&
					new Date(s.actual_start_time).getHours() < 17,
			).length,
			evening: sessions.filter(
				(s) =>
					new Date(s.actual_start_time).getHours() >= 17 &&
					new Date(s.actual_start_time).getHours() < 23,
			).length,
			night: sessions.filter(
				(s) =>
					new Date(s.actual_start_time).getHours() >= 23 ||
					new Date(s.actual_start_time).getHours() < 5,
			).length,
		},
	};

	return stats;
}

/**
 * 連続記録の情報を取得
 * @param userId - ユーザーID
 */
export async function getStreakInfo(userId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_focus")
		.from("focus_statistics")
		.select("current_streak, longest_streak, last_session_date")
		.eq("user_id", userId)
		.maybeSingle();

	if (error) {
		throw new Error(`Failed to fetch streak info: ${error.message}`);
	}

	// レコードが存在しない場合はデフォルト値を返す
	if (!data) {
		return {
			currentStreak: 0,
			longestStreak: 0,
			lastSessionDate: null,
		};
	}

	return {
		currentStreak: data.current_streak,
		longestStreak: data.longest_streak,
		lastSessionDate: data.last_session_date,
	};
}
