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
	const now = new Date();
	const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
	startOfWeek.setHours(0, 0, 0, 0);

	try {
		const data = await getStatisticsSummary(userId, startOfWeek, new Date());

		return {
			focusTime: data?.[0]?.total_focus_time || 0,
			completedTasks: data?.[0]?.total_completed_tasks || 0,
			avgSessionLength: data?.[0]?.avg_session_length || 0,
			taskCompletionRate: data?.[0]?.task_completion_rate || 0,
		};
	} catch (error) {
		console.error("週間統計の取得に失敗しました:", error);
		return {
			focusTime: 0,
			completedTasks: 0,
			avgSessionLength: 0,
			taskCompletionRate: 0,
		};
	}
}

/**
 * ユーザーのストリーク情報を取得
 * @param userId - 対象ユーザーのID
 */
export async function getUserStreaks(userId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_statistics")
		.select(`
			current_login_streak,
			longest_login_streak,
			current_focus_streak,
			longest_focus_streak,
			current_task_streak,
			longest_task_streak
		`)
		.eq("user_id", userId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch user streaks: ${error.message}`);
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
