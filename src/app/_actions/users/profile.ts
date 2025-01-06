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
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch user profile: ${error.message}`);
	}

	return convertToUserProfile(data);
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
			? JSON.parse(data.social_links as string)
			: {
					github: null,
					twitter: null,
					linkedin: null,
					facebook: null,
					instagram: null,
				},
		languages: data.languages || [],
		timezone: data.timezone || "Asia/Tokyo",
		cacheVersion: data.cache_version,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
}
