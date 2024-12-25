"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/users/userProfile";
import { convertToUserProfile } from "@/utils/userProfile";
import { revalidatePath, unstable_cache } from "next/cache";

// プロフィール取得の基本関数
async function fetchUserProfile(
	supabase: Awaited<ReturnType<typeof createClient>>,
	userId: string,
): Promise<UserProfile | null> {
	const { data: rawData, error } = await supabase
		.from("user_profiles")
		.select()
		.eq("user_id", userId)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(
			`ユーザープロフィールの取得に失敗しました: ${error.message}`,
		);
	}

	return rawData ? convertToUserProfile(rawData) : null;
}

// キャッシュを使用するプロフィール取得関数
export const getUserProfile = async (
	userId: string,
): Promise<UserProfile | null> => {
	const supabase = await createClient();

	return unstable_cache(
		async () => fetchUserProfile(supabase, userId),
		[`user-profile-${userId}`],
		{
			revalidate: 60,
			tags: [`user-profile-${userId}`],
		},
	)();
};

// ユーザープロフィールの初期化
export async function initializeUserProfile(
	userId: string,
): Promise<UserProfile> {
	const supabase = await createClient();

	// 既存のプロフィールをチェック
	const existingProfile = await getUserProfile(userId);
	if (existingProfile) {
		return existingProfile;
	}

	// ユーザー情報を取得
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		throw new Error("ユーザー情報の取得に失敗しました");
	}

	// 初期プロフィールを作成
	const { data: rawData, error } = await supabase
		.from("user_profiles")
		.insert([
			{
				user_id: userId,
				display_name: user.email?.split("@")[0] || "ユーザー",
				email: user.email,
				level: 1,
				experience_points: 0,
				cache_version: 1,
				last_activity_at: new Date().toISOString(),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		])
		.select()
		.single();

	if (error) {
		throw new Error(`プロフィールの初期化に失敗しました: ${error.message}`);
	}

	revalidatePath("/webapp/profile");
	return convertToUserProfile(rawData);
}

// ユーザープロフィールの更新
export async function updateUserProfile(
	userId: string,
	profile: Partial<UserProfile>,
): Promise<UserProfile> {
	const supabase = await createClient();

	try {
		// 現在のプロフィールを取得
		const { data: currentProfile, error: fetchError } = await supabase
			.from("user_profiles")
			.select("profile_image")
			.eq("user_id", userId)
			.single();

		if (fetchError) {
			console.error("Current profile fetch error:", fetchError);
			throw new Error("現在のプロフィール情報の取得に失敗しました");
		}

		// プロフィールを更新
		const { data: rawData, error } = await supabase
			.from("user_profiles")
			.update({
				display_name: profile.displayName,
				email: profile.email,
				profile_image: profile.profileImage,
				updated_at: new Date().toISOString(),
			})
			.eq("user_id", userId)
			.select()
			.single();

		if (error) {
			console.error("Profile update error:", {
				code: error.code,
				message: error.message,
				details: error.details,
			});
			throw new Error("プロフィールの更新に失敗しました");
		}

		if (!rawData) {
			throw new Error("更新後のプロフィールデータが取得できませんでした");
		}

		// キャッシュを更新
		revalidatePath("/webapp/profile");
		return convertToUserProfile(rawData);
	} catch (error) {
		console.error("Unexpected error during profile update:", error);
		throw error instanceof Error
			? error
			: new Error("プロフィールの更新中に予期せぬエラーが発生しました");
	}
}
