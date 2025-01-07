"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/users/profiles";
import { convertToUserProfile } from "@/utils/userProfile";
import { revalidatePath, unstable_cache } from "next/cache";

// プロフィール取得の基本関数
export async function fetchUserProfile(userId: string) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.schema("ff_users")
			.from("user_profiles")
			.select("*")
			.eq("user_id", userId)
			.single();

		if (error) {
			console.error("Error fetching user profile:", {
				error,
				userId,
				timestamp: new Date().toISOString(),
			});

			if (error.code === "PGRST116") return null;

			if (error.message?.includes("The schema must be one of the following")) {
				throw new Error(
					"システム設定エラー: データベーススキーマの設定を確認してください",
				);
			}

			throw new Error(
				`ユーザープロフィールの取得に失敗しました: ${error.message}`,
			);
		}

		// social_linksの処理を改善
		if (data?.social_links) {
			try {
				// 既にオブジェクトの場合はそのまま使用
				data.social_links =
					typeof data.social_links === "string"
						? JSON.parse(data.social_links)
						: data.social_links;
			} catch (e) {
				console.error("Error parsing social_links:", e);
				// パースエラーの場合はデフォルト値を設定
				data.social_links = {
					github: null,
					twitter: null,
					facebook: null,
					linkedin: null,
				};
			}
		}

		return data;
	} catch (error) {
		console.error("Unexpected error in fetchUserProfile:", {
			error,
			userId,
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});
		throw error;
	}
}

// キャッシュを使用するプロフィール取得関数
export const getUserProfile = async (
	userId: string,
): Promise<UserProfile | null> => {
	const supabase = await createClient();

	const fetchProfileWithClient = async () => {
		const { data, error } = await supabase
			.schema("ff_users")
			.from("user_profiles")
			.select("*")
			.eq("user_id", userId)
			.single();

		if (error) {
			console.error("Error fetching user profile:", {
				error,
				userId,
				timestamp: new Date().toISOString(),
			});

			if (error.code === "PGRST116") return null;

			if (error.message?.includes("The schema must be one of the following")) {
				throw new Error(
					"システム設定エラー: データベーススキーマの設定を確認してください",
				);
			}

			throw new Error(
				`ユーザープロフィールの取得に失敗しました: ${error.message}`,
			);
		}

		return data ? convertToUserProfile(data) : null;
	};

	return unstable_cache(fetchProfileWithClient, [`user-profile-${userId}`], {
		revalidate: 60,
		tags: [`user-profile-${userId}`],
	})();
};

// ユーザープロフィールの初期化
export async function initializeUserProfile(
	userId: string,
): Promise<UserProfile> {
	const supabase = await createClient();

	// 既存のプロフィールをチェック（キャッシュを使用しない直接チェック）
	const { data: existingProfile, error: checkError } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (existingProfile) {
		return convertToUserProfile(existingProfile);
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
		.schema("ff_users")
		.from("user_profiles")
		.insert([
			{
				user_id: userId,
				display_name: user.email?.split("@")[0] || "ユーザー",
				email: user.email,
				cache_version: 1,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		])
		.select()
		.single();

	if (error) {
		throw new Error(`プロフィールの初期化に失敗しました: ${error.message}`);
	}

	// ユーザーステータスを初期化
	const { error: statusError } = await supabase
		.schema("ff_users")
		.from("user_statuses")
		.insert({
			user_id: userId,
			presence_status: "offline",
			focus_status: "available",
			last_activity_at: new Date().toISOString(),
		});

	if (statusError) {
		throw new Error(
			`ユーザーステータスの初期化に失敗しました: ${statusError.message}`,
		);
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
		console.log("Updating profile for user:", {
			userId,
			profile,
			timestamp: new Date().toISOString(),
		});

		const updateData = {
			display_name: profile.displayName,
			email: profile.email,
			profile_image: profile.profileImage,
			bio: profile.bio,
			title: profile.title,
			location: profile.location,
			website: profile.website,
			social_links: profile.socialLinks
				? JSON.stringify(profile.socialLinks)
				: undefined,
			languages: profile.languages,
			timezone: profile.timezone,
			updated_at: new Date().toISOString(),
		};

		console.log("Update data prepared:", {
			updateData,
			timestamp: new Date().toISOString(),
		});

		// プロフィールを更新
		const { data: rawData, error } = await supabase
			.schema("ff_users")
			.from("user_profiles")
			.update(updateData)
			.eq("user_id", userId)
			.select()
			.single();

		if (error) {
			console.error("Profile update error:", {
				code: error.code,
				message: error.message,
				details: error.details,
				updateData,
				userId,
				timestamp: new Date().toISOString(),
			});
			throw new Error("プロフィールの更新に失敗しました");
		}

		if (!rawData) {
			console.error("No data returned after update:", {
				userId,
				updateData,
				timestamp: new Date().toISOString(),
			});
			throw new Error("更新後のプロフィールデータが取得できませんでした");
		}

		console.log("Profile updated successfully:", {
			userId,
			rawData,
			timestamp: new Date().toISOString(),
		});

		// キャッシュを更新
		revalidatePath("/webapp/profile");
		const convertedProfile = convertToUserProfile(rawData);

		console.log("Profile converted and ready to return:", {
			userId,
			convertedProfile,
			timestamp: new Date().toISOString(),
		});

		return convertedProfile;
	} catch (error) {
		console.error("Unexpected error during profile update:", {
			error,
			userId,
			profile,
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});
		throw error instanceof Error
			? error
			: new Error("プロフィールの更新中に予期せぬエラーが発生しました");
	}
}
