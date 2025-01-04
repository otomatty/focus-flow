import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "./types";

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

	const social_links = data.social_links
		? JSON.parse(data.social_links as string)
		: {
				github: null,
				twitter: null,
				linkedin: null,
			};

	return {
		...data,
		social_links,
		interests: data.interests || [],
		availability_status: (data.availability_status || "offline") as
			| "active"
			| "busy"
			| "away"
			| "offline",
		last_activity_at: data.last_activity_at || new Date().toISOString(),
		created_at: data.created_at || new Date().toISOString(),
		updated_at: data.updated_at || new Date().toISOString(),
	} as UserProfile;
}

export async function updateUserProfile(
	userId: string,
	profile: Partial<UserProfile>,
) {
	const supabase = await createClient();

	const updateData = {
		...profile,
		social_links: profile.social_links
			? JSON.stringify(profile.social_links)
			: undefined,
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
