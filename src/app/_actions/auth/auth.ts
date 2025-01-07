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

		// システム管理者権限を確認
		const { data: roleMapping, error: roleError } = await supabase
			.schema("ff_users")
			.from("user_role_mappings")
			.select(`
				user_id,
				user_roles!inner (
					name
				)
			`)
			.eq("user_id", user.id)
			.eq("user_roles.name", "SYSTEM_ADMIN")
			.maybeSingle();

		if (roleError) {
			console.error("Error checking system admin status:", roleError);
			return false;
		}

		const isAdmin = !!roleMapping;

		return isAdmin;
	} catch (error) {
		console.error("Error in checkIsSystemAdmin:", error);
		return false;
	}
}

// エラーメッセージの定数
const AUTH_ERROR_MESSAGES = {
	InvalidCredentials: "メールアドレスまたはパスワードが正しくありません",
	UserNotFound: "ユーザーが見つかりません",
	EmailNotConfirmed: "メールアドレスが確認されていません",
	TooManyAttempts:
		"ログイン試行回数が多すぎます。しばらく時間をおいて再度お試しください",
	InvalidEmail: "無効なメールアドレスです",
	InvalidPassword: "無効なパスワードです",
	DatabaseError:
		"データベースエラーが発生しました。しばらく時間をおいて再度お試しください",
	UnexpectedFailure:
		"予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください",
	ServerError:
		"サーバーエラーが発生しました。しばらく時間をおいて再度お試しください",
	Default: "ログインに失敗しました",
} as const;

// エラーコードからメッセージを取得する関数
function getAuthErrorMessage(error: AuthError): string {
	if (error.message?.includes("Database error")) {
		return AUTH_ERROR_MESSAGES.DatabaseError;
	}

	switch (error.message) {
		case "Invalid login credentials":
			return AUTH_ERROR_MESSAGES.InvalidCredentials;
		case "User not found":
			return AUTH_ERROR_MESSAGES.UserNotFound;
		case "Email not confirmed":
			return AUTH_ERROR_MESSAGES.EmailNotConfirmed;
		case "Too many requests":
			return AUTH_ERROR_MESSAGES.TooManyAttempts;
		case "Invalid email":
			return AUTH_ERROR_MESSAGES.InvalidEmail;
		case "Invalid password":
			return AUTH_ERROR_MESSAGES.InvalidPassword;
		case "unexpected_failure":
			return AUTH_ERROR_MESSAGES.UnexpectedFailure;
		case "server_error":
			return AUTH_ERROR_MESSAGES.ServerError;
		default:
			console.error("Unhandled auth error:", {
				message: error.message,
				code: error.status,
				timestamp: new Date().toISOString(),
			});
			return AUTH_ERROR_MESSAGES.Default;
	}
}

// ログイン
// タイミング: ログイン時に使用
export async function login(formData: FormData): Promise<AuthResponse> {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = await createClient();

	if (!email || !password) {
		console.error("Login validation error: Missing credentials");
		return {
			data: { user: null, session: null },
			error: {
				message: "メールアドレスとパスワードは必須です",
				status: 400,
			} as AuthError,
		};
	}

	try {
		// セッション状態を確認
		const {
			data: { session: currentSession },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError) {
			console.error("Session check error:", {
				error: sessionError,
				timestamp: new Date().toISOString(),
			});
		}

		// 既存のセッションがある場合は一旦サインアウト
		if (currentSession) {
			await supabase.auth.signOut();
			console.log("Signed out existing session");
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			const errorMessage = getAuthErrorMessage(error);
			console.error("Login error:", {
				code: error.status,
				message: errorMessage,
				details: error,
				timestamp: new Date().toISOString(),
			});
			return {
				data: { user: null, session: null },
				error: { ...error, message: errorMessage },
			};
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
			return {
				data: { user: null, session: null },
				error: {
					message: "ユーザー情報の取得に失敗しました",
					status: 500,
				} as AuthError,
			};
		}

		// ユーザープロファイルの存在確認
		const hasProfile = await checkUserProfileExists(userData.user.id);
		if (!hasProfile) {
			console.warn("User profile not found:", {
				userId: userData.user.id,
				timestamp: new Date().toISOString(),
			});
			// プロファイルが存在しない場合でもログインは許可するが、ログに記録
		}

		console.log("Login success:", {
			userId: userData.user.id,
			hasProfile,
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
				message:
					"予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください",
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

		// システムログの確認
		const { data: logs, error: logError } = await supabase
			.schema("ff_logs")
			.from("system_logs")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(5);

		if (logError) {
			console.error("Error fetching system logs:", logError);
		} else {
			console.log("Recent system logs:", logs);
		}

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
			// エラー発生時にシステムログを記録
			await supabase
				.schema("ff_logs")
				.from("system_logs")
				.insert([
					{
						event_type: "SIGNUP_ERROR",
						event_source: "signup",
						event_data: {
							error: error.message,
							email: email,
							timestamp: new Date().toISOString(),
						},
						severity: "ERROR",
					},
				]);

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

		// プロファイル作成の確認
		const hasProfile = await checkUserProfileExists(data.user.id);
		if (!hasProfile) {
			console.warn("Profile creation failed for user:", {
				userId: data.user.id,
				email: data.user.email,
				timestamp: new Date().toISOString(),
			});

			// プロファイル作成の再試行
			const { error: profileError } = await supabase
				.schema("ff_users")
				.rpc("create_user_profile", { user_id: data.user.id });

			if (profileError) {
				console.error("Profile creation retry failed:", {
					error: profileError,
					userId: data.user.id,
					timestamp: new Date().toISOString(),
				});
			}
		}

		revalidatePath("/webapp/dashboard");
		redirect(hasProfile ? "/webapp/dashboard" : "/webapp/setup");
	} catch (error) {
		console.error("Signup error:", {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});
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
