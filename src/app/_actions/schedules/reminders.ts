"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type ScheduleReminder =
	Database["ff_schedules"]["Tables"]["schedule_reminders"]["Row"];

/**
 * リマインダーを作成
 */
export async function createReminder(params: {
	scheduleId: string;
	minutesBefore: number;
	isEnabled?: boolean;
}): Promise<ScheduleReminder> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_reminders")
		.insert({
			schedule_id: params.scheduleId,
			minutes_before: params.minutesBefore,
			is_enabled: params.isEnabled ?? true,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create reminder: ${error.message}`);
	}

	return data;
}

/**
 * リマインダーを取得
 */
export async function getReminder(
	reminderId: string,
): Promise<ScheduleReminder> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_reminders")
		.select("*")
		.eq("id", reminderId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch reminder: ${error.message}`);
	}

	return data;
}

/**
 * スケジュールのリマインダー一覧を取得
 */
export async function getScheduleReminders(
	scheduleId: string,
): Promise<ScheduleReminder[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_reminders")
		.select("*")
		.eq("schedule_id", scheduleId)
		.order("minutes_before", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch schedule reminders: ${error.message}`);
	}

	return data;
}

/**
 * リマインダーを更新
 */
export async function updateReminder(
	reminderId: string,
	params: {
		minutesBefore?: number;
		isEnabled?: boolean;
	},
): Promise<ScheduleReminder> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_reminders")
		.update({
			minutes_before: params.minutesBefore,
			is_enabled: params.isEnabled,
		})
		.eq("id", reminderId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update reminder: ${error.message}`);
	}

	return data;
}

/**
 * リマインダーを削除
 */
export async function deleteReminder(reminderId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_schedules")
		.from("schedule_reminders")
		.delete()
		.eq("id", reminderId);

	if (error) {
		throw new Error(`Failed to delete reminder: ${error.message}`);
	}
}

/**
 * リマインダーの有効/無効を切り替え
 */
export async function toggleReminder(
	reminderId: string,
	isEnabled: boolean,
): Promise<ScheduleReminder> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_reminders")
		.update({ is_enabled: isEnabled })
		.eq("id", reminderId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to toggle reminder: ${error.message}`);
	}

	return data;
}

/**
 * スケジュールのリマインダーを一括更新
 */
export async function updateScheduleReminders(
	scheduleId: string,
	reminders: {
		minutesBefore: number;
		isEnabled?: boolean;
	}[],
) {
	const supabase = await createClient();

	// 既存のリマインダーを削除
	await supabase
		.schema("ff_schedules")
		.from("schedule_reminders")
		.delete()
		.eq("schedule_id", scheduleId);

	// 新しいリマインダーを作成
	if (reminders.length > 0) {
		const { error } = await supabase
			.schema("ff_schedules")
			.from("schedule_reminders")
			.insert(
				reminders.map((reminder) => ({
					schedule_id: scheduleId,
					minutes_before: reminder.minutesBefore,
					is_enabled: reminder.isEnabled ?? true,
				})),
			);

		if (error) {
			throw new Error(`Failed to update schedule reminders: ${error.message}`);
		}
	}
}
