"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/supabase";

type Template = Database["ff_notifications"]["Tables"]["templates"]["Row"];

/**
 * 通知テンプレート一覧を取得
 */
export async function getNotificationTemplates(params?: {
	categoryId?: string;
	isActive?: boolean;
}): Promise<Template[]> {
	const supabase = await createClient();
	let query = supabase
		.schema("ff_notifications")
		.from("templates")
		.select("*")
		.order("priority", { ascending: false });

	if (params?.categoryId) {
		query = query.eq("category_id", params.categoryId);
	}
	if (params?.isActive !== undefined) {
		query = query.eq("is_active", params.isActive);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(`Failed to fetch notification templates: ${error.message}`);
	}

	return data;
}

/**
 * 通知テンプレートを取得
 */
export async function getNotificationTemplate(
	templateId: string,
): Promise<Template> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("templates")
		.select("*")
		.eq("id", templateId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch notification template: ${error.message}`);
	}

	return data;
}

/**
 * 通知テンプレートを作成
 */
export async function createNotificationTemplate(params: {
	categoryId: string;
	name: string;
	titleTemplate: string;
	bodyTemplate: string;
	actionType?: string;
	actionData?: Record<string, unknown>;
	priority?: number;
	isActive?: boolean;
}): Promise<Template> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("templates")
		.insert({
			category_id: params.categoryId,
			name: params.name,
			title_template: params.titleTemplate,
			body_template: params.bodyTemplate,
			action_type: params.actionType,
			action_data: params.actionData as Json,
			priority: params.priority,
			is_active: params.isActive,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create notification template: ${error.message}`);
	}

	return data;
}

/**
 * 通知テンプレートを更新
 */
export async function updateNotificationTemplate(
	templateId: string,
	params: {
		titleTemplate?: string;
		bodyTemplate?: string;
		actionType?: string;
		actionData?: Record<string, unknown>;
		priority?: number;
		isActive?: boolean;
	},
): Promise<Template> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("templates")
		.update({
			title_template: params.titleTemplate,
			body_template: params.bodyTemplate,
			action_type: params.actionType,
			action_data: params.actionData as Json,
			priority: params.priority,
			is_active: params.isActive,
		})
		.eq("id", templateId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update notification template: ${error.message}`);
	}

	return data;
}

/**
 * 通知テンプレートを削除
 */
export async function deleteNotificationTemplate(templateId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_notifications")
		.from("templates")
		.delete()
		.eq("id", templateId);

	if (error) {
		throw new Error(`Failed to delete notification template: ${error.message}`);
	}
}
