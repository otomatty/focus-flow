"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Notification } from "@/types/notifications";

type DeliveryHistory =
	Database["ff_notifications"]["Tables"]["delivery_history"]["Row"];

/**
 * エラーメッセージを生成
 */
function createErrorMessage(operation: string, error: PostgrestError): string {
	const baseMessage = `Failed to ${operation}`;
	const details = [];

	if (error.code === "PGRST116") {
		details.push("Resource not found");
	} else if (error.code === "42P01") {
		details.push("Table or schema does not exist");
	} else if (error.code === "42501") {
		details.push("Insufficient permissions");
	}

	if (error.message) {
		details.push(error.message);
	}
	if (error.details) {
		details.push(error.details);
	}

	return `${baseMessage}: ${details.join(" - ")}`;
}

/**
 * 通知を作成
 */
export async function createNotification(params: {
	userId: string;
	categoryName: string;
	templateName: string;
	templateData: Record<string, string>;
}): Promise<Notification> {
	const supabase = await createClient();

	try {
		const { data: notificationId, error: createError } = await supabase
			.schema("ff_notifications")
			.rpc("create_notification", {
				p_user_id: params.userId,
				p_category_name: params.categoryName,
				p_template_name: params.templateName,
				p_template_data: params.templateData as Json,
			});

		if (createError) {
			throw new Error(createErrorMessage("create notification", createError));
		}

		const { data: notification, error: fetchError } = await supabase
			.schema("ff_notifications")
			.from("notifications")
			.select("*")
			.eq("id", notificationId)
			.single();

		if (fetchError) {
			throw new Error(
				createErrorMessage("fetch created notification", fetchError),
			);
		}

		return notification as Notification;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(`Unexpected error while creating notification: ${error}`);
	}
}

/**
 * ユーザーの通知一覧を取得
 */
export async function getUserNotifications(params: {
	userId: string;
	categoryId?: string;
	status?: "pending" | "sent" | "failed";
	limit?: number;
	offset?: number;
}): Promise<Notification[]> {
	const supabase = await createClient();

	try {
		let query = supabase
			.schema("ff_notifications")
			.from("notifications")
			.select("*")
			.eq("user_id", params.userId)
			.order("created_at", { ascending: false });

		if (params.categoryId) {
			query = query.eq("category_id", params.categoryId);
		}
		if (params.status) {
			query = query.eq("status", params.status);
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

		const { data, error } = await query;

		if (error) {
			throw new Error(createErrorMessage("fetch user notifications", error));
		}

		return data as Notification[];
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(`Unexpected error while fetching notifications: ${error}`);
	}
}

/**
 * 通知を既読にする
 */
export async function markNotificationAsRead(notificationId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_notifications")
		.from("notifications")
		.update({ read_at: new Date().toISOString() })
		.eq("id", notificationId);

	if (error) {
		throw new Error(`Failed to mark notification as read: ${error.message}`);
	}
}

/**
 * 通知の配信履歴を記録
 */
export async function createDeliveryHistory(params: {
	notificationId: string;
	deliveryType: "email" | "push" | "in_app";
	status: "success" | "failed";
	provider?: string;
	providerResponse?: Record<string, unknown>;
	errorMessage?: string;
}): Promise<DeliveryHistory> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("delivery_history")
		.insert({
			notification_id: params.notificationId,
			delivery_type: params.deliveryType,
			status: params.status,
			provider: params.provider,
			provider_response: params.providerResponse as Json,
			error_message: params.errorMessage,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create delivery history: ${error.message}`);
	}

	return data;
}

/**
 * 通知の配信履歴を取得
 */
export async function getDeliveryHistory(params: {
	notificationId: string;
}): Promise<DeliveryHistory[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_notifications")
		.from("delivery_history")
		.select("*")
		.eq("notification_id", params.notificationId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch delivery history: ${error.message}`);
	}

	return data;
}

/**
 * 通知ステータスを更新
 */
export async function updateNotificationStatus(
	notificationId: string,
	status: "pending" | "sent" | "failed",
) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_notifications")
		.from("notifications")
		.update({ status })
		.eq("id", notificationId);

	if (error) {
		throw new Error(`Failed to update notification status: ${error.message}`);
	}
}

/**
 * 期限切れの通知を削除
 */
export async function deleteExpiredNotifications() {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_notifications")
		.from("notifications")
		.delete()
		.lt("expires_at", new Date().toISOString());

	if (error) {
		throw new Error(`Failed to delete expired notifications: ${error.message}`);
	}
}
