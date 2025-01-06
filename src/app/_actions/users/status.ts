"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import { z } from "zod";

type AccountStatus = Database["ff_users"]["Tables"]["account_statuses"]["Row"];
type UserStatus = Database["ff_users"]["Tables"]["user_statuses"]["Row"];
type StatusHistory = Database["ff_users"]["Tables"]["status_history"]["Row"];

// バリデーションスキーマ
const AccountStatusSchema = z.object({
	status: z.enum(["active", "inactive", "pending", "suspended"]),
	reason: z.string().nullable(),
});

const UserStatusSchema = z.object({
	presence_status: z.enum(["online", "offline", "idle"]),
	focus_status: z
		.enum(["focusing", "breaking", "meeting", "available"])
		.nullable(),
	focus_session_id: z.string().uuid().nullable(),
	focus_started_at: z.string().datetime().nullable(),
	focus_expected_end_at: z.string().datetime().nullable(),
});

/**
 * アカウントステータスを更新
 * @param userId - 対象ユーザーのID
 * @param status - 新しいステータス
 * @param reason - 変更理由（オプション）
 */
export async function updateAccountStatus(
	userId: string,
	status: AccountStatus["status"],
	reason?: string,
) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("account_statuses")
		.upsert(
			{
				user_id: userId,
				status,
				reason,
				changed_at: new Date().toISOString(),
			},
			{
				onConflict: "user_id",
			},
		);

	if (error) {
		throw new Error(`Failed to update account status: ${error.message}`);
	}
}

/**
 * アカウントステータスを取得
 * @param userId - 対象ユーザーのID
 */
export async function getAccountStatus(userId: string): Promise<AccountStatus> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("account_statuses")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// レコードが見つからない場合はデフォルト値を返す
			return {
				id: "",
				user_id: userId,
				status: "pending",
				reason: null,
				changed_by: null,
				changed_at: new Date().toISOString(),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};
		}
		throw new Error(`Failed to fetch account status: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーステータスを更新
 * @param userId - 対象ユーザーのID
 * @param status - 新しいステータス
 */
export async function updateUserStatus(
	userId: string,
	status: Partial<z.infer<typeof UserStatusSchema>>,
) {
	try {
		const validatedStatus = UserStatusSchema.partial().parse(status);

		const supabase = await createClient();

		const { error } = await supabase
			.schema("ff_users")
			.from("user_statuses")
			.upsert(
				{
					user_id: userId,
					...validatedStatus,
					last_activity_at: new Date().toISOString(),
				},
				{
					onConflict: "user_id",
				},
			);

		if (error) {
			throw new Error(`Failed to update user status: ${error.message}`);
		}

		return { error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: { message: "Invalid status data", details: error.errors },
			};
		}
		return { error };
	}
}

/**
 * ユーザーステータスを取得
 * @param userId - 対象ユーザーのID
 */
export async function getUserStatus(userId: string): Promise<UserStatus> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_statuses")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// レコードが見つからない場合はデフォルト値を返す
			return {
				id: "",
				user_id: userId,
				presence_status: "offline",
				focus_status: null,
				focus_session_id: null,
				focus_started_at: null,
				focus_expected_end_at: null,
				last_activity_at: new Date().toISOString(),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};
		}
		throw new Error(`Failed to fetch user status: ${error.message}`);
	}

	return data;
}

/**
 * フォーカスセッションを開始
 * @param userId - 対象ユーザーのID
 * @param sessionId - フォーカスセッションのID
 * @param expectedEndAt - 予定終了時刻
 */
export async function startFocusSession(
	userId: string,
	sessionId: string,
	expectedEndAt: Date,
) {
	return updateUserStatus(userId, {
		focus_status: "focusing",
		focus_session_id: sessionId,
		focus_started_at: new Date().toISOString(),
		focus_expected_end_at: expectedEndAt.toISOString(),
	});
}

/**
 * フォーカスセッションを終了
 * @param userId - 対象ユーザーのID
 */
export async function endFocusSession(userId: string) {
	return updateUserStatus(userId, {
		focus_status: "available",
		focus_session_id: null,
		focus_started_at: null,
		focus_expected_end_at: null,
	});
}

/**
 * ステータス履歴を取得
 * @param userId - 対象ユーザーのID
 * @param statusType - ステータスタイプ
 * @param limit - 取得件数
 */
export async function getStatusHistory(
	userId: string,
	statusType: StatusHistory["status_type"],
	limit = 10,
): Promise<StatusHistory[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("status_history")
		.select("*")
		.eq("user_id", userId)
		.eq("status_type", statusType)
		.order("changed_at", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(`Failed to fetch status history: ${error.message}`);
	}

	return data;
}
