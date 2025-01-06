"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { Json } from "@/types/supabase";

type Habit = Database["ff_habits"]["Tables"]["user_habits"]["Row"];
type HabitFrequency =
	Database["ff_habits"]["Tables"]["habit_frequencies"]["Row"];
type HabitCue = Database["ff_habits"]["Tables"]["habit_cues"]["Row"];
type HabitProgress = Database["ff_habits"]["Tables"]["habit_progress"]["Row"];
type HabitLog = Database["ff_habits"]["Tables"]["habit_logs"]["Row"];
type HabitReflection =
	Database["ff_habits"]["Tables"]["habit_reflections"]["Row"];
type HabitTemplate = Database["ff_habits"]["Tables"]["habit_templates"]["Row"];

/**
 * 習慣を作成
 * @param params.templateId - テンプレートID（オプション）
 * @param params.title - 具体的な最小行動
 * @param params.description - 個人的なメモや補足
 * @param params.categoryId - カテゴリID
 * @param params.identityStatement - アイデンティティステートメント
 * @param params.implementationIntention - 実装意図
 * @param params.stackAfterHabitId - 積み重ねる習慣のID
 * @param params.visibility - 公開設定
 * @returns 作成された習慣
 */
export async function createHabit(params: {
	templateId?: string;
	title: string;
	description?: string;
	categoryId: string;
	identityStatement?: string;
	implementationIntention?: string;
	stackAfterHabitId?: string;
	visibility?: "public" | "followers" | "private";
}): Promise<Habit> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user?.id) {
		throw new Error("User not authenticated");
	}

	const { data: habit, error } = await supabase
		.schema("ff_habits")
		.from("user_habits")
		.insert({
			user_id: user.id,
			template_id: params.templateId,
			title: params.title,
			description: params.description,
			category_id: params.categoryId,
			identity_statement: params.identityStatement,
			implementation_intention: params.implementationIntention,
			stack_after_habit_id: params.stackAfterHabitId,
			visibility: params.visibility ?? "private",
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create habit: ${error.message}`);
	}

	// 習慣の進捗レコードを作成
	const { error: progressError } = await supabase
		.schema("ff_habits")
		.from("habit_progress")
		.insert({
			habit_id: habit.id,
		});

	if (progressError) {
		throw new Error(
			`Failed to create habit progress: ${progressError.message}`,
		);
	}

	return habit;
}

/**
 * 習慣を更新
 * @param params.habitId - 習慣ID
 * @param params.title - 具体的な最小行動
 * @param params.description - 個人的なメモや補足
 * @param params.categoryId - カテゴリID
 * @param params.identityStatement - アイデンティティステートメント
 * @param params.implementationIntention - 実装意図
 * @param params.stackAfterHabitId - 積み重ねる習慣のID
 * @param params.status - 状態
 * @param params.visibility - 公開設定
 * @returns 更新された習慣
 */
export async function updateHabit(params: {
	habitId: string;
	title?: string;
	description?: string;
	categoryId?: string;
	identityStatement?: string;
	implementationIntention?: string;
	stackAfterHabitId?: string;
	status?: "active" | "completed" | "paused" | "archived";
	visibility?: "public" | "followers" | "private";
}): Promise<Habit> {
	const supabase = await createClient();

	const { data: habit, error } = await supabase
		.schema("ff_habits")
		.from("user_habits")
		.update({
			title: params.title,
			description: params.description,
			category_id: params.categoryId,
			identity_statement: params.identityStatement,
			implementation_intention: params.implementationIntention,
			stack_after_habit_id: params.stackAfterHabitId,
			status: params.status,
			visibility: params.visibility,
		})
		.eq("id", params.habitId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update habit: ${error.message}`);
	}

	return habit;
}

/**
 * 習慣の頻度設定を作成・更新
 * @param params.habitId - 習慣ID
 * @param params.type - 頻度タイプ
 * @param params.daysOfWeek - 曜日指定（weekly用）
 * @param params.daysOfMonth - 日付指定（monthly用）
 * @param params.customPattern - カスタムパターン（cron形式）
 * @param params.timeWindows - 時間帯設定
 * @param params.timezone - タイムゾーン
 * @param params.startDate - 開始日
 * @param params.endDate - 終了日
 * @returns 作成・更新された頻度設定
 */
export async function upsertHabitFrequency(params: {
	habitId: string;
	type: "daily" | "weekly" | "monthly" | "custom";
	daysOfWeek?: string[];
	daysOfMonth?: number[];
	customPattern?: string;
	timeWindows?: Json[];
	timezone?: string;
	startDate?: string;
	endDate?: string;
}): Promise<HabitFrequency> {
	const supabase = await createClient();

	const { data: frequency, error } = await supabase
		.schema("ff_habits")
		.from("habit_frequencies")
		.upsert(
			{
				habit_id: params.habitId,
				type: params.type,
				days_of_week: params.daysOfWeek,
				days_of_month: params.daysOfMonth,
				custom_pattern: params.customPattern,
				time_windows: params.timeWindows,
				timezone: params.timezone ?? "UTC",
				start_date: params.startDate,
				end_date: params.endDate,
			},
			{ onConflict: "habit_id" },
		)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to upsert habit frequency: ${error.message}`);
	}

	return frequency;
}

/**
 * きっかけ（cue）を作成
 * @param params.habitId - 習慣ID
 * @param params.type - きっかけタイプ
 * @param params.name - きっかけの名前
 * @param params.description - 詳細説明
 * @param params.conditions - きっかけの条件
 * @param params.priority - 優先度
 * @returns 作成されたきっかけ
 */
export async function createHabitCue(params: {
	habitId: string;
	type:
		| "time"
		| "location"
		| "preceding_action"
		| "emotional_state"
		| "context";
	name: string;
	description?: string;
	conditions: Json;
	priority?: number;
}): Promise<HabitCue> {
	const supabase = await createClient();

	const { data: cue, error } = await supabase
		.schema("ff_habits")
		.from("habit_cues")
		.insert({
			habit_id: params.habitId,
			type: params.type,
			name: params.name,
			description: params.description,
			conditions: params.conditions,
			priority: params.priority ?? 1,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create habit cue: ${error.message}`);
	}

	return cue;
}

/**
 * きっかけ（cue）を更新
 * @param params.cueId - きっかけID
 * @param params.name - きっかけの名前
 * @param params.description - 詳細説明
 * @param params.conditions - きっかけの条件
 * @param params.priority - 優先度
 * @param params.isActive - アクティブ状態
 * @param params.effectivenessScore - 有効性スコア
 * @returns 更新されたきっかけ
 */
export async function updateHabitCue(params: {
	cueId: string;
	name?: string;
	description?: string;
	conditions?: Json;
	priority?: number;
	isActive?: boolean;
	effectivenessScore?: number;
}): Promise<HabitCue> {
	const supabase = await createClient();

	const { data: cue, error } = await supabase
		.schema("ff_habits")
		.from("habit_cues")
		.update({
			name: params.name,
			description: params.description,
			conditions: params.conditions,
			priority: params.priority,
			is_active: params.isActive,
			effectiveness_score: params.effectivenessScore,
		})
		.eq("id", params.cueId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update habit cue: ${error.message}`);
	}

	return cue;
}

/**
 * 習慣の実施を記録
 * @param params.habitId - 習慣ID
 * @param params.qualityScore - 実施の質（1-5）
 * @returns 作成された実施記録
 */
export async function logHabitCompletion(params: {
	habitId: string;
	qualityScore?: number;
}): Promise<HabitLog> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user?.id) {
		throw new Error("User not authenticated");
	}

	const { data: log, error } = await supabase
		.schema("ff_habits")
		.from("habit_logs")
		.insert({
			habit_id: params.habitId,
			user_id: user.id,
			quality_score: params.qualityScore,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to log habit completion: ${error.message}`);
	}

	return log;
}

/**
 * 習慣の振り返りを記録
 * @param params.habitId - 習慣ID
 * @param params.weekStartDate - 振り返り対象週の開始日
 * @param params.scores - 振り返りスコア
 * @returns 作成された振り返り
 */
export async function createHabitReflection(params: {
	habitId: string;
	weekStartDate: string;
	scores: {
		identityAlignment?: number;
		difficulty?: number;
		satisfaction?: number;
		motivation?: number;
	};
}): Promise<HabitReflection> {
	const supabase = await createClient();

	const { data: reflection, error } = await supabase
		.schema("ff_habits")
		.from("habit_reflections")
		.insert({
			habit_id: params.habitId,
			week_start_date: params.weekStartDate,
			scores: params.scores,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create habit reflection: ${error.message}`);
	}

	return reflection;
}

/**
 * 習慣の進捗を取得
 * @param params.habitId - 習慣ID
 * @returns 習慣の進捗情報
 */
export async function getHabitProgress(params: {
	habitId: string;
}): Promise<HabitProgress> {
	const supabase = await createClient();

	const { data: progress, error } = await supabase
		.schema("ff_habits")
		.from("habit_progress")
		.select("*")
		.eq("habit_id", params.habitId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch habit progress: ${error.message}`);
	}

	return progress;
}

/**
 * 習慣の実施記録を取得
 * @param params.habitId - 習慣ID
 * @param params.startDate - 開始日
 * @param params.endDate - 終了日
 * @returns 実施記録の配列
 */
export async function getHabitLogs(params: {
	habitId: string;
	startDate?: string;
	endDate?: string;
}): Promise<HabitLog[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_habits")
		.from("habit_logs")
		.select("*")
		.eq("habit_id", params.habitId);

	if (params.startDate) {
		query = query.gte("completed_at", params.startDate);
	}

	if (params.endDate) {
		query = query.lte("completed_at", params.endDate);
	}

	const { data: logs, error } = await query.order("completed_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to fetch habit logs: ${error.message}`);
	}

	return logs;
}

/**
 * 習慣の振り返りを取得
 * @param params.habitId - 習慣ID
 * @param params.startDate - 開始日
 * @param params.endDate - 終了日
 * @returns 振り返りの配列
 */
export async function getHabitReflections(params: {
	habitId: string;
	startDate?: string;
	endDate?: string;
}): Promise<HabitReflection[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_habits")
		.from("habit_reflections")
		.select("*")
		.eq("habit_id", params.habitId);

	if (params.startDate) {
		query = query.gte("week_start_date", params.startDate);
	}

	if (params.endDate) {
		query = query.lte("week_start_date", params.endDate);
	}

	const { data: reflections, error } = await query.order("week_start_date", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to fetch habit reflections: ${error.message}`);
	}

	return reflections;
}

/**
 * ユーザーの習慣一覧を取得
 * @param params.userId - ユーザーID
 * @param params.status - ステータスでフィルター
 * @param params.categoryId - カテゴリでフィルター
 * @returns 習慣の配列
 */
export async function getUserHabits(params: {
	userId: string;
	status?: "active" | "completed" | "paused" | "archived";
	categoryId?: string;
}): Promise<Habit[]> {
	const supabase = await createClient();

	let query = supabase
		.schema("ff_habits")
		.from("user_habits")
		.select("*")
		.eq("user_id", params.userId);

	if (params.status) {
		query = query.eq("status", params.status);
	}

	if (params.categoryId) {
		query = query.eq("category_id", params.categoryId);
	}

	const { data: habits, error } = await query.order("created_at", {
		ascending: false,
	});

	if (error) {
		throw new Error(`Failed to fetch user habits: ${error.message}`);
	}

	return habits;
}
