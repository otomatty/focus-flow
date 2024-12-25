import type { Database } from "../supabase";

// データベースの行型を取得
export type UserProfileRow =
	Database["public"]["Tables"]["user_profiles"]["Row"];

// ユーザープロファイル型
export interface UserProfile {
	id: string;
	userId: string;
	displayName: string | null;
	email: string | null;
	profileImage: string | null;
	level: number | null;
	experiencePoints: number | null;
	cacheVersion: number | null;
	lastActivityAt: string | null;
	createdAt: string | null;
	updatedAt: string | null;
}
