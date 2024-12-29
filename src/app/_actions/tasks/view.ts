"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Json } from "@/types/supabase";

// タスクビューの更新
export async function updateTaskGroupView(
	groupId: string,
	viewType: string,
	settings: Record<string, unknown>,
) {
	const supabase = await createClient();
	const { error } = await supabase.from("task_group_views").upsert({
		group_id: groupId,
		view_type: viewType,
		settings: settings as Json,
		last_used_at: new Date().toISOString(),
	});

	if (error) {
		throw new Error(`タスクビューの更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクビューの取得
export async function getTaskGroupViews(groupId: string) {
	const supabase = await createClient();
	const { data: views, error } = await supabase
		.from("task_group_views")
		.select("*")
		.eq("group_id", groupId)
		.order("last_used_at", { ascending: false });

	if (error) {
		throw new Error(`タスクビューの取得に失敗しました: ${error.message}`);
	}

	return views;
}

// タスクビューの削除
export async function deleteTaskGroupView(groupId: string, viewType: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("task_group_views")
		.delete()
		.eq("group_id", groupId)
		.eq("view_type", viewType);

	if (error) {
		throw new Error(`タスクビューの削除に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// タスクビューの一括更新
export async function bulkUpdateTaskGroupViews(
	groupId: string,
	updates: {
		view_type: string;
		settings: Record<string, unknown>;
	}[],
) {
	const supabase = await createClient();
	const { error } = await supabase.from("task_group_views").upsert(
		updates.map((update) => ({
			group_id: groupId,
			view_type: update.view_type,
			settings: update.settings as Json,
			last_used_at: new Date().toISOString(),
		})),
	);

	if (error) {
		throw new Error(`タスクビューの一括更新に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/tasks");
}

// アクティブなビュータイプの更新
export async function updateActiveViewType(groupId: string, viewType: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("task_groups")
		.update({ active_view_type: viewType })
		.eq("id", groupId);

	if (error) {
		throw new Error(
			`アクティブなビュータイプの更新に失敗しました: ${error.message}`,
		);
	}

	revalidatePath("/webapp/tasks");
}

// ビュー設定の取得
export async function getViewSettings(groupId: string, viewType: string) {
	const supabase = await createClient();
	const { data: view, error } = await supabase
		.from("task_group_views")
		.select("settings")
		.eq("group_id", groupId)
		.eq("view_type", viewType)
		.single();

	if (error) {
		throw new Error(`ビュー設定の取得に失敗しました: ${error.message}`);
	}

	return view?.settings;
}
