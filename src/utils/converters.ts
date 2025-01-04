import type { Task, TaskStyleJson } from "@/types/task";
import type { TaskRow } from "@/types/task";
import type { UserLevel } from "@/types/users/level";
import type { Database } from "@/types/supabase";

type UserLevelRow = Database["ff_gamification"]["Tables"]["user_levels"]["Row"];

export function convertToTask(row: TaskRow): Task {
	const { estimated_duration, actual_duration, style, ...rest } = row;
	const taskStyle = style
		? (style as TaskStyleJson)
		: { color: null, icon: null };
	return {
		...rest,
		estimated_duration: estimated_duration?.toString() ?? null,
		actual_duration: actual_duration?.toString() ?? null,
		style: taskStyle,
		ai_analysis: null,
	};
}

export function convertToUserLevel(row: UserLevelRow): UserLevel {
	return {
		id: row.id,
		user_id: row.user_id,
		current_level: row.current_level,
		current_exp: row.current_exp,
		total_exp: row.total_exp,
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
}
