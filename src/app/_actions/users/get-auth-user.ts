// 認証ユーザーを取得するServer Action
// TODO:認証はmiddlewareで行っているため、このActionは不要になるかもしれない
// ## ユーザー認証の確認をどこで行うのかについては改めて検討が必要
// - ページごと、middleware、どちらで行うのか？

"use server";

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function getAuthUser(): Promise<User | null> {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		console.error("Auth user error:", error);
		return null;
	}

	return user;
}
