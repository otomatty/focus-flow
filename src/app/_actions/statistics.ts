"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * ユーザーの統計情報を取得
 */
export async function getUserStatistics(userId: string) {
	try {
		const supabase = await createClient();

		const { data: userPlan } = await supabase
			.schema("ff_subscriptions")
			.rpc("get_user_plan", {
				p_user_id: userId,
			});

		const { data: statistics, error } = await supabase
			.schema("ff_statistics")
			.rpc("get_user_statistics", {
				p_user_id: userId,
				p_user_tier: userPlan?.[0]?.plan_name || "free",
			});

		if (error) {
			throw error;
		}

		return { statistics, error: null };
	} catch (error) {
		console.error("Error fetching user statistics:", error);
		return { statistics: null, error };
	}
}

/**
 * 期間指定でのフォーカストレンドを取得
 */
export async function getFocusTrends(
	userId: string,
	startDate: Date,
	endDate: Date,
) {
	try {
		const supabase = await createClient();

		const { data: trends, error } = await supabase
			.schema("ff_statistics")
			.rpc("get_focus_trends", {
				p_user_id: userId,
				p_period_start: startDate.toISOString(),
				p_period_end: endDate.toISOString(),
			});

		if (error) {
			throw error;
		}

		return { trends, error: null };
	} catch (error) {
		console.error("Error fetching focus trends:", error);
		return { trends: null, error };
	}
}

/**
 * 日次統計を記録
 */
export async function recordDailyStatistics(
	userId: string,
	focusTime: string,
	completedTasks: number,
) {
	try {
		const supabase = await createClient();

		const { error } = await supabase
			.schema("ff_statistics")
			.from("user_statistics_history")
			.insert({
				user_id: userId,
				statistics_date: new Date().toISOString().split("T")[0],
				focus_time: focusTime,
				completed_tasks: completedTasks,
			});

		if (error) {
			throw error;
		}

		// 統計情報を更新
		await supabase.schema("ff_statistics").rpc("safe_update_statistics");

		// キャッシュを更新
		revalidatePath("/webapp/dashboard");

		return { error: null };
	} catch (error) {
		console.error("Error recording daily statistics:", error);
		return { error };
	}
}

/**
 * 期間指定での統計情報を取得
 */
export async function getStatisticsByPeriod(
	userId: string,
	startDate: Date,
	endDate: Date,
) {
	try {
		const supabase = await createClient();

		const { data: periodStats, error } = await supabase
			.schema("ff_statistics")
			.rpc("get_statistics_by_period", {
				p_user_id: userId,
				p_start_date: startDate.toISOString(),
				p_end_date: endDate.toISOString(),
			});

		if (error) {
			throw error;
		}

		return { periodStats, error: null };
	} catch (error) {
		console.error("Error fetching period statistics:", error);
		return { periodStats: null, error };
	}
}

// 入力バリデーション用のスキーマ
const StatisticsInputSchema = z.object({
	focusTime: z.string().regex(/^(\d+:)?(\d{2}:)?\d{2}$/), // HH:MM:SS or MM:SS format
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
		// 入力値のバリデーション
		const validatedInput = StatisticsInputSchema.parse(input);

		return await recordDailyStatistics(
			userId,
			validatedInput.focusTime,
			validatedInput.completedTasks,
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: { message: "Invalid input data", details: error.errors },
			};
		}
		return { error };
	}
}
