"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { AuthError, AuthResponse } from "@supabase/supabase-js";
import { z } from "zod";

// バリデーションスキーマを追加
const signupSchema = z.object({
	email: z.string().email("有効なメールアドレスを入力してください"),
	password: z.string().min(6, "パスワードは6文字以上である必要があります"),
});

// システム管理者の確認
export async function checkIsSystemAdmin() {
	const supabase = await createClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (!user || userError) {
		console.error("User authentication error:", userError);
		return false;
	}

	const { data: userRole, error } = await supabase
		.from("user_role_mappings")
		.select(`
			user_roles!inner (
				name
			)
		`)
		.eq("user_id", user.id)
		.eq("user_roles.name", "SYSTEM_ADMIN")
		.maybeSingle();

	if (error) {
		console.error("Error checking system admin status:", error);
		return false;
	}

	return !!userRole;
}

// ログイン
// タイミング: ログイン時に使用
export async function login(formData: FormData): Promise<AuthResponse> {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = await createClient();

	if (!email || !password) {
		return {
			data: { user: null, session: null },
			error: {
				message: "メールアドレスとパスワーは必須です",
				status: 400,
			} as AuthError,
		};
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return { data: { user: null, session: null }, error };
	}

	revalidatePath("/webapp/dashboard");
	return { data, error: null };
}

// ユーザープロフィールの存在認を追加
async function checkUserProfileExists(userId: string): Promise<boolean> {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("user_profiles")
			.select("user_id")
			.eq("user_id", userId)
			.single();

		if (error) {
			if (error.code === "PGRST116") return false;
			throw error;
		}

		return !!data;
	} catch (error) {
		console.error("Error checking user profile:", error);
		return false;
	}
}

// サインアップ機能
export async function signup(formData: FormData): Promise<AuthResponse> {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	try {
		signupSchema.parse({ email, password });
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(error.errors[0].message);
		}
	}

	try {
		const supabase = await createClient();
		const signUpOptions = {
			emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
			data: {
				redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email`,
			},
		};

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: signUpOptions,
		});

		if (error) {
			throw new Error(
				error.message === "User already registered"
					? "このメールアドレスは既に登録されています"
					: error.message,
			);
		}

		if (!data.user) {
			throw new Error("ユーザー情報の取得に失敗しました");
		}

		if (data.user.identities?.length === 0) {
			redirect(`/auth/verify-email?email=${encodeURIComponent(email)}`);
		}

		const hasProfile = await checkUserProfileExists(data.user.id);
		revalidatePath("/webapp/dashboard");
		redirect(hasProfile ? "/webapp/dashboard" : "/webapp/setup");
	} catch (error) {
		throw error instanceof Error
			? error
			: new Error("サインアップ処理中にエラーが発生しました");
	}
}

// Google認証
// export async function signInWithGoogle(): Promise<{
// 	error: AuthError | null;
// 	url?: string;
// }> {
// 	try {
// 		const supabase = await createClient();
// 		const { data, error } = await supabase.auth.signInWithOAuth({
// 			provider: "google",
// 			options: {
// 				redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
// 				queryParams: {
// 					access_type: "offline",
// 					prompt: "consent",
// 				},
// 			},
// 		});

// 		if (error) throw error;
// 		if (!data.url) throw new Error("認証URLの取得に失敗しました");

// 		return { error: null, url: data.url };
// 	} catch (error) {
// 		console.error("Google sign in error:", error);
// 		return {
// 			error:
// 				error instanceof Error
// 					? ({ message: error.message } as AuthError)
// 					: ({ message: "Google認証の開始に失敗しました" } as AuthError),
// 		};
// 	}
// }
