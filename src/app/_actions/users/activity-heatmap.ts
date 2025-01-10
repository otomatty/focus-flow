"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActivityHeatmapData {
	activityDate: string;
	activityLevel: number;
	loginCount: number;
	completedTasks: number;
	focusMinutes: number;
	completedHabits: number;
}

/**
 * 指定期間のアクティビティヒートマップデータを取得
 * @param userId - ユーザーID
 * @param startDate - 開始日（YYYY-MM-DD）
 * @param endDate - 終了日（YYYY-MM-DD）
 */
export async function getActivityHeatmap(
	userId: string,
	startDate: string,
	endDate: string,
): Promise<ActivityHeatmapData[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.rpc("get_activity_heatmap", {
			p_user_id: userId,
			p_start_date: startDate,
			p_end_date: endDate,
		});

	if (error) {
		throw new Error(`Failed to fetch activity heatmap: ${error.message}`);
	}

	// データが存在しない日付を0で埋める
	const result: ActivityHeatmapData[] = [];
	const start = new Date(startDate);
	const end = new Date(endDate);
	const dataMap = new Map(data.map((d) => [d.activity_date, d]));

	for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
		const dateStr = date.toISOString().split("T")[0];
		const activity = dataMap.get(dateStr);

		result.push({
			activityDate: dateStr,
			activityLevel: activity?.activity_level ?? 0,
			loginCount: activity?.login_count ?? 0,
			completedTasks: activity?.completed_tasks ?? 0,
			focusMinutes: activity?.focus_minutes ?? 0,
			completedHabits: activity?.completed_habits ?? 0,
		});
	}

	return result;
}
