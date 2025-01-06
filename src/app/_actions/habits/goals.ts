"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Goal = Database["ff_habits"]["Tables"]["user_goals"]["Row"];
type GoalMilestone = Database["ff_habits"]["Tables"]["goal_milestones"]["Row"];
type GoalReflection =
	Database["ff_habits"]["Tables"]["goal_reflections"]["Row"];
type GoalHabit = Database["ff_habits"]["Tables"]["goal_habits"]["Row"];
type GoalTemplate = Database["ff_habits"]["Tables"]["goal_templates"]["Row"];

/**
 * ゴールを作成
 * @param params.templateId - テンプレートID（オプション）
 * @param params.title - ゴールのタイトル
 * @param params.description - ゴールの説明
 * @param params.categoryId - カテゴリーID
 * @param params.priority - 優先度
 * @param params.startDate - 開始予定日
 * @param params.targetDate - 目標達成予定日
 * @param params.relatedSkills - 関連するスキル
 * @param params.metricId - メトリクス定義ID
 * @param params.metricTargetValue - 目標値
 * @param params.visibility - 公開設定
 * @param params.tags - タグ
 * @returns 作成されたゴール
 */
export async function createGoal(params: {
	templateId?: string;
	title: string;
	description?: string;
	categoryId: string;
	priority?: "high" | "medium" | "low";
	startDate?: string;
	targetDate?: string;
	relatedSkills?: string[];
	metricId?: string;
	metricTargetValue?: number;
	visibility?: "public" | "followers" | "private";
	tags?: string[];
}): Promise<Goal> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user?.id) {
		throw new Error("User not authenticated");
	}

	const { data: goal, error } = await supabase
		.schema("ff_habits")
		.from("user_goals")
		.insert({
			user_id: user.id,
			template_id: params.templateId,
			title: params.title,
			description: params.description,
			category_id: params.categoryId,
			priority: params.priority ?? "medium",
			start_date: params.startDate,
			target_date: params.targetDate,
			related_skills: params.relatedSkills,
			metric_id: params.metricId,
			metric_target_value: params.metricTargetValue,
			visibility: params.visibility ?? "private",
			tags: params.tags,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create goal: ${error.message}`);
	}

	return goal;
}

/**
 * ゴールを更新
 * @param params.goalId - ゴールID
 * @param params.title - ゴールのタイトル
 * @param params.description - ゴールの説明
 * @param params.categoryId - カテゴリーID
 * @param params.priority - 優先度
 * @param params.status - 状態
 * @param params.progress - 進捗率
 * @param params.startDate - 開始予定日
 * @param params.targetDate - 目標達成予定日
 * @param params.completedAt - 完了日
 * @param params.relatedSkills - 関連するスキル
 * @param params.metricId - メトリクス定義ID
 * @param params.metricTargetValue - 目標値
 * @param params.metricCurrentValue - 現在値
 * @param params.visibility - 公開設定
 * @param params.tags - タグ
 * @returns 更新されたゴール
 */
export async function updateGoal(params: {
	goalId: string;
	title?: string;
	description?: string;
	categoryId?: string;
	priority?: "high" | "medium" | "low";
	status?: "active" | "completed" | "paused" | "cancelled";
	progress?: number;
	startDate?: string;
	targetDate?: string;
	completedAt?: string;
	relatedSkills?: string[];
	metricId?: string;
	metricTargetValue?: number;
	metricCurrentValue?: number;
	visibility?: "public" | "followers" | "private";
	tags?: string[];
}): Promise<Goal> {
	const supabase = await createClient();

	const { data: goal, error } = await supabase
		.schema("ff_habits")
		.from("user_goals")
		.update({
			title: params.title,
			description: params.description,
			category_id: params.categoryId,
			priority: params.priority,
			status: params.status,
			progress: params.progress,
			start_date: params.startDate,
			target_date: params.targetDate,
			completed_at: params.completedAt,
			related_skills: params.relatedSkills,
			metric_id: params.metricId,
			metric_target_value: params.metricTargetValue,
			metric_current_value: params.metricCurrentValue,
			visibility: params.visibility,
			tags: params.tags,
		})
		.eq("id", params.goalId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update goal: ${error.message}`);
	}

	return goal;
}

/**
 * ゴールを取得
 * @param params.goalId - ゴールID
 * @returns ゴール情報
 */
export async function getGoal(params: { goalId: string }): Promise<Goal> {
	const supabase = await createClient();

	const { data: goal, error } = await supabase
		.schema("ff_habits")
		.from("user_goals")
		.select("*")
		.eq("id", params.goalId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch goal: ${error.message}`);
	}

	return goal;
}

/**
 * ユーザーのゴール一覧を取得
 * @param params.userId - ユーザーID
 * @param params.status - ステータスでフィルター
 * @param params.categoryId - カテゴリーでフィルター
 * @param params.limit - 取得する最大件数
 * @param params.offset - 取得開始位置
 * @returns ゴール情報の配列
 */
export async function getUserGoals(params: {
	userId: string;
	status?: "active" | "completed" | "paused" | "cancelled";
	categoryId?: string;
	limit?: number;
	offset?: number;
}): Promise<Goal[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_habits")
		.from("user_goals")
		.select("*")
		.eq("user_id", params.userId);

	if (params.status) {
		query = query.eq("status", params.status);
	}

	if (params.categoryId) {
		query = query.eq("category_id", params.categoryId);
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

	const { data: goals, error } = await query.order("created_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to fetch user goals: ${error.message}`);
	}

	return goals;
}

/**
 * マイルストーンを作成
 * @param params.goalId - ゴールID
 * @param params.title - マイルストーンのタイトル
 * @param params.description - マイルストーンの説明
 * @param params.dueDate - 期限
 * @param params.orderIndex - 表示順序
 * @returns 作成されたマイルストーン
 */
export async function createMilestone(params: {
	goalId: string;
	title: string;
	description?: string;
	dueDate?: string;
	orderIndex: number;
}): Promise<GoalMilestone> {
	const supabase = await createClient();

	const { data: milestone, error } = await supabase
		.schema("ff_habits")
		.from("goal_milestones")
		.insert({
			goal_id: params.goalId,
			title: params.title,
			description: params.description,
			due_date: params.dueDate,
			order_index: params.orderIndex,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create milestone: ${error.message}`);
	}

	return milestone;
}

/**
 * マイルストーンを更新
 * @param params.milestoneId - マイルストーンID
 * @param params.title - マイルストーンのタイトル
 * @param params.description - マイルストーンの説明
 * @param params.dueDate - 期限
 * @param params.status - 状態
 * @param params.completionDate - 完了日
 * @param params.orderIndex - 表示順序
 * @returns 更新されたマイルストーン
 */
export async function updateMilestone(params: {
	milestoneId: string;
	title?: string;
	description?: string;
	dueDate?: string;
	status?: "not_started" | "in_progress" | "completed";
	completionDate?: string;
	orderIndex?: number;
}): Promise<GoalMilestone> {
	const supabase = await createClient();

	const { data: milestone, error } = await supabase
		.schema("ff_habits")
		.from("goal_milestones")
		.update({
			title: params.title,
			description: params.description,
			due_date: params.dueDate,
			status: params.status,
			completion_date: params.completionDate,
			order_index: params.orderIndex,
		})
		.eq("id", params.milestoneId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update milestone: ${error.message}`);
	}

	return milestone;
}

/**
 * ゴールのマイルストーン一覧を取得
 * @param params.goalId - ゴールID
 * @returns マイルストーン情報の配列
 */
export async function getGoalMilestones(params: {
	goalId: string;
}): Promise<GoalMilestone[]> {
	const supabase = await createClient();

	const { data: milestones, error } = await supabase
		.schema("ff_habits")
		.from("goal_milestones")
		.select("*")
		.eq("goal_id", params.goalId)
		.order("order_index", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch goal milestones: ${error.message}`);
	}

	return milestones;
}

/**
 * ゴールの振り返りを作成
 * @param params.goalId - ゴールID
 * @param params.noteId - ノートID
 * @param params.reflectionType - 振り返りタイプ
 * @param params.milestoneId - マイルストーンID（オプション）
 * @param params.periodStart - 期間開始日
 * @param params.periodEnd - 期間終了日
 * @returns 作成された振り返り
 */
export async function createGoalReflection(params: {
	goalId: string;
	noteId: string;
	reflectionType: "weekly" | "monthly" | "milestone" | "completion";
	milestoneId?: string;
	periodStart: string;
	periodEnd: string;
}): Promise<GoalReflection> {
	const supabase = await createClient();

	const { data: reflection, error } = await supabase
		.schema("ff_habits")
		.from("goal_reflections")
		.insert({
			goal_id: params.goalId,
			note_id: params.noteId,
			reflection_type: params.reflectionType,
			milestone_id: params.milestoneId,
			period_start: params.periodStart,
			period_end: params.periodEnd,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create goal reflection: ${error.message}`);
	}

	return reflection;
}

/**
 * ゴールの振り返り一覧を取得
 * @param params.goalId - ゴールID
 * @param params.reflectionType - 振り返りタイプでフィルター
 * @returns 振り返り情報の配列
 */
export async function getGoalReflections(params: {
	goalId: string;
	reflectionType?: "weekly" | "monthly" | "milestone" | "completion";
}): Promise<GoalReflection[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_habits")
		.from("goal_reflections")
		.select("*")
		.eq("goal_id", params.goalId);

	if (params.reflectionType) {
		query = query.eq("reflection_type", params.reflectionType);
	}

	const { data: reflections, error } = await query.order("period_start", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to fetch goal reflections: ${error.message}`);
	}

	return reflections;
}

/**
 * ゴールと習慣を関連付け
 * @param params.goalId - ゴールID
 * @param params.habitId - 習慣ID
 * @param params.relationshipType - 関連タイプ
 * @param params.aiSuggestionId - AI提案ID（オプション）
 * @returns 作成された関連付け
 */
export async function linkGoalHabit(params: {
	goalId: string;
	habitId: string;
	relationshipType: "primary" | "secondary";
	aiSuggestionId?: string;
}): Promise<GoalHabit> {
	const supabase = await createClient();

	const { data: goalHabit, error } = await supabase
		.schema("ff_habits")
		.from("goal_habits")
		.insert({
			goal_id: params.goalId,
			habit_id: params.habitId,
			relationship_type: params.relationshipType,
			ai_suggestion_id: params.aiSuggestionId,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to link goal and habit: ${error.message}`);
	}

	return goalHabit;
}

/**
 * ゴールと習慣の関連付けを解除
 * @param params.goalId - ゴールID
 * @param params.habitId - 習慣ID
 */
export async function unlinkGoalHabit(params: {
	goalId: string;
	habitId: string;
}): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_habits")
		.from("goal_habits")
		.delete()
		.eq("goal_id", params.goalId)
		.eq("habit_id", params.habitId);

	if (error) {
		throw new Error(`Failed to unlink goal and habit: ${error.message}`);
	}
}

/**
 * ゴールに関連付けられた習慣一覧を取得
 * @param params.goalId - ゴールID
 * @param params.relationshipType - 関連タイプでフィルター
 * @returns 関連付け情報の配列
 */
export async function getGoalHabits(params: {
	goalId: string;
	relationshipType?: "primary" | "secondary";
}): Promise<GoalHabit[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_habits")
		.from("goal_habits")
		.select("*")
		.eq("goal_id", params.goalId);

	if (params.relationshipType) {
		query = query.eq("relationship_type", params.relationshipType);
	}

	const { data: goalHabits, error } = await query;

	if (error) {
		throw new Error(`Failed to fetch goal habits: ${error.message}`);
	}

	return goalHabits;
}
