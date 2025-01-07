export * from "./profiles";
export * from "./level";

export interface Role {
	id: string;
	name: string;
	description: string | null;
	created_at: string;
	updated_at: string;
}

export interface AccountStatus {
	id: string;
	user_id: string;
	status: "active" | "inactive" | "pending" | "suspended";
	reason: string | null;
	changed_by: string | null;
	changed_at: string;
	created_at: string;
	updated_at: string;
}

export interface UserStatus {
	id: string;
	user_id: string;
	presence_status: "online" | "offline" | "idle";
	focus_status: "focusing" | "breaking" | "meeting" | "available" | null;
	focus_session_id: string | null;
	focus_started_at: string | null;
	focus_expected_end_at: string | null;
	last_activity_at: string;
	created_at: string;
	updated_at: string;
}

export interface UserWithDetails {
	id: string;
	profile: {
		display_name: string | null;
		email: string | null;
		last_activity_at: string | null;
	};
	roles: Role[];
	account_status: AccountStatus;
	user_status: UserStatus;
	level?: {
		level: number;
		exp: number;
		total_exp: number;
	};
}

import type { UserProfile } from "./profiles";
import type { UserLevel, LevelSetting } from "./level";

export interface UserData {
	profile: UserProfile;
	level: UserLevel;
	nextLevelExp: number | null;
	levelSetting: LevelSetting | undefined;
}
