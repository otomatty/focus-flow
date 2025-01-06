"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type RecurrenceRule =
	Database["ff_schedules"]["Tables"]["recurrence_rules"]["Row"];
type RecurrenceWeekday =
	Database["ff_schedules"]["Tables"]["recurrence_weekdays"]["Row"];
type ScheduleRecurrence =
	Database["ff_schedules"]["Tables"]["schedule_recurrences"]["Row"];
type RecurrencePattern =
	Database["ff_schedules"]["Enums"]["recurrence_pattern"];

interface RecurrenceRuleWithWeekdays extends RecurrenceRule {
	weekdays: number[];
}

/**
 * 繰り返しルールを作成
 */
export async function createRecurrenceRule(params: {
	pattern: RecurrencePattern;
	interval?: number;
	startDate: string;
	endDate?: string;
	weekdays?: number[];
}): Promise<RecurrenceRuleWithWeekdays> {
	const supabase = await createClient();

	// 繰り返しルールを作成
	const { data: rule, error: ruleError } = await supabase
		.schema("ff_schedules")
		.from("recurrence_rules")
		.insert({
			pattern: params.pattern,
			interval: params.interval,
			start_date: params.startDate,
			end_date: params.endDate,
		})
		.select()
		.single();

	if (ruleError) {
		throw new Error(`Failed to create recurrence rule: ${ruleError.message}`);
	}

	// 曜日設定がある場合は追加
	if (params.weekdays && params.weekdays.length > 0) {
		const { error: weekdayError } = await supabase
			.schema("ff_schedules")
			.from("recurrence_weekdays")
			.insert(
				params.weekdays.map((day) => ({
					rule_id: rule.id,
					day_of_week: day,
				})),
			);

		if (weekdayError) {
			throw new Error(
				`Failed to create recurrence weekdays: ${weekdayError.message}`,
			);
		}
	}

	return {
		...rule,
		weekdays: params.weekdays ?? [],
	};
}

/**
 * 繰り返しルールを取得
 */
export async function getRecurrenceRule(
	ruleId: string,
): Promise<RecurrenceRuleWithWeekdays> {
	const supabase = await createClient();

	// 繰り返しルールを取得
	const { data: rule, error: ruleError } = await supabase
		.schema("ff_schedules")
		.from("recurrence_rules")
		.select("*")
		.eq("id", ruleId)
		.single();

	if (ruleError) {
		throw new Error(`Failed to fetch recurrence rule: ${ruleError.message}`);
	}

	// 曜日設定を取得
	const { data: weekdays, error: weekdayError } = await supabase
		.schema("ff_schedules")
		.from("recurrence_weekdays")
		.select("day_of_week")
		.eq("rule_id", ruleId);

	if (weekdayError) {
		throw new Error(
			`Failed to fetch recurrence weekdays: ${weekdayError.message}`,
		);
	}

	return {
		...rule,
		weekdays: weekdays.map((w) => w.day_of_week),
	};
}

/**
 * 繰り返しルールを更新
 */
export async function updateRecurrenceRule(
	ruleId: string,
	params: {
		pattern?: RecurrencePattern;
		interval?: number;
		startDate?: string;
		endDate?: string;
		weekdays?: number[];
	},
): Promise<RecurrenceRuleWithWeekdays> {
	const supabase = await createClient();

	// 繰り返しルールを更新
	const { data: rule, error: ruleError } = await supabase
		.schema("ff_schedules")
		.from("recurrence_rules")
		.update({
			pattern: params.pattern,
			interval: params.interval,
			start_date: params.startDate,
			end_date: params.endDate,
		})
		.eq("id", ruleId)
		.select()
		.single();

	if (ruleError) {
		throw new Error(`Failed to update recurrence rule: ${ruleError.message}`);
	}

	// 曜日設定を更新
	if (params.weekdays) {
		// 既存の曜日設定を削除
		await supabase
			.schema("ff_schedules")
			.from("recurrence_weekdays")
			.delete()
			.eq("rule_id", ruleId);

		// 新しい曜日設定を追加
		if (params.weekdays.length > 0) {
			const { error: weekdayError } = await supabase
				.schema("ff_schedules")
				.from("recurrence_weekdays")
				.insert(
					params.weekdays.map((day) => ({
						rule_id: ruleId,
						day_of_week: day,
					})),
				);

			if (weekdayError) {
				throw new Error(
					`Failed to update recurrence weekdays: ${weekdayError.message}`,
				);
			}
		}
	}

	return {
		...rule,
		weekdays: params.weekdays ?? [],
	};
}

/**
 * 繰り返しルールを削除
 */
export async function deleteRecurrenceRule(ruleId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_schedules")
		.from("recurrence_rules")
		.delete()
		.eq("id", ruleId);

	if (error) {
		throw new Error(`Failed to delete recurrence rule: ${error.message}`);
	}
}

/**
 * スケジュールに繰り返しルールを適用
 */
export async function applyRecurrenceRule(
	scheduleId: string,
	ruleId: string,
): Promise<ScheduleRecurrence> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_recurrences")
		.insert({
			schedule_id: scheduleId,
			rule_id: ruleId,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to apply recurrence rule: ${error.message}`);
	}

	return data;
}

/**
 * スケジュールの繰り返しルールを解除
 */
export async function removeRecurrenceRule(scheduleId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_schedules")
		.from("schedule_recurrences")
		.delete()
		.eq("schedule_id", scheduleId);

	if (error) {
		throw new Error(`Failed to remove recurrence rule: ${error.message}`);
	}
}
