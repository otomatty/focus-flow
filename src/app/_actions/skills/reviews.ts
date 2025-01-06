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

type LearningResourceReview =
	Database["ff_skills"]["Tables"]["learning_resource_reviews"]["Row"];

interface ReviewData {
	pros: string[];
	cons: string[];
	difficulty_rating: number | null;
	time_investment: number | null;
	effectiveness_rating: number | null;
	would_recommend: boolean | null;
}

/**
 * レビューを投稿
 */
export async function createReview(params: {
	userId: string;
	resourceId: string;
	rating: number;
	reviewText?: string;
	reviewData: Partial<ReviewData>;
	completionStatus?: "completed" | "partially_completed" | "dropped";
}): Promise<LearningResourceReview> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_resource_reviews")
		.upsert({
			user_id: params.userId,
			resource_id: params.resourceId,
			rating: params.rating,
			review_text: params.reviewText,
			review_data: params.reviewData as unknown as Json,
			completion_status: params.completionStatus,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create review: ${error.message}`);
	}

	return data;
}

/**
 * レビューを更新
 */
export async function updateReview(params: {
	reviewId: string;
	rating?: number;
	reviewText?: string;
	reviewData?: Partial<ReviewData>;
	completionStatus?: "completed" | "partially_completed" | "dropped";
}): Promise<LearningResourceReview> {
	const supabase = await createClient();

	const updates: Partial<LearningResourceReview> = {
		updated_at: new Date().toISOString(),
	};

	if (params.rating !== undefined) updates.rating = params.rating;
	if (params.reviewText !== undefined) updates.review_text = params.reviewText;
	if (params.reviewData !== undefined)
		updates.review_data = params.reviewData as unknown as Json;
	if (params.completionStatus !== undefined)
		updates.completion_status = params.completionStatus;

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_resource_reviews")
		.update(updates)
		.eq("id", params.reviewId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update review: ${error.message}`);
	}

	return data;
}

/**
 * レビューを取得
 */
export async function getReview(
	userId: string,
	resourceId: string,
): Promise<LearningResourceReview | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_resource_reviews")
		.select("*")
		.eq("user_id", userId)
		.eq("resource_id", resourceId)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(`Failed to fetch review: ${error.message}`);
	}

	return data;
}

/**
 * リソースの全レビューを取得
 */
export async function getResourceReviews(
	resourceId: string,
	params?: {
		limit?: number;
		offset?: number;
		orderBy?: "rating" | "helpful_count" | "created_at";
		ascending?: boolean;
		minRating?: number;
		completionStatus?: string;
	},
): Promise<LearningResourceReview[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_skills")
		.from("learning_resource_reviews")
		.select("*")
		.eq("resource_id", resourceId);

	if (params?.minRating) {
		query = query.gte("rating", params.minRating);
	}

	if (params?.completionStatus) {
		query = query.eq("completion_status", params.completionStatus);
	}

	if (params?.orderBy) {
		query = query.order(params.orderBy, {
			ascending: params.ascending ?? false,
		});
	} else {
		query = query.order("created_at", { ascending: false });
	}

	if (params?.limit) {
		query = query.limit(params.limit);
	}

	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(`Failed to fetch resource reviews: ${error.message}`);
	}

	return data;
}

/**
 * レビューの「参考になった」カウントを更新
 */
export async function updateHelpfulCount(
	reviewId: string,
	increment: boolean,
): Promise<LearningResourceReview> {
	const supabase = await createClient();

	// まず現在の値を取得
	const { data: current } = await supabase
		.schema("ff_skills")
		.from("learning_resource_reviews")
		.select("helpful_count")
		.eq("id", reviewId)
		.single();

	const newCount = increment
		? (current?.helpful_count ?? 0) + 1
		: Math.max((current?.helpful_count ?? 0) - 1, 0);

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("learning_resource_reviews")
		.update({ helpful_count: newCount })
		.eq("id", reviewId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update helpful count: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーの全レビューを取得
 */
export async function getUserReviews(
	userId: string,
	params?: {
		limit?: number;
		offset?: number;
		orderBy?: "rating" | "helpful_count" | "created_at";
		ascending?: boolean;
	},
): Promise<LearningResourceReview[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_skills")
		.from("learning_resource_reviews")
		.select("*")
		.eq("user_id", userId);

	if (params?.orderBy) {
		query = query.order(params.orderBy, {
			ascending: params.ascending ?? false,
		});
	} else {
		query = query.order("created_at", { ascending: false });
	}

	if (params?.limit) {
		query = query.limit(params.limit);
	}

	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(`Failed to fetch user reviews: ${error.message}`);
	}

	return data;
}
