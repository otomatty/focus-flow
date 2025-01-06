"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Template = Database["ff_schedules"]["Tables"]["templates"]["Row"];
type TemplateTimeSlot =
	Database["ff_schedules"]["Tables"]["template_time_slots"]["Row"];
type TemplateApplyDay =
	Database["ff_schedules"]["Tables"]["template_apply_days"]["Row"];
type TemplateLike = Database["ff_schedules"]["Tables"]["template_likes"]["Row"];
type VisibilityType = Database["ff_schedules"]["Enums"]["visibility_type"];

interface TemplateWithDetails extends Template {
	timeSlots: TemplateTimeSlot[];
	applyDays: number[];
	isLiked?: boolean;
}

/**
 * テンプレートを作成
 */
export async function createTemplate(params: {
	userId: string;
	name: string;
	description?: string;
	colorId?: string;
	visibility?: VisibilityType;
	timeSlots: {
		title: string;
		startTime: string;
		endTime: string;
		description?: string;
		colorId?: string;
	}[];
	applyDays: number[];
}): Promise<TemplateWithDetails> {
	const supabase = await createClient();

	// テンプレートを作成
	const { data: template, error: templateError } = await supabase
		.schema("ff_schedules")
		.from("templates")
		.insert({
			user_id: params.userId,
			name: params.name,
			description: params.description,
			color_id: params.colorId,
			visibility: params.visibility ?? "private",
		})
		.select()
		.single();

	if (templateError) {
		throw new Error(`Failed to create template: ${templateError.message}`);
	}

	// タイムスロットを作成
	const { data: timeSlots, error: timeSlotsError } = await supabase
		.schema("ff_schedules")
		.from("template_time_slots")
		.insert(
			params.timeSlots.map((slot) => ({
				template_id: template.id,
				title: slot.title,
				start_time: slot.startTime,
				end_time: slot.endTime,
				description: slot.description,
				color_id: slot.colorId,
			})),
		)
		.select();

	if (timeSlotsError) {
		throw new Error(`Failed to create time slots: ${timeSlotsError.message}`);
	}

	// 適用する曜日を設定
	const { error: applyDaysError } = await supabase
		.schema("ff_schedules")
		.from("template_apply_days")
		.insert(
			params.applyDays.map((day) => ({
				template_id: template.id,
				day_of_week: day,
			})),
		);

	if (applyDaysError) {
		throw new Error(`Failed to set apply days: ${applyDaysError.message}`);
	}

	return {
		...template,
		timeSlots,
		applyDays: params.applyDays,
	};
}

/**
 * テンプレートを取得
 */
export async function getTemplate(
	templateId: string,
	userId?: string,
): Promise<TemplateWithDetails> {
	const supabase = await createClient();

	// テンプレートを取得
	const { data: template, error: templateError } = await supabase
		.schema("ff_schedules")
		.from("templates")
		.select("*")
		.eq("id", templateId)
		.single();

	if (templateError) {
		throw new Error(`Failed to fetch template: ${templateError.message}`);
	}

	// タイムスロットを取得
	const { data: timeSlots, error: timeSlotsError } = await supabase
		.schema("ff_schedules")
		.from("template_time_slots")
		.select("*")
		.eq("template_id", templateId)
		.order("start_time", { ascending: true });

	if (timeSlotsError) {
		throw new Error(`Failed to fetch time slots: ${timeSlotsError.message}`);
	}

	// 適用する曜日を取得
	const { data: applyDays, error: applyDaysError } = await supabase
		.schema("ff_schedules")
		.from("template_apply_days")
		.select("day_of_week")
		.eq("template_id", templateId);

	if (applyDaysError) {
		throw new Error(`Failed to fetch apply days: ${applyDaysError.message}`);
	}

	// いいね状態を取得（ユーザーIDが指定されている場合）
	let isLiked: boolean | undefined;
	if (userId) {
		const { data: like } = await supabase
			.schema("ff_schedules")
			.from("template_likes")
			.select("*")
			.eq("template_id", templateId)
			.eq("user_id", userId)
			.single();

		isLiked = !!like;
	}

	return {
		...template,
		timeSlots,
		applyDays: applyDays.map((d) => d.day_of_week),
		isLiked,
	};
}

/**
 * テンプレート一覧を取得
 */
export async function getTemplates(params: {
	userId?: string;
	visibility?: VisibilityType;
	isFeatured?: boolean;
	limit?: number;
	offset?: number;
}): Promise<Template[]> {
	const supabase = await createClient();
	let query = supabase.schema("ff_schedules").from("templates").select("*");

	if (params.userId) {
		query = query.eq("user_id", params.userId);
	}
	if (params.visibility) {
		query = query.eq("visibility", params.visibility);
	}
	if (params.isFeatured !== undefined) {
		query = query.eq("is_featured", params.isFeatured);
	}
	if (params.limit) {
		query = query.limit(params.limit);
	}
	if (params.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query.order("created_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to fetch templates: ${error.message}`);
	}

	return data;
}

/**
 * テンプレートを更新
 */
export async function updateTemplate(
	templateId: string,
	params: {
		name?: string;
		description?: string;
		colorId?: string;
		visibility?: VisibilityType;
		timeSlots?: {
			title: string;
			startTime: string;
			endTime: string;
			description?: string;
			colorId?: string;
		}[];
		applyDays?: number[];
	},
): Promise<TemplateWithDetails> {
	const supabase = await createClient();

	// テンプレートを更新
	const { data: template, error: templateError } = await supabase
		.schema("ff_schedules")
		.from("templates")
		.update({
			name: params.name,
			description: params.description,
			color_id: params.colorId,
			visibility: params.visibility,
		})
		.eq("id", templateId)
		.select()
		.single();

	if (templateError) {
		throw new Error(`Failed to update template: ${templateError.message}`);
	}

	// タイムスロットを更新
	let timeSlots: TemplateTimeSlot[] = [];
	if (params.timeSlots) {
		// 既存のタイムスロットを削除
		await supabase
			.schema("ff_schedules")
			.from("template_time_slots")
			.delete()
			.eq("template_id", templateId);

		// 新しいタイムスロットを作成
		const { data: newTimeSlots, error: timeSlotsError } = await supabase
			.schema("ff_schedules")
			.from("template_time_slots")
			.insert(
				params.timeSlots.map((slot) => ({
					template_id: templateId,
					title: slot.title,
					start_time: slot.startTime,
					end_time: slot.endTime,
					description: slot.description,
					color_id: slot.colorId,
				})),
			)
			.select();

		if (timeSlotsError) {
			throw new Error(`Failed to update time slots: ${timeSlotsError.message}`);
		}

		timeSlots = newTimeSlots;
	}

	// 適用する曜日を更新
	if (params.applyDays) {
		// 既存の曜日設定を削除
		await supabase
			.schema("ff_schedules")
			.from("template_apply_days")
			.delete()
			.eq("template_id", templateId);

		// 新しい曜日設定を作成
		const { error: applyDaysError } = await supabase
			.schema("ff_schedules")
			.from("template_apply_days")
			.insert(
				params.applyDays.map((day) => ({
					template_id: templateId,
					day_of_week: day,
				})),
			);

		if (applyDaysError) {
			throw new Error(`Failed to update apply days: ${applyDaysError.message}`);
		}
	}

	return {
		...template,
		timeSlots,
		applyDays: params.applyDays ?? [],
	};
}

/**
 * テンプレートを削除
 */
export async function deleteTemplate(templateId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_schedules")
		.from("templates")
		.delete()
		.eq("id", templateId);

	if (error) {
		throw new Error(`Failed to delete template: ${error.message}`);
	}
}

/**
 * テンプレートにいいねを追加
 */
export async function likeTemplate(
	templateId: string,
	userId: string,
): Promise<TemplateLike> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("template_likes")
		.insert({
			template_id: templateId,
			user_id: userId,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to like template: ${error.message}`);
	}

	return data;
}

/**
 * テンプレートのいいねを解除
 */
export async function unlikeTemplate(templateId: string, userId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_schedules")
		.from("template_likes")
		.delete()
		.eq("template_id", templateId)
		.eq("user_id", userId);

	if (error) {
		throw new Error(`Failed to unlike template: ${error.message}`);
	}
}

/**
 * テンプレートのいいね一覧を取得
 */
export async function getTemplateLikes(
	templateId: string,
): Promise<TemplateLike[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("template_likes")
		.select("*")
		.eq("template_id", templateId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch template likes: ${error.message}`);
	}

	return data;
}
