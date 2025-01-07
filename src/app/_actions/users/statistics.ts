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
		.rpc("update_focus_statistics", {
			p_user_id: userId,
			p_focus_time: `${focusTime} minutes`,
		});

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
		.rpc("update_task_statistics", {
			p_user_id: userId,
		});

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
		.schema("ff_users")
		.rpc("update_login_statistics", {
			p_user_id: userId,
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
		.rpc("get_statistics_by_period", {
			p_user_id: userId,
			p_start_date: startDate.toISOString(),
			p_end_date: endDate.toISOString(),
		});

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
		.rpc("get_statistics_summary", {
			p_user_id: userId,
			p_start_date: startDate.toISOString(),
			p_end_date: endDate.toISOString(),
		});

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
	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() - now.getDay());
	startOfWeek.setHours(0, 0, 0, 0);

	const { data, error } = await supabase
		.schema("ff_users")
		.from("weekly_statistics")
		.select(
			"focus_time, completed_tasks, completed_habits, avg_session_length, task_completion_rate",
		)
		.eq("user_id", userId)
		.eq("year", now.getFullYear())
		.eq("week", getWeekNumber(now))
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// データが見つからない場合はデフォルト値を返す
			return {
				focusTime: 0,
				completedTasks: 0,
				completedHabits: 0,
				avgSessionLength: 0,
				taskCompletionRate: 0,
			};
		}
		throw new Error(`Failed to fetch weekly statistics: ${error.message}`);
	}

	return {
		focusTime: data?.focus_time
			? Math.floor(intervalToHours(data.focus_time as string))
			: 0,
		completedTasks: data?.completed_tasks || 0,
		completedHabits: data?.completed_habits || 0,
		avgSessionLength: data?.avg_session_length
			? Math.floor(intervalToHours(data.avg_session_length as string))
			: 0,
		taskCompletionRate: data?.task_completion_rate || 0,
	};
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

// INTERVAL型を時間に変換するヘルパー関数
function intervalToHours(interval: string): number {
	const matches = interval.match(/(\d+):(\d+):(\d+)/);
	if (!matches) return 0;
	const [_, hours, minutes, seconds] = matches;
	return (
		Number.parseInt(hours) +
		Number.parseInt(minutes) / 60 +
		Number.parseInt(seconds) / 3600
	);
}

/**
 * ユーザーのストリーク情報を取得
 * @param userId - 対象ユーザーのID
 */
export async function getUserStreaks(userId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.rpc("get_user_streaks", {
			p_user_id: userId,
		})
		.single();

	if (error) {
		console.error("Error fetching user streaks:", {
			error,
			userId,
			timestamp: new Date().toISOString(),
		});
		// エラーが発生しても、デフォルト値を返す
		return {
			login: { current: 0, best: 0 },
			focus: { current: 0, best: 0 },
			task: { current: 0, best: 0 },
		};
	}

	return {
		login: {
			current: data.current_login_streak,
			best: data.longest_login_streak,
		},
		focus: {
			current: data.current_focus_streak,
			best: data.longest_focus_streak,
		},
		task: {
			current: data.current_task_streak,
			best: data.longest_task_streak,
		},
	};
}

/**
 * ログインストリークを更新
 * @param userId - 対象ユーザーのID
 */
export async function updateLoginStreak(userId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.rpc("update_login_statistics", {
			p_user_id: userId,
		});

	if (error) {
		throw new Error(`Failed to update login streak: ${error.message}`);
	}

	revalidatePath("/webapp");
}
