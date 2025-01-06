"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import { z } from "zod";

type FocusSession = Database["ff_focus"]["Tables"]["focus_sessions"]["Row"];
type SessionType = Database["ff_focus"]["Enums"]["session_type"];
type CompletionStatus = Database["ff_focus"]["Enums"]["completion_status"];

// バリデーションスキーマ
const FocusSessionSchema = z.object({
	session_type: z.enum(["FREE", "SCHEDULED"]),
	scheduled_start_time: z.string().datetime().nullable(),
	task_id: z.string().uuid().nullable(),
	habit_id: z.string().uuid().nullable(),
	schedule_id: z.string().uuid().nullable(),
	focus_rating: z.number().int().min(1).max(5),
	session_number: z.number().int().min(1),
	total_sessions: z.number().int().min(1),
});

/**
 * 新しい集中セッションを開始
 * @param userId - ユーザーID
 * @param sessionData - セッション情報
 */
export async function startFocusSession(
	userId: string,
	sessionData: z.infer<typeof FocusSessionSchema>,
) {
	try {
		const validatedData = FocusSessionSchema.parse(sessionData);
		const supabase = await createClient();

		const { data, error } = await supabase
			.schema("ff_focus")
			.from("focus_sessions")
			.insert({
				user_id: userId,
				...validatedData,
				actual_start_time: new Date().toISOString(),
				completion_status: "PARTIAL",
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to start focus session: ${error.message}`);
		}

		return { data, error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				data: null,
				error: { message: "Invalid session data", details: error.errors },
			};
		}
		return { data: null, error };
	}
}

/**
 * 集中セッションを完了
 * @param sessionId - セッションID
 * @param actualDuration - 実際の集中時間（分）
 * @param focusRating - 集中度の自己評価（1-5）
 */
export async function completeFocusSession(
	sessionId: string,
	actualDuration: number,
	focusRating: number,
) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_focus")
		.from("focus_sessions")
		.update({
			end_time: new Date().toISOString(),
			actual_duration: `${actualDuration} minutes`,
			focus_rating: focusRating,
		})
		.eq("id", sessionId);

	if (error) {
		throw new Error(`Failed to complete focus session: ${error.message}`);
	}
}

/**
 * ユーザーの集中セッション履歴を取得
 * @param userId - ユーザーID
 * @param startDate - 開始日
 * @param endDate - 終了日
 * @param limit - 取得件数
 */
export async function getFocusSessionHistory(
	userId: string,
	startDate: Date,
	endDate: Date,
	limit = 10,
): Promise<FocusSession[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_focus")
		.from("focus_sessions")
		.select("*")
		.eq("user_id", userId)
		.gte("actual_start_time", startDate.toISOString())
		.lte("actual_start_time", endDate.toISOString())
		.order("actual_start_time", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(`Failed to fetch focus session history: ${error.message}`);
	}

	return data;
}

/**
 * 特定の集中セッションの詳細を取得
 * @param sessionId - セッションID
 */
export async function getFocusSessionDetails(
	sessionId: string,
): Promise<FocusSession> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_focus")
		.from("focus_sessions")
		.select("*")
		.eq("id", sessionId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch focus session details: ${error.message}`);
	}

	return data;
}

/**
 * 集中セッションの統計情報を取得
 * @param userId - ユーザーID
 * @param startDate - 開始日
 * @param endDate - 終了日
 */
export async function getFocusSessionStats(
	userId: string,
	startDate: Date,
	endDate: Date,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_focus")
		.from("focus_sessions")
		.select("*")
		.eq("user_id", userId)
		.gte("actual_start_time", startDate.toISOString())
		.lte("actual_start_time", endDate.toISOString());

	if (error) {
		throw new Error(`Failed to fetch focus session stats: ${error.message}`);
	}

	// 統計情報の計算
	const stats = {
		totalSessions: data.length,
		totalFocusTime: data.reduce(
			(acc, session) =>
				acc +
				(typeof session.actual_duration === "string"
					? Number.parseInt(session.actual_duration.split(" ")[0])
					: 0),
			0,
		),
		averageFocusRating:
			data.reduce((acc, session) => acc + session.focus_rating, 0) /
			(data.length || 1),
		completionRates: {
			perfect: data.filter((s) => s.completion_status === "PERFECT").length,
			completed: data.filter((s) => s.completion_status === "COMPLETED").length,
			partial: data.filter((s) => s.completion_status === "PARTIAL").length,
			abandoned: data.filter((s) => s.completion_status === "ABANDONED").length,
		},
		totalExp: data.reduce((acc, session) => acc + (session.earned_exp || 0), 0),
	};

	return stats;
}
