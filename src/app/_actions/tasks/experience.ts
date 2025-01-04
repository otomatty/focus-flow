import type { TaskExperienceInput } from "@/types/task";

/**
 * タスクの経験値を自動計算する
 * 計算要素：
 * - タイトルと説明の長さ（複雑さの指標）
 * - 見積もり時間の有無
 * - カテゴリの有無
 * - スキルカテゴリの有無
 */
export async function calculateTaskExperience(
	input: TaskExperienceInput,
): Promise<number> {
	// 基本経験値（最小値）
	const baseExperience = 10;

	// 複雑さの係数を計算（タイトルと説明の長さから）
	const complexityFactor = calculateComplexityFactor(input);

	// 時間の係数を計算
	const durationFactor = calculateDurationFactor(input);

	// カテゴリの係数を計算
	const categoryFactor = calculateCategoryFactor(input);

	// 最終的な経験値を計算
	const experiencePoints = Math.round(
		baseExperience * complexityFactor * durationFactor * categoryFactor,
	);

	// 経験値の上限を設定（1タスクあたり最大100ポイント）
	return Math.min(experiencePoints, 100);
}

/**
 * タスクの複雑さを計算
 */
function calculateComplexityFactor(input: TaskExperienceInput): number {
	const titleLength = input.title.length;
	const descriptionLength = input.description?.length || 0;

	// タイトルと説明の長さから複雑さを計算
	const totalLength = titleLength + descriptionLength;

	// 文字数に応じて係数を段階的に設定
	if (totalLength < 50) return 1.0; // 短い説明
	if (totalLength < 100) return 1.2; // 普通の説明
	if (totalLength < 200) return 1.4; // 詳細な説明
	return 1.6; // 非常に詳細な説明
}

/**
 * タスクの時間係数を計算
 */
function calculateDurationFactor(input: TaskExperienceInput): number {
	if (!input.estimatedDuration) return 1.0;

	// 見積もり時間（分）を取得
	const durationMinutes = parseDuration(input.estimatedDuration);

	// 時間に応じて係数を段階的に設定
	if (durationMinutes <= 30) return 1.0; // 30分以下
	if (durationMinutes <= 60) return 1.2; // 1時間以下
	if (durationMinutes <= 180) return 1.4; // 3時間以下
	return 1.6; // 3時間超
}

/**
 * カテゴリとスキルの係数を計算
 */
function calculateCategoryFactor(input: TaskExperienceInput): number {
	let factor = 1.0;

	// カテゴリが設定されている場合
	if (input.category) {
		factor *= 1.1;
	}

	// スキルカテゴリが設定されている場合
	if (input.skillCategory) {
		factor *= 1.2;
	}

	return factor;
}

/**
 * 時間文字列をパースして分に変換
 */
function parseDuration(duration: string): number {
	// PostgreSQLのinterval型の文字列を解析
	// 例: "1 hour", "30 minutes", "2 hours 30 minutes"
	const hours = duration.match(/(\d+)\s*hour/i);
	const minutes = duration.match(/(\d+)\s*minute/i);

	let totalMinutes = 0;
	if (hours) totalMinutes += Number.parseInt(hours[1]) * 60;
	if (minutes) totalMinutes += Number.parseInt(minutes[1]);

	return totalMinutes;
}
