"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Provider = "google" | "github";

export async function signInWithOAuth(provider: Provider) {
	const supabase = await createClient();

	try {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});

		if (error) throw error;
		if (!data?.url) throw new Error("リダイレクトURLが見つかりません");

		redirect(data.url);
	} catch (error) {
		console.error("OAuth Error:", error);
		return {
			error:
				error instanceof Error ? error.message : "認証エラーが発生しました",
		};
	}
}

export async function signOut() {
	const supabase = await createClient();

	try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;

		redirect("/");
	} catch (error) {
		console.error("Signout Error:", error);
		return {
			error:
				error instanceof Error
					? error.message
					: "ログアウトエラーが発生しました",
		};
	}
}
