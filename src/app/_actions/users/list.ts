import { createClient } from "@/lib/supabase/server";
import type { UserWithDetails } from "./types";
import { convertToUserLevel } from "@/utils/converters";

export async function listUsers(): Promise<UserWithDetails[]> {
	const supabase = await createClient();

	// プロフィール、ロール、アカウント状態を含むユーザー情報を取得
	const { data: profiles, error: profileError } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("*");

	if (profileError) {
		throw new Error(`Failed to fetch user profiles: ${profileError.message}`);
	}

	// ユーザーIDの配列を作成
	const userIds = profiles.map((profile) => profile.user_id);

	// ロールマッピングとロール情報を取得
	const { data: roleMappings, error: roleError } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.select(`
      *,
      role:user_roles(*)
    `)
		.in("user_id", userIds)
		.eq("is_active", true);

	if (roleError) {
		throw new Error(`Failed to fetch user roles: ${roleError.message}`);
	}

	// アカウント状態を取得
	const { data: accountStatuses, error: statusError } = await supabase
		.schema("ff_users")
		.from("account_statuses")
		.select("*")
		.in("user_id", userIds);

	if (statusError) {
		throw new Error(`Failed to fetch account statuses: ${statusError.message}`);
	}

	// レベル情報を取得
	const { data: levels, error: levelError } = await supabase
		.schema("ff_gamification")
		.from("user_levels")
		.select("*")
		.in("user_id", userIds);

	if (levelError) {
		throw new Error(`Failed to fetch user levels: ${levelError.message}`);
	}

	// ユーザー情報を結合
	const users: UserWithDetails[] = profiles.map((profile) => {
		const userRoles = roleMappings
			?.filter((mapping) => mapping.user_id === profile.user_id)
			.map((mapping) => ({
				...mapping.role,
				role_type: (mapping.role.role_type || "SYSTEM") as
					| "SYSTEM"
					| "CONTRIBUTOR"
					| "SPECIAL",
				permissions: (Array.isArray(mapping.role.permissions)
					? mapping.role.permissions.map((p) => String(p))
					: []) as string[],
				created_at: mapping.role.created_at || new Date().toISOString(),
				updated_at: mapping.role.updated_at || new Date().toISOString(),
			}));

		const accountStatus = {
			...(accountStatuses?.find(
				(status) => status.user_id === profile.user_id,
			) || {
				id: "",
				user_id: profile.user_id,
				status: "pending",
				reason: null,
				changed_by: null,
				changed_at: new Date().toISOString(),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}),
			status: (accountStatuses?.find(
				(status) => status.user_id === profile.user_id,
			)?.status || "pending") as
				| "active"
				| "inactive"
				| "pending"
				| "suspended",
			changed_at:
				accountStatuses?.find((status) => status.user_id === profile.user_id)
					?.changed_at || new Date().toISOString(),
			created_at:
				accountStatuses?.find((status) => status.user_id === profile.user_id)
					?.created_at || new Date().toISOString(),
			updated_at:
				accountStatuses?.find((status) => status.user_id === profile.user_id)
					?.updated_at || new Date().toISOString(),
		};

		// レベル情報を取得
		const userLevel = levels?.find(
			(level) => level.user_id === profile.user_id,
		);
		const level = userLevel ? convertToUserLevel(userLevel) : undefined;

		// social_linksをパースして適切な型に変換
		const social_links =
			typeof profile.social_links === "string"
				? JSON.parse(profile.social_links)
				: profile.social_links || {
						github: null,
						twitter: null,
						linkedin: null,
					};

		return {
			id: profile.user_id,
			profile: {
				...profile,
				social_links,
				interests: profile.interests || [],
				availability_status: (profile.availability_status || "offline") as
					| "active"
					| "busy"
					| "away"
					| "offline",
				last_activity_at: profile.last_activity_at || new Date().toISOString(),
				created_at: profile.created_at || new Date().toISOString(),
				updated_at: profile.updated_at || new Date().toISOString(),
			},
			roles: userRoles || [],
			account_status: accountStatus,
			level: level
				? {
						level: level.current_level,
						exp: level.current_exp,
						total_exp: level.total_exp,
					}
				: undefined,
		};
	});

	return users;
}
