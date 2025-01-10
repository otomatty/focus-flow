import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserProfileRow } from "@/types/users/profiles";

export async function createUserProfile(
	userId: string,
	profile: Partial<UserProfile>,
): Promise<UserProfile> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.insert({
			user_id: userId,
			display_name: profile.displayName,
			email: profile.email,
			profile_image: profile.profileImage,
			bio: profile.bio,
			title: profile.title,
			location: profile.location,
			website: profile.website,
			social_links: profile.socialLinks
				? JSON.stringify(profile.socialLinks)
				: null,
			languages: profile.languages,
			timezone: profile.timezone || "Asia/Tokyo",
		})
		.select("*")
		.single();

	if (error) {
		throw new Error(`Failed to create user profile: ${error.message}`);
	}

	return convertToUserProfile(data);
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 1000; // 1秒

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		const startTime = performance.now();
		try {
			const supabase = await createClient();

			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError) {
				console.error("Session error:", {
					error: sessionError,
					hasSession: !!session,
					attempt,
					timestamp: new Date().toISOString(),
					elapsedMs: Math.round(performance.now() - startTime),
				});
				if (attempt === MAX_RETRIES) {
					throw new Error("認証セッションが無効です");
				}
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				continue;
			}

			const { data, error } = await supabase
				.schema("ff_users")
				.from("user_profiles")
				.select("*")
				.eq("user_id", userId)
				.single();
			if (error) {
				console.error("Profile fetch error:", {
					error,
					userId,
					attempt,
					code: error.code,
					details: error.details,
					hint: error.hint,
					timestamp: new Date().toISOString(),
					elapsedMs: Math.round(performance.now() - startTime),
				});

				if (error.code === "PGRST116") {
					console.log("Profile not found, creating new profile...", {
						userId,
						timestamp: new Date().toISOString(),
						elapsedMs: Math.round(performance.now() - startTime),
					});

					// 認証情報を取得
					const { data: authData } = await supabase.auth.getUser();

					if (!authData.user) {
						throw new Error("ユーザー情報の取得に失敗しました");
					}

					// 新しいプロフィールを作成
					const newProfile = await createUserProfile(userId, {
						displayName:
							authData.user?.user_metadata?.name ||
							authData.user?.email?.split("@")[0] ||
							"Unknown User",
						email: authData.user?.email,
						profileImage: authData.user?.user_metadata?.avatar_url || null,
					});

					return newProfile;
				}

				if (attempt === MAX_RETRIES) {
					throw new Error(`プロファイルの取得に失敗しました: ${error.message}`);
				}
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				continue;
			}
			return convertToUserProfile(data);
		} catch (error) {
			console.error("Profile error:", {
				error,
				attempt,
				stack: error instanceof Error ? error.stack : undefined,
				timestamp: new Date().toISOString(),
				elapsedMs: Math.round(performance.now() - startTime),
			});

			if (attempt === MAX_RETRIES) {
				throw error;
			}
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
		}
	}

	throw new Error("予期せぬエラーが発生しました");
}

export async function updateUserProfile(
	userId: string,
	profile: Partial<UserProfile>,
): Promise<void> {
	const supabase = await createClient();

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
	};

	const { error } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.update(updateData)
		.eq("user_id", userId);

	if (error) {
		throw new Error(`Failed to update user profile: ${error.message}`);
	}
}

export async function deleteUserProfile(userId: string): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.delete()
		.eq("user_id", userId);

	if (error) {
		throw new Error(`Failed to delete user profile: ${error.message}`);
	}
}

function convertToUserProfile(data: UserProfileRow): UserProfile {
	return {
		id: data.id,
		userId: data.user_id,
		displayName: data.display_name,
		email: data.email,
		profileImage: data.profile_image,
		bio: data.bio,
		title: data.title,
		location: data.location,
		website: data.website,
		socialLinks: data.social_links
			? typeof data.social_links === "string"
				? JSON.parse(data.social_links)
				: data.social_links
			: {
					github: null,
					twitter: null,
					linkedin: null,
					facebook: null,
					instagram: null,
				},
		languages: data.languages,
		timezone: data.timezone || "Asia/Tokyo",
		cacheVersion: data.cache_version,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
}
