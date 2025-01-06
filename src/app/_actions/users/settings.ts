"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import { z } from "zod";

type UserSettings = Database["ff_users"]["Tables"]["user_settings"]["Row"];

// バリデーションスキーマ
const FocusModeRestrictionsSchema = z.object({
	social_media: z.boolean(),
	entertainment: z.boolean(),
	shopping: z.boolean(),
	news: z.boolean(),
	custom_urls: z.array(z.string().url()),
});

const NotificationPreferencesSchema = z.object({
	email: z.boolean(),
	push: z.boolean(),
	focus_time_alerts: z.boolean(),
	daily_summaries: z.boolean(),
	weekly_reports: z.boolean(),
});

const InterfacePreferencesSchema = z.object({
	sidebar_position: z.enum(["left", "right"]),
	default_view: z.enum(["list", "grid", "calendar"]),
	font_size: z.enum(["small", "medium", "large"]),
	high_contrast: z.boolean(),
	animations_reduced: z.boolean(),
	keyboard_shortcuts_enabled: z.boolean(),
});

const UserSettingsSchema = z.object({
	theme_color: z.string(),
	notification_enabled: z.boolean(),
	voice_input_enabled: z.boolean(),
	focus_mode_restrictions: FocusModeRestrictionsSchema,
	notification_preferences: NotificationPreferencesSchema,
	interface_preferences: InterfacePreferencesSchema,
});

/**
 * ユーザー設定を取得
 * @param userId - 対象ユーザーのID
 */
export async function getUserSettings(userId: string): Promise<UserSettings> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_settings")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch user settings: ${error.message}`);
	}

	return data;
}

/**
 * ユーザー設定を更新
 * @param userId - 対象ユーザーのID
 * @param settings - 更新する設定
 */
export async function updateUserSettings(
	userId: string,
	settings: Partial<z.infer<typeof UserSettingsSchema>>,
) {
	try {
		// 部分的な更新のための検証
		const validatedSettings = UserSettingsSchema.partial().parse(settings);

		const supabase = await createClient();

		const { error } = await supabase
			.schema("ff_users")
			.from("user_settings")
			.update(validatedSettings)
			.eq("user_id", userId);

		if (error) {
			throw new Error(`Failed to update user settings: ${error.message}`);
		}

		return { error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: { message: "Invalid settings data", details: error.errors },
			};
		}
		return { error };
	}
}

/**
 * フォーカスモード制限を更新
 * @param userId - 対象ユーザーのID
 * @param restrictions - 更新する制限設定
 */
export async function updateFocusModeRestrictions(
	userId: string,
	restrictions: Partial<z.infer<typeof FocusModeRestrictionsSchema>>,
) {
	try {
		const validatedRestrictions =
			FocusModeRestrictionsSchema.partial().parse(restrictions);

		const supabase = await createClient();

		const { error } = await supabase
			.schema("ff_users")
			.from("user_settings")
			.update({
				focus_mode_restrictions: validatedRestrictions,
			})
			.eq("user_id", userId);

		if (error) {
			throw new Error(
				`Failed to update focus mode restrictions: ${error.message}`,
			);
		}

		return { error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: { message: "Invalid restrictions data", details: error.errors },
			};
		}
		return { error };
	}
}

/**
 * 通知設定を更新
 * @param userId - 対象ユーザーのID
 * @param preferences - 更新する通知設定
 */
export async function updateNotificationPreferences(
	userId: string,
	preferences: Partial<z.infer<typeof NotificationPreferencesSchema>>,
) {
	try {
		const validatedPreferences =
			NotificationPreferencesSchema.partial().parse(preferences);

		const supabase = await createClient();

		const { error } = await supabase
			.schema("ff_users")
			.from("user_settings")
			.update({
				notification_preferences: validatedPreferences,
			})
			.eq("user_id", userId);

		if (error) {
			throw new Error(
				`Failed to update notification preferences: ${error.message}`,
			);
		}

		return { error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: { message: "Invalid preferences data", details: error.errors },
			};
		}
		return { error };
	}
}

/**
 * インターフェース設定を更新
 * @param userId - 対象ユーザーのID
 * @param preferences - 更新するインターフェース設定
 */
export async function updateInterfacePreferences(
	userId: string,
	preferences: Partial<z.infer<typeof InterfacePreferencesSchema>>,
) {
	try {
		const validatedPreferences =
			InterfacePreferencesSchema.partial().parse(preferences);

		const supabase = await createClient();

		const { error } = await supabase
			.schema("ff_users")
			.from("user_settings")
			.update({
				interface_preferences: validatedPreferences,
			})
			.eq("user_id", userId);

		if (error) {
			throw new Error(
				`Failed to update interface preferences: ${error.message}`,
			);
		}

		return { error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: { message: "Invalid preferences data", details: error.errors },
			};
		}
		return { error };
	}
}
