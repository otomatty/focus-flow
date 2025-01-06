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

type LearningPath = Database["ff_skills"]["Tables"]["learning_paths"]["Row"];
type LearningPathResource =
	Database["ff_skills"]["Tables"]["learning_path_resources"]["Row"];
type UserLearningPath =
	Database["ff_skills"]["Tables"]["user_learning_paths"]["Row"];

interface PathData {
	prerequisites: string[];
	learning_objectives: string[];
	skills_covered: string[];
	career_paths: string[];
	certification_preparation: string | null;
}

interface ResourceData {
	notes: string | null;
	estimated_duration: string | null;
	dependencies: string[];
}

interface ProgressData {
	completion_percentage: number;
	completed_resources: string[];
	current_resource: string | null;
	notes: Array<{
		content: string;
		created_at: string;
		resource_id?: string;
	}>;
	time_spent_minutes: number;
}

/**
 * 学習パスを作成
 */
export async function createLearningPath(params: {
	name: string;
	description?: string;
	creatorId: string;
	targetLevel: "beginner" | "intermediate" | "advanced" | "expert";
	estimatedDuration?: string;
	pathData: Partial<PathData>;
	isPublic?: boolean;
	isOfficial?: boolean;
}): Promise<LearningPath> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_paths")
		.insert({
			name: params.name,
			description: params.description,
			creator_id: params.creatorId,
			target_level: params.targetLevel,
			estimated_duration: params.estimatedDuration,
			path_data: params.pathData as unknown as Json,
			is_public: params.isPublic ?? true,
			is_official: params.isOfficial ?? false,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create learning path: ${error.message}`);
	}

	return data;
}

/**
 * 学習パスを更新
 */
export async function updateLearningPath(params: {
	pathId: string;
	name?: string;
	description?: string;
	targetLevel?: "beginner" | "intermediate" | "advanced" | "expert";
	estimatedDuration?: string;
	pathData?: Partial<PathData>;
	isPublic?: boolean;
}): Promise<LearningPath> {
	const supabase = await createClient();

	const updates: Partial<LearningPath> = {
		updated_at: new Date().toISOString(),
	};

	if (params.name !== undefined) updates.name = params.name;
	if (params.description !== undefined)
		updates.description = params.description;
	if (params.targetLevel !== undefined)
		updates.target_level = params.targetLevel;
	if (params.estimatedDuration !== undefined)
		updates.estimated_duration = params.estimatedDuration;
	if (params.pathData !== undefined)
		updates.path_data = params.pathData as unknown as Json;
	if (params.isPublic !== undefined) updates.is_public = params.isPublic;

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_paths")
		.update(updates)
		.eq("id", params.pathId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update learning path: ${error.message}`);
	}

	return data;
}

/**
 * リソースを学習パスに追加
 */
export async function addResourceToPath(params: {
	pathId: string;
	resourceId: string;
	orderIndex: number;
	isRequired?: boolean;
	resourceData?: Partial<ResourceData>;
}): Promise<LearningPathResource> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_path_resources")
		.insert({
			path_id: params.pathId,
			resource_id: params.resourceId,
			order_index: params.orderIndex,
			is_required: params.isRequired ?? true,
			resource_data: params.resourceData as unknown as Json,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to add resource to path: ${error.message}`);
	}

	return data;
}

/**
 * 学習パスのリソース順序を更新
 */
export async function updateResourceOrder(params: {
	pathId: string;
	resourceOrders: Array<{ resourceId: string; orderIndex: number }>;
}): Promise<void> {
	const supabase = await createClient();

	const updates = params.resourceOrders.map((order) => ({
		path_id: params.pathId,
		resource_id: order.resourceId,
		order_index: order.orderIndex,
		updated_at: new Date().toISOString(),
	}));

	const { error } = await supabase
		.schema("ff_skills")
		.from("learning_path_resources")
		.upsert(updates);

	if (error) {
		throw new Error(`Failed to update resource order: ${error.message}`);
	}
}

/**
 * 学習パスのリソースを取得
 */
export async function getPathResources(
	pathId: string,
): Promise<LearningPathResource[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_path_resources")
		.select("*")
		.eq("path_id", pathId)
		.order("order_index");

	if (error) {
		throw new Error(`Failed to fetch path resources: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーの学習パス進捗を開始/更新
 */
export async function updateUserPathProgress(params: {
	userId: string;
	pathId: string;
	status: "not_started" | "in_progress" | "completed" | "on_hold";
	progressData: Partial<ProgressData>;
}): Promise<UserLearningPath> {
	const supabase = await createClient();

	const now = new Date().toISOString();
	const updates: Partial<UserLearningPath> = {
		status: params.status,
		updated_at: now,
	};

	if (params.status === "in_progress") {
		updates.started_at = now;
	} else if (params.status === "completed") {
		updates.completed_at = now;
	}

	// 既存の進捗データを取得してマージ
	const { data: existing } = await supabase
		.schema("ff_skills")
		.from("user_learning_paths")
		.select("progress_data")
		.eq("user_id", params.userId)
		.eq("path_id", params.pathId)
		.single();

	const mergedProgressData = {
		...(existing?.progress_data as unknown as ProgressData),
		...params.progressData,
	};

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("user_learning_paths")
		.upsert({
			user_id: params.userId,
			path_id: params.pathId,
			status: params.status,
			started_at: updates.started_at,
			completed_at: updates.completed_at,
			updated_at: updates.updated_at,
			progress_data: mergedProgressData as unknown as Json,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update user path progress: ${error.message}`);
	}

	return data;
}

/**
 * 学習パスにいいねを追加/削除
 */
export async function updatePathLikes(
	pathId: string,
	increment: boolean,
): Promise<LearningPath> {
	const supabase = await createClient();

	// まず現在の値を取得
	const { data: current } = await supabase
		.schema("ff_skills")
		.from("learning_paths")
		.select("likes_count")
		.eq("id", pathId)
		.single();

	const newCount = increment
		? (current?.likes_count ?? 0) + 1
		: Math.max((current?.likes_count ?? 0) - 1, 0);

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_paths")
		.update({ likes_count: newCount })
		.eq("id", pathId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update path likes: ${error.message}`);
	}

	return data;
}

/**
 * 学習パスを検索
 */
export async function searchLearningPaths(params: {
	query?: string;
	targetLevel?: string;
	creatorId?: string;
	isOfficial?: boolean;
	isPublic?: boolean;
	limit?: number;
	offset?: number;
}): Promise<LearningPath[]> {
	const supabase = await createClient();

	let query = supabase.schema("ff_skills").from("learning_paths").select("*");

	if (params.query) {
		query = query.ilike("name", `%${params.query}%`);
	}

	if (params.targetLevel) {
		query = query.eq("target_level", params.targetLevel);
	}

	if (params.creatorId) {
		query = query.eq("creator_id", params.creatorId);
	}

	if (params.isOfficial !== undefined) {
		query = query.eq("is_official", params.isOfficial);
	}

	if (params.isPublic !== undefined) {
		query = query.eq("is_public", params.isPublic);
	}

	query = query.order("likes_count", { ascending: false });

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
		throw new Error(`Failed to search learning paths: ${error.message}`);
	}

	return data;
}
