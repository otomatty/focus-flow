"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type SystemCategory =
	Database["ff_schedules"]["Tables"]["system_categories"]["Row"];
type ScheduleCategory =
	Database["ff_schedules"]["Tables"]["schedule_categories"]["Row"];

/**
 * システムカテゴリ一覧を取得
 */
export async function getSystemCategories(): Promise<SystemCategory[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("system_categories")
		.select("*")
		.order("name", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch system categories: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーのカテゴリ一覧を取得
 */
export async function getUserCategories(
	userId: string,
): Promise<ScheduleCategory[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_categories")
		.select("*")
		.eq("user_id", userId)
		.order("sort_order", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch user categories: ${error.message}`);
	}

	return data;
}

/**
 * カテゴリを作成
 */
export async function createCategory(params: {
	userId: string;
	name: string;
	description?: string;
	colorId?: string;
	systemCategoryId?: string;
	sortOrder?: number;
}): Promise<ScheduleCategory> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_categories")
		.insert({
			user_id: params.userId,
			name: params.name,
			description: params.description,
			color_id: params.colorId,
			system_category_id: params.systemCategoryId,
			sort_order: params.sortOrder ?? 0,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create category: ${error.message}`);
	}

	return data;
}

/**
 * カテゴリを更新
 */
export async function updateCategory(
	categoryId: string,
	params: {
		name?: string;
		description?: string;
		colorId?: string;
		isActive?: boolean;
		sortOrder?: number;
	},
): Promise<ScheduleCategory> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_categories")
		.update({
			name: params.name,
			description: params.description,
			color_id: params.colorId,
			is_active: params.isActive,
			sort_order: params.sortOrder,
		})
		.eq("id", categoryId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update category: ${error.message}`);
	}

	return data;
}

/**
 * カテゴリを削除
 */
export async function deleteCategory(categoryId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_schedules")
		.from("schedule_categories")
		.delete()
		.eq("id", categoryId);

	if (error) {
		throw new Error(`Failed to delete category: ${error.message}`);
	}
}

/**
 * カテゴリの並び順を更新
 */
export async function updateCategoryOrder(
	categories: { id: string; sortOrder: number }[],
) {
	const supabase = await createClient();

	// 各カテゴリーを個別に更新
	for (const category of categories) {
		const { error } = await supabase
			.schema("ff_schedules")
			.from("schedule_categories")
			.update({ sort_order: category.sortOrder })
			.eq("id", category.id);

		if (error) {
			throw new Error(`Failed to update category order: ${error.message}`);
		}
	}
}

/**
 * カラーパレットを取得
 */
export async function getColorPalette() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("color_palette")
		.select("*")
		.order("name", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch color palette: ${error.message}`);
	}

	return data;
}
