"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/supabase";

type UserPreference =
	Database["ff_notifications"]["Tables"]["user_preferences"]["Row"];

interface QuietHours {
	enabled: boolean;
	startTime: string;
	endTime: string;
	timezone: string;
}

/**
 * ユーザーの通知設定を取得
 */
export async function getUserNotificationPreferences(
	userId: string,
): Promise<UserPreference[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("user_preferences")
		.select("*")
		.eq("user_id", userId);

	if (error) {
		throw new Error(
			`Failed to fetch user notification preferences: ${error.message}`,
		);
	}

	return data;
}

/**
 * カテゴリごとの通知設定を取得
 */
export async function getCategoryNotificationPreference(
	userId: string,
	categoryId: string,
): Promise<UserPreference> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("user_preferences")
		.select("*")
		.eq("user_id", userId)
		.eq("category_id", categoryId)
		.single();

	if (error) {
		throw new Error(
			`Failed to fetch category notification preference: ${error.message}`,
		);
	}

	return data;
}

/**
 * 通知設定を更新または作成
 */
export async function upsertNotificationPreference(params: {
	userId: string;
	categoryId: string;
	emailEnabled?: boolean;
	pushEnabled?: boolean;
	inAppEnabled?: boolean;
	quietHours?: QuietHours;
}): Promise<UserPreference> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("user_preferences")
		.upsert(
			{
				user_id: params.userId,
				category_id: params.categoryId,
				email_enabled: params.emailEnabled,
				push_enabled: params.pushEnabled,
				in_app_enabled: params.inAppEnabled,
				quiet_hours: params.quietHours as unknown as Json,
			},
			{ onConflict: "user_id,category_id" },
		)
		.select()
		.single();

	if (error) {
		throw new Error(
			`Failed to update notification preference: ${error.message}`,
		);
	}

	return data;
}

/**
 * 通知設定を削除
 */
export async function deleteNotificationPreference(
	userId: string,
	categoryId: string,
) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_notifications")
		.from("user_preferences")
		.delete()
		.eq("user_id", userId)
		.eq("category_id", categoryId);

	if (error) {
		throw new Error(
			`Failed to delete notification preference: ${error.message}`,
		);
	}
}

/**
 * 全カテゴリの通知設定を一括更新
 */
export async function updateAllNotificationPreferences(params: {
	userId: string;
	emailEnabled: boolean;
	pushEnabled: boolean;
	inAppEnabled: boolean;
}) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_notifications")
		.from("user_preferences")
		.update({
			email_enabled: params.emailEnabled,
			push_enabled: params.pushEnabled,
			in_app_enabled: params.inAppEnabled,
		})
		.eq("user_id", params.userId);

	if (error) {
		throw new Error(
			`Failed to update all notification preferences: ${error.message}`,
		);
	}
}
