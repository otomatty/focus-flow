"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * ユーザーの統計情報を取得
 * @param userId - 対象ユーザーのID
 */
export async function getUserStatistics(userId: string) {
	const supabase = await createClient();

	// �計情報の存在を確認し、必要に応じて初期化
	const { error: initError } = await supabase
		.schema("ff_users")
		.rpc("ensure_user_statistics", {
			target_user_id: userId,
		});

	if (initError) {
		throw new Error(`Failed to ensure user statistics: ${initError.message}`);
	}

	// 統計情報を取得
	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_statistics")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch user statistics: ${error.message}`);
	}

	return data;
}

/**
 * フォーカスセッションの統計を更新
 * @param userId - 対象ユーザーのID
 * @param focusTime - フォーカス時間（分）
 */
export async function updateFocusStatistics(userId: string, focusTime: number) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("daily_statistics")
		.upsert(
			{
				user_id: userId,
				date: new Date().toISOString().split("T")[0],
				focus_minutes: focusTime,
				focus_sessions: 1,
			},
			{
				onConflict: "user_id,date",
				ignoreDuplicates: false,
			},
		);

	if (error) {
		throw new Error(`Failed to update focus statistics: ${error.message}`);
	}

	revalidatePath("/webapp/dashboard");
}

/**
 * タスク完了の統計を更新
 * @param userId - 対象ユーザーのID
 */
export async function updateTaskStatistics(userId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("daily_statistics")
		.upsert(
			{
				user_id: userId,
				date: new Date().toISOString().split("T")[0],
				tasks_completed: 1,
			},
			{
				onConflict: "user_id,date",
				ignoreDuplicates: false,
			},
		);

	if (error) {
		throw new Error(`Failed to update task statistics: ${error.message}`);
	}

	revalidatePath("/webapp/dashboard");
}

/**
 * ログイン統計を更新
 * @param userId - 対象ユーザーのID
 */
export async function updateLoginStatistics(userId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_gamification")
		.rpc("update_login_streak", {
			target_user_id: userId,
		});

	if (error) {
		throw new Error(`Failed to update login statistics: ${error.message}`);
	}
}

/**
 * 期間指定での統計情報を取得
 * @param userId - 対象ユーザーのID
 * @param startDate - 開始日
 * @param endDate - 終了日
 */
export async function getStatisticsByPeriod(
	userId: string,
	startDate: Date,
	endDate: Date,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("daily_statistics")
		.select("*")
		.eq("user_id", userId)
		.gte("date", startDate.toISOString().split("T")[0])
		.lte("date", endDate.toISOString().split("T")[0]);

	if (error) {
		throw new Error(`Failed to fetch period statistics: ${error.message}`);
	}

	return data;
}

/**
 * 統計情報のサマリーを取得
 * @param userId - 対象ユーザーのID
 * @param startDate - 開始日
 * @param endDate - 終了日
 */
export async function getStatisticsSummary(
	userId: string,
	startDate: Date,
	endDate: Date,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("daily_statistics")
		.select(`
			sum(focus_minutes) as total_focus_minutes,
			sum(focus_sessions) as total_focus_sessions,
			sum(tasks_completed) as total_tasks_completed,
			sum(habits_completed) as total_habits_completed,
			sum(experience_points) as total_experience_points,
			sum(badges_earned) as total_badges_earned
		`)
		.eq("user_id", userId)
		.gte("date", startDate.toISOString().split("T")[0])
		.lte("date", endDate.toISOString().split("T")[0])
		.single();

	if (error) {
		throw new Error(`Failed to fetch statistics summary: ${error.message}`);
	}

	return data;
}

// 入力バリデーション用のスキーマ
const StatisticsInputSchema = z.object({
	focusTime: z.number().min(0),
	completedTasks: z.number().int().min(0),
});

/**
 * 統計情報を記録（バリデーション付き）
 */
export async function recordStatisticsWithValidation(
	userId: string,
	input: z.infer<typeof StatisticsInputSchema>,
) {
	try {
		const validatedInput = StatisticsInputSchema.parse(input);

		await Promise.all([
			updateFocusStatistics(userId, validatedInput.focusTime),
			...Array(validatedInput.completedTasks)
				.fill(null)
				.map(() => updateTaskStatistics(userId)),
		]);

		return { error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: { message: "Invalid input data", details: error.errors },
			};
		}
		return { error };
	}
}

/**
 * 週間統計情報を取得
 * @param userId - 対象ユーザーのID
 */
export async function getWeeklyStats(userId: string) {
	const supabase = await createClient();
	const now = new Date();
	const year = now.getFullYear();
	const week = getWeekNumber(now);

	try {
		const { data, error } = await supabase
			.schema("ff_users")
			.from("weekly_statistics")
			.select(`
				focus_time,
				focus_sessions,
				completed_tasks,
				completed_habits
			`)
			.eq("user_id", userId)
			.eq("year", year)
			.eq("week", week)
			.single();

		if (error) {
			console.error("Error fetching weekly statistics:", {
				error,
				userId,
				year,
				week,
				details: {
					code: error.code,
					message: error.message,
					details: error.details,
					hint: error.hint,
				},
				timestamp: new Date().toISOString(),
			});

			if (error.code === "PGRST116") {
				return {
					focusMinutes: 0,
					focusSessions: 0,
					tasksCompleted: 0,
					habitsCompleted: 0,
				};
			}
			throw new Error(`Failed to fetch weekly statistics: ${error.message}`);
		}

		// データの型チェック
		if (!data) {
			console.warn("No weekly statistics data found:", {
				userId,
				year,
				week,
				timestamp: new Date().toISOString(),
			});
			return {
				focusMinutes: 0,
				focusSessions: 0,
				tasksCompleted: 0,
				habitsCompleted: 0,
			};
		}

		// focus_timeの型チェックと変換
		let focusMinutes = 0;
		if (data.focus_time) {
			try {
				focusMinutes = Math.floor(
					intervalToMinutes(data.focus_time as unknown as string),
				);
			} catch (error) {
				console.error("Error converting focus_time:", {
					error,
					focus_time: data.focus_time,
					userId,
					year,
					week,
					timestamp: new Date().toISOString(),
				});
			}
		}

		return {
			focusMinutes,
			focusSessions: data.focus_sessions || 0,
			tasksCompleted: data.completed_tasks || 0,
			habitsCompleted: data.completed_habits || 0,
		};
	} catch (error) {
		console.error("Unexpected error in getWeeklyStats:", {
			error,
			userId,
			year,
			week,
			timestamp: new Date().toISOString(),
		});
		return {
			focusMinutes: 0,
			focusSessions: 0,
			tasksCompleted: 0,
			habitsCompleted: 0,
		};
	}
}

// INTERVAL型を分に変換するヘルパー関数
function intervalToMinutes(interval: string): number {
	const matches = interval.match(/(\d+):(\d+):(\d+)/);
	if (!matches) return 0;
	const [_, hours, minutes, seconds] = matches;
	return (
		Number.parseInt(hours) * 60 +
		Number.parseInt(minutes) +
		Math.floor(Number.parseInt(seconds) / 60)
	);
}

// 週番号を取得するヘルパー関数
function getWeekNumber(date: Date): number {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() + 4 - (d.getDay() || 7));
	const yearStart = new Date(d.getFullYear(), 0, 1);
	const weekNumber = Math.ceil(
		((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
	);
	return weekNumber;
}

/**
 * ユーザーのストリーク情報を取得
 * @param userId - 対象ユーザーのID
 */
export async function getUserStreaks(userId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("login_streaks")
		.select(`
			current_streak,
			longest_streak
		`)
		.eq("user_id", userId)
		.single();

	if (error) {
		console.error("Error fetching user streaks:", {
			error,
			userId,
			timestamp: new Date().toISOString(),
		});
		// エラーが発生しても、デフォルト値を返す
		return {
			current: 0,
			best: 0,
		};
	}

	return {
		current: data.current_streak,
		best: data.longest_streak,
	};
}

/**
 * ログインストリークを更新
 * @param userId - 対象ユーザーのID
 */
export async function updateLoginStreak(userId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_gamification")
		.rpc("update_login_streak", {
			target_user_id: userId,
		});

	if (error) {
		throw new Error(`Failed to update login streak: ${error.message}`);
	}

	revalidatePath("/webapp");
}
