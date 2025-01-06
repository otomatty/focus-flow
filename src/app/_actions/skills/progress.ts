"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

type UserLearningProgress =
	Database["ff_skills"]["Tables"]["user_learning_progress"]["Row"];

interface ProgressData {
	completion_percentage: number;
	last_accessed: string | null;
	time_spent_minutes: number;
	completed_sections: string[];
	notes: Array<{
		content: string;
		created_at: string;
		section?: string;
	}>;
	bookmarks: Array<{
		position: string;
		title: string;
		created_at: string;
	}>;
}

/**
 * 学習進捗を取得
 */
export async function getLearningProgress(
	userId: string,
	resourceId: string,
): Promise<UserLearningProgress | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("user_learning_progress")
		.select("*")
		.eq("user_id", userId)
		.eq("resource_id", resourceId)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(`Failed to fetch learning progress: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーの全学習進捗を取得
 */
export async function getUserLearningProgress(
	userId: string,
	params?: {
		status?: string;
		limit?: number;
		orderBy?: "started_at" | "completed_at" | "updated_at";
		ascending?: boolean;
	},
): Promise<UserLearningProgress[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_skills")
		.from("user_learning_progress")
		.select("*")
		.eq("user_id", userId);

	if (params?.status) {
		query = query.eq("status", params.status);
	}

	if (params?.orderBy) {
		query = query.order(params.orderBy, {
			ascending: params.ascending ?? false,
		});
	} else {
		query = query.order("updated_at", { ascending: false });
	}

	if (params?.limit) {
		query = query.limit(params.limit);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(`Failed to fetch user learning progress: ${error.message}`);
	}

	return data;
}

/**
 * 学習進捗を更新
 */
export async function updateLearningProgress(params: {
	userId: string;
	resourceId: string;
	status: "not_started" | "in_progress" | "completed" | "on_hold";
	progressData: Partial<ProgressData>;
}): Promise<UserLearningProgress> {
	const supabase = await createClient();

	const now = new Date().toISOString();
	const updates: Partial<UserLearningProgress> = {
		status: params.status,
		updated_at: now,
	};

	// ステータスに応じて開始日時・完了日時を設定
	if (params.status === "in_progress") {
		updates.started_at = updates.started_at ?? now;
	} else if (params.status === "completed") {
		updates.completed_at = now;
	}

	// 既存の進捗データを取得してマージ
	const { data: existing } = await supabase
		.schema("ff_skills")
		.from("user_learning_progress")
		.select("progress_data")
		.eq("user_id", params.userId)
		.eq("resource_id", params.resourceId)
		.single();

	const mergedProgressData = {
		...(existing?.progress_data as unknown as ProgressData),
		...params.progressData,
		last_accessed: now,
	};

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("user_learning_progress")
		.upsert({
			user_id: params.userId,
			resource_id: params.resourceId,
			status: params.status,
			...updates,
			progress_data: mergedProgressData as unknown as Json,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update learning progress: ${error.message}`);
	}

	return data;
}

/**
 * 学習ノートを追加
 */
export async function addLearningNote(params: {
	userId: string;
	resourceId: string;
	content: string;
	section?: string;
}): Promise<UserLearningProgress> {
	const supabase = await createClient();

	// 既存の進捗データを取得
	const { data: existing } = await supabase
		.schema("ff_skills")
		.from("user_learning_progress")
		.select("progress_data")
		.eq("user_id", params.userId)
		.eq("resource_id", params.resourceId)
		.single();

	const progressData = existing?.progress_data as unknown as ProgressData;
	const notes = progressData?.notes ?? [];

	// 新しいノートを追加
	const newNote = {
		content: params.content,
		section: params.section,
		created_at: new Date().toISOString(),
	};

	const updatedNotes = [...notes, newNote];

	return updateLearningProgress({
		userId: params.userId,
		resourceId: params.resourceId,
		status: "in_progress",
		progressData: {
			...progressData,
			notes: updatedNotes,
		},
	});
}

/**
 * ブックマークを追加
 */
export async function addBookmark(params: {
	userId: string;
	resourceId: string;
	position: string;
	title: string;
}): Promise<UserLearningProgress> {
	const supabase = await createClient();

	// 既存の進捗データを取得
	const { data: existing } = await supabase
		.schema("ff_skills")
		.from("user_learning_progress")
		.select("progress_data")
		.eq("user_id", params.userId)
		.eq("resource_id", params.resourceId)
		.single();

	const progressData = existing?.progress_data as unknown as ProgressData;
	const bookmarks = progressData?.bookmarks ?? [];

	// 新しいブックマークを追加
	const newBookmark = {
		position: params.position,
		title: params.title,
		created_at: new Date().toISOString(),
	};

	const updatedBookmarks = [...bookmarks, newBookmark];

	return updateLearningProgress({
		userId: params.userId,
		resourceId: params.resourceId,
		status: "in_progress",
		progressData: {
			...progressData,
			bookmarks: updatedBookmarks,
		},
	});
}

/**
 * 完了したセクションを更新
 */
export async function updateCompletedSections(params: {
	userId: string;
	resourceId: string;
	completedSections: string[];
	totalSections: number;
}): Promise<UserLearningProgress> {
	const supabase = await createClient();

	// 既存の進捗データを取得
	const { data: existing } = await supabase
		.schema("ff_skills")
		.from("user_learning_progress")
		.select("progress_data")
		.eq("user_id", params.userId)
		.eq("resource_id", params.resourceId)
		.single();

	const progressData = existing?.progress_data as unknown as ProgressData;

	// 進捗率を計算
	const completionPercentage = Math.round(
		(params.completedSections.length / params.totalSections) * 100,
	);

	return updateLearningProgress({
		userId: params.userId,
		resourceId: params.resourceId,
		status: completionPercentage === 100 ? "completed" : "in_progress",
		progressData: {
			...progressData,
			completed_sections: params.completedSections,
			completion_percentage: completionPercentage,
		},
	});
}

/**
 * 学習時間を更新
 */
export async function updateTimeSpent(params: {
	userId: string;
	resourceId: string;
	additionalMinutes: number;
}): Promise<UserLearningProgress> {
	const supabase = await createClient();

	// 既存の進捗データを取得
	const { data: existing } = await supabase
		.schema("ff_skills")
		.from("user_learning_progress")
		.select("progress_data")
		.eq("user_id", params.userId)
		.eq("resource_id", params.resourceId)
		.single();

	const progressData = existing?.progress_data as unknown as ProgressData;

	return updateLearningProgress({
		userId: params.userId,
		resourceId: params.resourceId,
		status: "in_progress",
		progressData: {
			...progressData,
			time_spent_minutes:
				(progressData?.time_spent_minutes ?? 0) + params.additionalMinutes,
		},
	});
}
