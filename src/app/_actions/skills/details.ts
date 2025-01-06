"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type SkillDetail = Database["ff_skills"]["Tables"]["skill_details"]["Row"];

interface SkillDetailWithRelations extends SkillDetail {
	prerequisites_details?: SkillDetail[];
	related_skills_details?: SkillDetail[];
}

/**
 * スキル詳細を取得
 */
export async function getSkillDetail(
	skillId: string,
): Promise<SkillDetailWithRelations | null> {
	const supabase = await createClient();

	const { data: skill, error } = await supabase
		.schema("ff_skills")
		.from("skill_details")
		.select("*")
		.eq("id", skillId)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(`Failed to fetch skill detail: ${error.message}`);
	}

	// 前提スキルと関連スキルの詳細を取得
	const prerequisites = skill.prerequisites as string[];
	const relatedSkills = skill.related_skills as string[];

	const [prerequisitesData, relatedData] = await Promise.all([
		getSkillsByIds(prerequisites),
		getSkillsByIds(relatedSkills),
	]);

	return {
		...skill,
		prerequisites_details: prerequisitesData,
		related_skills_details: relatedData,
	};
}

/**
 * スラッグでスキル詳細を取得
 */
export async function getSkillDetailBySlug(
	slug: string,
): Promise<SkillDetailWithRelations | null> {
	const supabase = await createClient();

	const { data: skill, error } = await supabase
		.schema("ff_skills")
		.from("skill_details")
		.select("*")
		.eq("slug", slug)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(`Failed to fetch skill detail: ${error.message}`);
	}

	// 前提スキルと関連スキルの詳細を取得
	const prerequisites = skill.prerequisites as string[];
	const relatedSkills = skill.related_skills as string[];

	const [prerequisitesData, relatedData] = await Promise.all([
		getSkillsByIds(prerequisites),
		getSkillsByIds(relatedSkills),
	]);

	return {
		...skill,
		prerequisites_details: prerequisitesData,
		related_skills_details: relatedData,
	};
}

/**
 * カテゴリーに属するスキル一覧を取得
 */
export async function getSkillsByCategory(
	categoryId: string,
	params?: {
		difficulty?: string;
		isActive?: boolean;
	},
): Promise<SkillDetail[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_skills")
		.from("skill_details")
		.select("*")
		.eq("category_id", categoryId);

	if (params?.difficulty) {
		query = query.eq("difficulty_level", params.difficulty);
	}

	if (params?.isActive !== undefined) {
		query = query.eq("is_active", params.isActive);
	}

	const { data, error } = await query.order("name");

	if (error) {
		throw new Error(`Failed to fetch skills by category: ${error.message}`);
	}

	return data;
}

/**
 * スキルを検索
 */
export async function searchSkills(params: {
	query: string;
	categoryId?: string;
	difficulty?: string;
	isActive?: boolean;
}): Promise<SkillDetail[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_skills")
		.from("skill_details")
		.select("*")
		.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%`);

	if (params.categoryId) {
		query = query.eq("category_id", params.categoryId);
	}

	if (params.difficulty) {
		query = query.eq("difficulty_level", params.difficulty);
	}

	if (params.isActive !== undefined) {
		query = query.eq("is_active", params.isActive);
	}

	const { data, error } = await query.order("name").limit(20);

	if (error) {
		throw new Error(`Failed to search skills: ${error.message}`);
	}

	return data;
}

/**
 * 複数のスキルをIDで取得（内部用）
 */
async function getSkillsByIds(skillIds: string[]): Promise<SkillDetail[]> {
	if (!skillIds.length) return [];

	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_skills")
		.from("skill_details")
		.select("*")
		.in("id", skillIds);

	if (error) {
		throw new Error(`Failed to fetch skills by ids: ${error.message}`);
	}

	return data;
}
