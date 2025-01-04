export interface UserRole {
	id: string;
	name: string;
	description: string | null;
	role_type: "SYSTEM" | "CONTRIBUTOR" | "SPECIAL";
	permissions: string[];
	created_at: string;
	updated_at: string;
}

export interface UserProfile {
	id: string;
	user_id: string;
	display_name: string | null;
	email: string | null;
	profile_image: string | null;
	bio: string | null;
	title: string | null;
	location: string | null;
	website: string | null;
	social_links: {
		github: string | null;
		twitter: string | null;
		linkedin: string | null;
	};
	interests: string[];
	availability_status: "active" | "busy" | "away" | "offline";
	last_activity_at: string;
	created_at: string;
	updated_at: string;
}

export interface UserRoleMapping {
	id: string;
	user_id: string;
	role_id: string;
	is_active: boolean;
	assigned_at: string;
	assigned_by: string | null;
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

export interface UserWithDetails {
	id: string;
	profile: UserProfile;
	roles: UserRole[];
	account_status: AccountStatus;
	level?: {
		level: number;
		exp: number;
		total_exp: number;
	};
}
