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
	try {
		const supabase = await createClient();

		// 現在のユーザーを取得
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (!user || userError) {
			console.error("User authentication error:", userError);
			return false;
		}

		console.log("Checking system admin status for user:", {
			userId: user.id,
			email: user.email,
		});

		// システム管理者権限を確認
		const { data: roleMapping, error: roleError } = await supabase
			.schema("ff_users")
			.from("user_role_mappings")
			.select(`
				user_id,
				is_active,
				user_roles!inner (
					name
				)
			`)
			.eq("user_id", user.id)
			.eq("is_active", true)
			.eq("user_roles.name", "SYSTEM_ADMIN")
			.maybeSingle();

		if (roleError) {
			console.error("Error checking system admin status:", roleError);
			return false;
		}

		const isAdmin = !!roleMapping;

		console.log("System admin check result:", {
			roleMapping,
			isAdmin,
			query: {
				userId: user.id,
				roleName: "SYSTEM_ADMIN",
				isActive: true,
			},
		});

		return isAdmin;
	} catch (error) {
		console.error("Error in checkIsSystemAdmin:", error);
		return false;
	}
}

// ログイン
// タイミング: ログイン時に使用
export async function login(formData: FormData): Promise<AuthResponse> {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = await createClient();

	console.log("Login attempt:", {
		email,
		hasPassword: !!password,
		timestamp: new Date().toISOString(),
	});

	if (!email || !password) {
		console.error("Login validation error: Missing credentials");
		return {
			data: { user: null, session: null },
			error: {
				message: "メールアドレスとパスワーは必須です",
				status: 400,
			} as AuthError,
		};
	}

	try {
		// セッション状態を確認
		const {
			data: { session: currentSession },
		} = await supabase.auth.getSession();
		console.log("Current session state:", {
			hasSession: !!currentSession,
			sessionId: currentSession?.user?.id,
			timestamp: new Date().toISOString(),
		});

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Login error:", {
				code: error.status,
				message: error.message,
				details: error,
				timestamp: new Date().toISOString(),
			});
			return { data: { user: null, session: null }, error };
		}

		// ユーザー情報の取得を試みる
		const { data: userData, error: userError } = await supabase.auth.getUser(
			data.user?.id,
		);

		if (userError) {
			console.error("User data fetch error:", {
				error: userError,
				userId: data.user?.id,
				timestamp: new Date().toISOString(),
			});
		} else {
			console.log("User data fetch success:", {
				userId: userData.user.id,
				timestamp: new Date().toISOString(),
			});
		}

		console.log("Login success:", {
			userId: data.user?.id,
			email: data.user?.email,
			hasSession: !!data.session,
			timestamp: new Date().toISOString(),
		});

		revalidatePath("/webapp/dashboard");
		return { data, error: null };
	} catch (error) {
		console.error("Unexpected login error:", {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});
		return {
			data: { user: null, session: null },
			error: {
				message: "予期せぬエラーが発生しました",
				status: 500,
			} as AuthError,
		};
	}
}

// ユーザープロフィールの存在認を追加
async function checkUserProfileExists(userId: string): Promise<boolean> {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.schema("ff_users")
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
