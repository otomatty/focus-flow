"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Schedule = Database["ff_schedules"]["Tables"]["schedules"]["Row"];
type PriorityLevel = Database["ff_schedules"]["Enums"]["priority_level"];

/**
 * スケジュールを作成
 */
export async function createSchedule(params: {
	userId: string;
	title: string;
	description?: string;
	startDate: string;
	startTime?: string;
	endDate: string;
	endTime?: string;
	isAllDay?: boolean;
	categoryId: string;
	priority: PriorityLevel;
	colorId?: string;
	projectId?: string;
	taskId?: string;
	habitId?: string;
}): Promise<Schedule> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedules")
		.insert({
			user_id: params.userId,
			title: params.title,
			description: params.description,
			start_date: params.startDate,
			start_time: params.startTime,
			end_date: params.endDate,
			end_time: params.endTime,
			is_all_day: params.isAllDay,
			category_id: params.categoryId,
			priority: params.priority,
			color_id: params.colorId,
			project_id: params.projectId,
			task_id: params.taskId,
			habit_id: params.habitId,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create schedule: ${error.message}`);
	}

	return data;
}

/**
 * スケジュールを取得
 */
export async function getSchedule(scheduleId: string): Promise<Schedule> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedules")
		.select("*")
		.eq("id", scheduleId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch schedule: ${error.message}`);
	}

	return data;
}

/**
 * スケジュール一覧を取得
 */
export async function getSchedules(params: {
	userId: string;
	startDate?: string;
	endDate?: string;
	categoryId?: string;
	priority?: PriorityLevel;
}): Promise<Schedule[]> {
	const supabase = await createClient();
	let query = supabase
		.schema("ff_schedules")
		.from("schedules")
		.select("*")
		.eq("user_id", params.userId);

	if (params.startDate) {
		query = query.gte("start_date", params.startDate);
	}
	if (params.endDate) {
		query = query.lte("end_date", params.endDate);
	}
	if (params.categoryId) {
		query = query.eq("category_id", params.categoryId);
	}
	if (params.priority) {
		query = query.eq("priority", params.priority);
	}

	const { data, error } = await query.order("start_date", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch schedules: ${error.message}`);
	}

	return data;
}

/**
 * スケジュールを更新
 */
export async function updateSchedule(
	scheduleId: string,
	params: {
		title?: string;
		description?: string;
		startDate?: string;
		startTime?: string;
		endDate?: string;
		endTime?: string;
		isAllDay?: boolean;
		categoryId?: string;
		priority?: PriorityLevel;
		colorId?: string;
		projectId?: string;
		taskId?: string;
		habitId?: string;
	},
): Promise<Schedule> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedules")
		.update({
			title: params.title,
			description: params.description,
			start_date: params.startDate,
			start_time: params.startTime,
			end_date: params.endDate,
			end_time: params.endTime,
			is_all_day: params.isAllDay,
			category_id: params.categoryId,
			priority: params.priority,
			color_id: params.colorId,
			project_id: params.projectId,
			task_id: params.taskId,
			habit_id: params.habitId,
		})
		.eq("id", scheduleId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update schedule: ${error.message}`);
	}

	return data;
}

/**
 * スケジュールを削除
 */
export async function deleteSchedule(scheduleId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_schedules")
		.from("schedules")
		.delete()
		.eq("id", scheduleId);

	if (error) {
		throw new Error(`Failed to delete schedule: ${error.message}`);
	}
}

/**
 * プロジェクトに関連するスケジュールを取得
 */
export async function getProjectSchedules(
	projectId: string,
): Promise<Schedule[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedules")
		.select("*")
		.eq("project_id", projectId)
		.order("start_date", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch project schedules: ${error.message}`);
	}

	return data;
}

/**
 * タスクに関連するスケジュールを取得
 */
export async function getTaskSchedules(taskId: string): Promise<Schedule[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedules")
		.select("*")
		.eq("task_id", taskId)
		.order("start_date", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch task schedules: ${error.message}`);
	}

	return data;
}

/**
 * 習慣に関連するスケジュールを取得
 */
export async function getHabitSchedules(habitId: string): Promise<Schedule[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedules")
		.select("*")
		.eq("habit_id", habitId)
		.order("start_date", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch habit schedules: ${error.message}`);
	}

	return data;
}
