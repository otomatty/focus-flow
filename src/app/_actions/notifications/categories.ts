"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Category = Database["ff_notifications"]["Tables"]["categories"]["Row"];

/**
 * 通知カテゴリ一覧を取得
 */
export async function getNotificationCategories(params?: {
	isActive?: boolean;
}): Promise<Category[]> {
	const supabase = await createClient();
	let query = supabase
		.schema("ff_notifications")
		.from("categories")
		.select("*")
		.order("priority", { ascending: false });

	if (params?.isActive !== undefined) {
		query = query.eq("is_active", params.isActive);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(
			`Failed to fetch notification categories: ${error.message}`,
		);
	}

	return data;
}

/**
 * 通知カテゴリを取得
 */
export async function getNotificationCategory(
	categoryId: string,
): Promise<Category> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("categories")
		.select("*")
		.eq("id", categoryId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch notification category: ${error.message}`);
	}

	return data;
}

/**
 * 通知カテゴリを作成
 */
export async function createNotificationCategory(params: {
	name: string;
	displayName: string;
	description?: string;
	icon?: string;
	color?: string;
	priority?: number;
	isActive?: boolean;
}): Promise<Category> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("categories")
		.insert({
			name: params.name,
			display_name: params.displayName,
			description: params.description,
			icon: params.icon,
			color: params.color,
			priority: params.priority,
			is_active: params.isActive,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create notification category: ${error.message}`);
	}

	return data;
}

/**
 * 通知カテゴリを更新
 */
export async function updateNotificationCategory(
	categoryId: string,
	params: {
		displayName?: string;
		description?: string;
		icon?: string;
		color?: string;
		priority?: number;
		isActive?: boolean;
	},
): Promise<Category> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("categories")
		.update({
			display_name: params.displayName,
			description: params.description,
			icon: params.icon,
			color: params.color,
			priority: params.priority,
			is_active: params.isActive,
		})
		.eq("id", categoryId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update notification category: ${error.message}`);
	}

	return data;
}

/**
 * 通知カテゴリを削除
 */
export async function deleteNotificationCategory(categoryId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_notifications")
		.from("categories")
		.delete()
		.eq("id", categoryId);

	if (error) {
		throw new Error(`Failed to delete notification category: ${error.message}`);
	}
}
