import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { userId } = await request.json();
		const supabase = await createClient();

		// オンボーディングクエストを取得
		const { data: onboardingQuest, error: questError } = await supabase
			.from("quests")
			.select("id")
			.eq("quest_type", "onboarding")
			.single();

		if (questError || !onboardingQuest) {
			return NextResponse.json(
				{ error: "Failed to fetch onboarding quest" },
				{ status: 500 },
			);
		}

		// ユーザープロファイルを作成
		const { error: profileError } = await supabase
			.from("user_profiles")
			.insert({
				user_id: userId,
				experience_points: 0,
				level: 1,
			});

		if (profileError) {
			return NextResponse.json(
				{ error: "Failed to create user profile" },
				{ status: 500 },
			);
		}

		// ユーザー設定を作成
		const { error: settingsError } = await supabase
			.from("user_settings")
			.insert({
				user_id: userId,
				notification_enabled: true,
				voice_input_enabled: false,
				theme_color: "blue",
			});

		if (settingsError) {
			return NextResponse.json(
				{ error: "Failed to create user settings" },
				{ status: 500 },
			);
		}

		// オンボーディングクエストを割り当て
		const now = new Date();
		const endDate = new Date();
		endDate.setDate(now.getDate() + 7); // 1週間の期限を設定

		const { error: questAssignError } = await supabase
			.from("user_quests")
			.insert({
				user_id: userId,
				quest_id: onboardingQuest.id,
				start_date: now.toISOString(),
				end_date: endDate.toISOString(),
				status: "in_progress",
				progress: {
					completed_steps: [],
					current_step: "notification_settings",
				},
			});

		if (questAssignError) {
			return NextResponse.json(
				{ error: "Failed to assign onboarding quest" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Initialize error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
