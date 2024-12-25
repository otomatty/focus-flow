"use server";

import { createClient } from "@/lib/supabase/server";

// セッションの取得
export async function getSession() {
	const supabase = await createClient();
	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error) {
		console.error("Error fetching session:", error);
		return null;
	}

	return session;
}

// ユーザー情報の取得
export async function getUser() {
	const session = await getSession();
	return session?.user ?? null;
}

// サインアウト
export async function signOut() {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error("Error signing out:", error);
		throw error;
	}

	return { success: true };
}
