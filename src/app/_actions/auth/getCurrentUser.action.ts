"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserWithRole } from "@/stores/userAtom";
import { getUserProfile } from "../user/userProfile.action";
import type { SystemRole } from "@/types/system-roles";
import type { ActionType } from "@/types/role";

interface RoleDataResponse {
	system_roles: (SystemRole & {
		permissions: {
			id: number;
			role_id: number;
			resource: string;
			action: ActionType;
			created_at: string | null;
			updated_at: string | null;
		}[];
	})[];
}

export async function getCurrentUser(): Promise<UserWithRole | null> {
	const supabase = await createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.error("Error fetching user:", userError);
		return null;
	}

	// キャッシュされたプロフィール取得を使用
	const profile = await getUserProfile(user.id);

	// ロール情報を取得
	const { data: roleData, error: roleError } = await supabase
		.from("user_system_roles")
		.select(`
			system_roles!inner(
				id,
				name,
				permissions(*)
			)
		`)
		.eq("user_id", user.id)
		.single();

	if (roleError && roleError.code !== "PGRST116") {
		console.error("Error fetching role:", roleError);
	}

	// 組織IDを取得
	const { data: orgMember, error: orgError } = await supabase
		.from("user_organizations")
		.select("organization_id")
		.eq("user_id", user.id)
		.single();

	if (orgError && orgError.code !== "PGRST116") {
		console.error("Error fetching organization:", orgError);
	}

	const typedRoleData = roleData as RoleDataResponse;

	return {
		...user,
		profile: profile ?? undefined,
		organizationId: orgMember?.organization_id,
		role: typedRoleData?.system_roles?.[0]
			? {
					details: {
						id: typedRoleData.system_roles[0].id,
						name: typedRoleData.system_roles[0].name,
						created_at: null,
						updated_at: null,
						description: null,
					},
					permissions: typedRoleData.system_roles[0].permissions,
				}
			: undefined,
	};
}
