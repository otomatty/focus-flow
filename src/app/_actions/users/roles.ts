"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type UserRole = Database["ff_users"]["Tables"]["user_roles"]["Row"];
type UserRoleMapping =
	Database["ff_users"]["Tables"]["user_role_mappings"]["Row"];

/**
 * ユーザーに新しいロールを割り当てる
 * @param userId - 対象ユーザーのID
 * @param roleId - 割り当てるロールのID
 * @param assignedBy - ロールを割り当てる管理者のID（オプション）
 */
export async function assignRole(
	userId: string,
	roleId: string,
	assignedBy?: string,
) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.insert({
			user_id: userId,
			role_id: roleId,
			assigned_by: assignedBy,
			assigned_at: new Date().toISOString(),
		});

	if (error) {
		throw new Error(`Failed to assign role: ${error.message}`);
	}
}

/**
 * ユーザーからロールを削除する
 * @param userId - 対象ユーザーのID
 * @param roleId - 削除するロールのID
 */
export async function removeRole(userId: string, roleId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.delete()
		.eq("user_id", userId)
		.eq("role_id", roleId);

	if (error) {
		throw new Error(`Failed to remove role: ${error.message}`);
	}
}

/**
 * システムで利用可能な全ロールを取得する
 * @returns ロールの配列
 */
export async function listAvailableRoles(): Promise<UserRole[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_roles")
		.select("*")
		.order("name");

	if (error) {
		throw new Error(`Failed to fetch roles: ${error.message}`);
	}

	return data;
}

/**
 * 特定のユーザーに割り当てられているロールを取得する
 * @param userId - 対象ユーザーのID
 * @returns ユーザーのロール情報の配列
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.select(`
			role:role_id(
				id,
				name,
				description,
				created_at,
				updated_at
			)
		`)
		.eq("user_id", userId);

	if (error) {
		throw new Error(`Failed to fetch user roles: ${error.message}`);
	}

	return data.map((item) => item.role);
}

/**
 * ユーザーのロールを一括更新する
 * @param userId - 対象ユーザーのID
 * @param addedRoles - 追加するロールIDの配列
 * @param removedRoles - 削除するロールIDの配列
 * @param assignedBy - 更新を実行する管理者のID（オプション）
 */
export async function updateUserRoles(
	userId: string,
	addedRoles: string[],
	removedRoles: string[],
	assignedBy?: string,
) {
	try {
		await Promise.all([
			...addedRoles.map((roleId) => assignRole(userId, roleId, assignedBy)),
			...removedRoles.map((roleId) => removeRole(userId, roleId)),
		]);
	} catch (error) {
		throw new Error(`Failed to update user roles: ${error}`);
	}
}

/**
 * ロールが特定のユーザーに割り当てられているか確認する
 * @param userId - 対象ユーザーのID
 * @param roleId - 確認するロールのID
 * @returns ロールが割り当てられている場合はtrue
 */
export async function hasRole(
	userId: string,
	roleId: string,
): Promise<boolean> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.select("id")
		.eq("user_id", userId)
		.eq("role_id", roleId)
		.single();

	if (error && error.code !== "PGRST116") {
		throw new Error(`Failed to check role: ${error.message}`);
	}

	return !!data;
}
