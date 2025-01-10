"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type UserActivity =
	Database["ff_gamification"]["Tables"]["user_activities"]["Row"];

/**
 * ユーザーのアクティビティを更新する
 * この関数は以下のタイミングで呼び出される：
 * 1. ページの初期ロード時
 * 2. 重要なユーザーアクション実行時（タスクの作成・更新など）
 */
export async function updateUserActivity(): Promise<{
	data: UserActivity | null;
	error: Error | null;
}> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not authenticated");
		}

		const { data, error } = await supabase
			.schema("ff_gamification")
			.from("user_activities")
			.upsert({
				user_id: user.id,
				last_activity_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select("*")
			.single();

		if (error) {
			throw error;
		}

		return { data, error: null };
	} catch (error) {
		console.error("Error updating user activity:", error);
		return {
			data: null,
			error: error instanceof Error ? error : new Error("Unknown error"),
		};
	}
}
