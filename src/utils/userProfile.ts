import type { UserProfile, UserProfileRow } from "@/types/users/profiles";

export const convertToUserProfile = (row: UserProfileRow): UserProfile => {
	return {
		id: row.id,
		userId: row.user_id,
		displayName: row.display_name,
		email: row.email,
		profileImage: row.profile_image,
		bio: row.bio,
		title: row.title,
		location: row.location,
		website: row.website,
		socialLinks: row.social_links
			? typeof row.social_links === "string"
				? JSON.parse(row.social_links)
				: row.social_links
			: {
					github: null,
					twitter: null,
					linkedin: null,
					facebook: null,
					instagram: null,
				},
		languages: row.languages,
		timezone: row.timezone || "Asia/Tokyo",
		cacheVersion: row.cache_version,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
};
