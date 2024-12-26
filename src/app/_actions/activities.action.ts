"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActivityType } from "@/types/activity";
import type { Json } from "@/types/supabase";

interface ActivityWithUser {
	id: string;
	project_id: string;
	type: ActivityType;
	action: string;
	details: Json;
	created_at: string;
	updated_at: string;
	user_id: string;
	user: {
		email: string | null;
	} | null;
}

// アクティビティの作成
export async function createActivity(data: {
	projectId: string;
	type: ActivityType;
	action: string;
	details?: Json;
}) {
	try {
		const supabase = await createClient();

		// 現在のユーザーを取得
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("認証されていません");

		const { error } = await supabase.from("project_activities").insert({
			project_id: data.projectId,
			type: data.type,
			action: data.action,
			details: data.details,
			user_id: user.id,
		});

		if (error) throw error;

		revalidatePath(`/webapp/projects/${data.projectId}`);

		return { error: null };
	} catch (error) {
		console.error("Failed to create activity:", error);
		return { error: "アクティビティの作成に失敗しました" };
	}
}

// プロジェクトのアクティビティ一覧を取得
export async function getProjectActivities(projectId: string): Promise<{
	activities: ActivityWithUser[] | null;
	error: string | null;
}> {
	try {
		const supabase = await createClient();

		// アクティビティを取得
		const { data: activities, error } = await supabase
			.from("project_activities")
			.select()
			.eq("project_id", projectId)
			.order("created_at", { ascending: false })
			.limit(10);

		if (error) throw error;
		if (!activities) return { activities: null, error: null };

		// アクティビティを変換
		const activitiesWithUser = activities.map((activity) => ({
			...activity,
			user: { email: null }, // ユーザー情報は一時的にnullに設定
		}));

		return {
			activities: activitiesWithUser as ActivityWithUser[],
			error: null,
		};
	} catch (error) {
		console.error("Failed to fetch activities:", error);
		return { activities: null, error: "アクティビティの取得に失敗しました" };
	}
}
