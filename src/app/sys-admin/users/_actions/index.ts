"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserWithDetails } from "@/types/users";
import { convertToUserLevel } from "@/utils/converters";

/**
 * システム管理者用のユーザー一覧を取得
 * @returns ユーザー一覧
 */
export async function listUsers(): Promise<UserWithDetails[]> {
	const supabase = await createClient();

	// プロフィール情報を取得
	const { data: profiles, error: profileError } = await supabase
		.schema("ff_users")
		.from("user_profiles")
		.select("*");

	if (profileError) {
		throw new Error(
			`ユーザープロフィールの取得に失敗: ${profileError.message}`,
		);
	}

	// ユーザーIDの配列を作成
	const userIds = profiles.map((profile) => profile.user_id);

	// ロールマッピングとロール情報を取得
	const { data: roleMappings, error: roleError } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.select(`
			user_id,
			role:user_roles (
				id,
				name,
				description,
				created_at,
				updated_at
			)
		`)
		.in("user_id", userIds);

	if (roleError) {
		throw new Error(`ユーザーロールの取得に失敗: ${roleError.message}`);
	}

	// アカウント状態を取得
	const { data: accountStatuses, error: statusError } = await supabase
		.schema("ff_users")
		.from("account_statuses")
		.select("*")
		.in("user_id", userIds);

	if (statusError) {
		throw new Error(`アカウント状態の取得に失敗: ${statusError.message}`);
	}

	// ユーザー状態を取得
	const { data: userStatuses, error: userStatusError } = await supabase
		.schema("ff_users")
		.from("user_statuses")
		.select("*")
		.in("user_id", userIds);

	if (userStatusError) {
		throw new Error(`ユーザー状態の取得に失敗: ${userStatusError.message}`);
	}

	// レベル情報を取得
	const { data: levels, error: levelError } = await supabase
		.schema("ff_gamification")
		.from("user_levels")
		.select("*")
		.in("user_id", userIds);

	if (levelError) {
		throw new Error(`レベル情報の取得に失敗: ${levelError.message}`);
	}

	// ユーザー情報を結合
	const users: UserWithDetails[] = profiles.map((profile) => {
		const userRoles = roleMappings
			?.filter((mapping) => mapping.user_id === profile.user_id)
			.map((mapping) => mapping.role);

		const accountStatus = accountStatuses?.find(
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
		};

		const userStatus = userStatuses?.find(
			(status) => status.user_id === profile.user_id,
		) || {
			id: "",
			user_id: profile.user_id,
			presence_status: "offline",
			focus_status: null,
			focus_session_id: null,
			focus_started_at: null,
			focus_expected_end_at: null,
			last_activity_at: new Date().toISOString(),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		const userLevel = levels?.find(
			(level) => level.user_id === profile.user_id,
		);
		const level = userLevel ? convertToUserLevel(userLevel) : undefined;

		return {
			id: profile.user_id,
			profile: {
				display_name: profile.display_name,
				email: profile.email,
				last_activity_at: userStatus.last_activity_at,
			},
			roles: userRoles || [],
			account_status: accountStatus,
			user_status: userStatus,
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

/**
 * ユーザーのロールを更新
 * @param userId ユーザーID
 * @param roleIds ロールID配列
 */
export async function updateUserRoles(userId: string, roleIds: string[]) {
	const supabase = await createClient();

	// 現在のロールマッピングを削除
	const { error: deleteError } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.delete()
		.eq("user_id", userId);

	if (deleteError) {
		throw new Error(`ロールの削除に失敗: ${deleteError.message}`);
	}

	// 新しいロールマッピングを作成
	if (roleIds.length > 0) {
		const { error: insertError } = await supabase
			.schema("ff_users")
			.from("user_role_mappings")
			.insert(roleIds.map((roleId) => ({ user_id: userId, role_id: roleId })));

		if (insertError) {
			throw new Error(`ロールの追加に失敗: ${insertError.message}`);
		}
	}
}

/**
 * ユーザーのアカウント状態を更新
 * @param userId ユーザーID
 * @param status アカウント状態
 * @param reason 理由
 */
export async function updateUserAccountStatus(
	userId: string,
	status: "active" | "inactive" | "pending" | "suspended",
	reason?: string,
) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("account_statuses")
		.upsert({
			user_id: userId,
			status,
			reason: reason || null,
			changed_by: (await supabase.auth.getUser()).data.user?.id,
			changed_at: new Date().toISOString(),
		});

	if (error) {
		throw new Error(`アカウント状態の更新に失敗: ${error.message}`);
	}
}
