import type { DocFrontmatter } from "../mdx";
import { getUserRoles as getDbUserRoles } from "@/app/_actions/users/roles";
import type { User } from "@supabase/supabase-js";

export async function checkDocAccess(
	frontmatter: DocFrontmatter,
	userRoles: string[],
): Promise<boolean> {
	// SYSTEM_ADMINは全てのドキュメントにアクセス可能
	if (userRoles.includes("SYSTEM_ADMIN")) {
		return true;
	}

	// その他のロールは、allowedRolesに含まれているかどうかで判定
	return userRoles.some((role) => frontmatter.allowedRoles.includes(role));
}

export async function getUserRoles(user: User | null): Promise<string[]> {
	if (!user) {
		return [];
	}

	try {
		const roles = await getDbUserRoles(user.id);
		return roles.map((role) => role.name);
	} catch (error) {
		console.error("Failed to fetch user roles:", error);
		return [];
	}
}
