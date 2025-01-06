import type { Database } from "../supabase";

// データベースの行型を取得
export type UserProfileRow =
	Database["ff_users"]["Tables"]["user_profiles"]["Row"];

// ユーザープロファイル型
export interface UserProfile {
	id: string;
	userId: string;
	displayName: string | null;
	email: string | null;
	profileImage: string | null;
	bio: string | null;
	title: string | null;
	location: string | null;
	website: string | null;
	socialLinks: {
		github: string | null;
		twitter: string | null;
		linkedin: string | null;
		facebook: string | null;
		instagram: string | null;
	};
	languages: string[] | null;
	timezone: string | null;
	cacheVersion: number | null;
	createdAt: string | null;
	updatedAt: string | null;
}
