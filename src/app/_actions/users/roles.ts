"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "./types";

export async function assignRole(userId: string, roleId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.insert({
			user_id: userId,
			role_id: roleId,
			is_active: true,
		});

	if (error) {
		throw new Error(`Failed to assign role: ${error.message}`);
	}
}

export async function removeRole(userId: string, roleId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("user_role_mappings")
		.update({ is_active: false })
		.eq("user_id", userId)
		.eq("role_id", roleId);

	if (error) {
		throw new Error(`Failed to remove role: ${error.message}`);
	}
}

export async function listAvailableRoles(): Promise<UserRole[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_roles")
		.select("*");

	if (error) {
		throw new Error(`Failed to fetch roles: ${error.message}`);
	}

	return data as UserRole[];
}

export async function updateUserRoles(
	userId: string,
	addedRoles: string[],
	removedRoles: string[],
) {
	try {
		await Promise.all([
			...addedRoles.map((roleId) => assignRole(userId, roleId)),
			...removedRoles.map((roleId) => removeRole(userId, roleId)),
		]);
	} catch (error) {
		throw new Error(`Failed to update user roles: ${error}`);
	}
}

export async function listRoles(): Promise<UserRole[]> {
	const supabase = await createClient();

	const { data: roles, error } = await supabase
		.schema("ff_users")
		.from("user_roles")
		.select("*")
		.order("name");

	if (error) {
		throw new Error(`Failed to fetch user roles: ${error.message}`);
	}

	return roles.map((role) => ({
		...role,
		role_type: (role.role_type || "SYSTEM") as
			| "SYSTEM"
			| "CONTRIBUTOR"
			| "SPECIAL",
		permissions: (Array.isArray(role.permissions)
			? role.permissions.map((p) => String(p))
			: []) as string[],
		created_at: role.created_at || new Date().toISOString(),
		updated_at: role.updated_at || new Date().toISOString(),
	}));
}
