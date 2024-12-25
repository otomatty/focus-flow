import type { UserProfile, UserProfileRow } from "@/types/users/userProfile";

export const convertToUserProfile = (row: UserProfileRow): UserProfile => {
	return {
		id: row.id,
		userId: row.user_id,
		displayName: row.display_name,
		email: row.email,
		profileImage: row.profile_image,
		level: row.level,
		experiencePoints: row.experience_points,
		cacheVersion: row.cache_version,
		lastActivityAt: row.last_activity_at,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
};
