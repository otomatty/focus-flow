"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type SkillCategory = Database["ff_skills"]["Tables"]["skill_categories"]["Row"];
type UserSkill = Database["ff_skills"]["Tables"]["user_skills"]["Row"];

interface SkillCategoryWithStats extends SkillCategory {
	userSkill?: UserSkill;
	childCategories?: SkillCategory[];
}

/**
 * メインカテゴリ一覧を取得
 */
export async function getMainCategories(): Promise<SkillCategory[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("skill_categories")
		.select("*")
		.is("parent_id", null)
		.eq("is_active", true)
		.order("name", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch main categories: ${error.message}`);
	}

	return data;
}

/**
 * サブカテゴリ一覧を取得
 */
export async function getSubCategories(
	parentId: string,
): Promise<SkillCategory[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("skill_categories")
		.select("*")
		.eq("parent_id", parentId)
		.eq("is_active", true)
		.order("name", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch sub categories: ${error.message}`);
	}

	return data;
}

/**
 * カテゴリの詳細を取得（サブカテゴリ含む）
 */
export async function getCategoryDetails(
	categoryId: string,
	userId?: string,
): Promise<SkillCategoryWithStats> {
	const supabase = await createClient();

	// カテゴリ情報を取得
	const { data: category, error: categoryError } = await supabase
		.schema("ff_skills")
		.from("skill_categories")
		.select("*")
		.eq("id", categoryId)
		.single();

	if (categoryError) {
		throw new Error(`Failed to fetch category: ${categoryError.message}`);
	}

	// サブカテゴリを取得
	const { data: childCategories, error: childError } = await supabase
		.schema("ff_skills")
		.from("skill_categories")
		.select("*")
		.eq("parent_id", categoryId)
		.eq("is_active", true)
		.order("name", { ascending: true });

	if (childError) {
		throw new Error(`Failed to fetch child categories: ${childError.message}`);
	}

	// ユーザーのスキル情報を取得（ユーザーIDが指定されている場合）
	let userSkill: UserSkill | undefined;
	if (userId) {
		const { data: skill, error: skillError } = await supabase
			.schema("ff_skills")
			.from("user_skills")
			.select("*")
			.eq("category_id", categoryId)
			.eq("user_id", userId)
			.single();

		if (skillError && skillError.code !== "PGRST116") {
			throw new Error(`Failed to fetch user skill: ${skillError.message}`);
		}

		userSkill = skill || undefined;
	}

	return {
		...category,
		childCategories: childCategories,
		userSkill,
	};
}

/**
 * カテゴリをスラッグで検索
 */
export async function getCategoryBySlug(
	slug: string,
	userId?: string,
): Promise<SkillCategoryWithStats> {
	const supabase = await createClient();

	// カテゴリ情報を取得
	const { data: category, error: categoryError } = await supabase
		.schema("ff_skills")
		.from("skill_categories")
		.select("*")
		.eq("slug", slug)
		.single();

	if (categoryError) {
		throw new Error(`Failed to fetch category: ${categoryError.message}`);
	}

	// サブカテゴリを取得
	const { data: childCategories, error: childError } = await supabase
		.schema("ff_skills")
		.from("skill_categories")
		.select("*")
		.eq("parent_id", category.id)
		.eq("is_active", true)
		.order("name", { ascending: true });

	if (childError) {
		throw new Error(`Failed to fetch child categories: ${childError.message}`);
	}

	// ユーザーのスキル情報を取得（ユーザーIDが指定されている場合）
	let userSkill: UserSkill | undefined;
	if (userId) {
		const { data: skill, error: skillError } = await supabase
			.schema("ff_skills")
			.from("user_skills")
			.select("*")
			.eq("category_id", category.id)
			.eq("user_id", userId)
			.single();

		if (skillError && skillError.code !== "PGRST116") {
			throw new Error(`Failed to fetch user skill: ${skillError.message}`);
		}

		userSkill = skill || undefined;
	}

	return {
		...category,
		childCategories: childCategories,
		userSkill,
	};
}

/**
 * ユーザーのスキル一覧を取得
 */
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("user_skills")
		.select("*")
		.eq("user_id", userId)
		.order("total_exp", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch user skills: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーのスキル情報を更新
 */
export async function updateUserSkill(
	userId: string,
	categoryId: string,
	params: {
		rankId?: string;
		totalExp?: number;
		achievements?: Record<string, boolean | number | string>;
		stats?: {
			completed_tasks?: number;
			perfect_tasks?: number;
			consecutive_days?: number;
			max_consecutive_days?: number;
			total_focus_time?: number;
			collaboration_count?: number;
			teaching_count?: number;
		};
	},
): Promise<UserSkill> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("user_skills")
		.upsert({
			user_id: userId,
			category_id: categoryId,
			rank_id: params.rankId ?? "00000000-0000-0000-0000-000000000001",
			total_exp: params.totalExp ?? 0,
			achievements: params.achievements,
			stats: params.stats,
			last_gained_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update user skill: ${error.message}`);
	}

	return data;
}
