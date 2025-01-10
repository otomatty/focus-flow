"use server";

import {
	getNotificationCategories,
	createNotificationCategory,
	updateNotificationCategory,
} from "./categories";
import {
	getNotificationTemplates,
	createNotificationTemplate,
	updateNotificationTemplate,
} from "./templates";
import {
	createNotification,
	sendNotificationToUsers,
	sendNotificationWithFilters,
	sendNotificationToAllUsers,
} from "./index";

// カテゴリ関連のクエリ
export async function fetchCategories(params?: { isActive?: boolean }) {
	return getNotificationCategories(params);
}

export async function createCategory(params: {
	name: string;
	displayName: string;
	description?: string;
	icon?: string;
	color?: string;
	priority?: number;
	isActive?: boolean;
}) {
	return createNotificationCategory(params);
}

export async function updateCategory(
	categoryId: string,
	params: { isActive: boolean },
) {
	return updateNotificationCategory(categoryId, params);
}

// テンプレート関連のクエリ
export async function fetchTemplates(params?: {
	categoryId?: string;
	isActive?: boolean;
}) {
	return getNotificationTemplates(params);
}

export async function createTemplate(params: {
	categoryId: string;
	name: string;
	titleTemplate: string;
	bodyTemplate: string;
	actionType?: string;
	actionData?: Record<string, unknown>;
	priority?: number;
	isActive?: boolean;
}) {
	return createNotificationTemplate(params);
}

export async function updateTemplate(
	templateId: string,
	params: { isActive: boolean },
) {
	return updateNotificationTemplate(templateId, params);
}

// 通知関連のクエリ
export async function sendNotification(params: {
	userId: string;
	categoryName: string;
	templateName: string;
	templateData: Record<string, string>;
}) {
	return createNotification(params);
}

export async function sendBulkNotification(params: {
	userIds: string[];
	categoryName: string;
	templateName: string;
	templateData: Record<string, string>;
}) {
	return sendNotificationToUsers(params);
}

export async function sendFilteredNotification(params: {
	filters: {
		roles?: string[];
		lastActiveAfter?: Date;
		lastActiveBefore?: Date;
		createdAfter?: Date;
		createdBefore?: Date;
		hasCompletedOnboarding?: boolean;
	};
	categoryName: string;
	templateName: string;
	templateData: Record<string, string>;
}) {
	return sendNotificationWithFilters(params);
}

export async function sendNotificationToAll(params: {
	categoryName: string;
	templateName: string;
	templateData: Record<string, string>;
}) {
	return sendNotificationToAllUsers(params);
}
