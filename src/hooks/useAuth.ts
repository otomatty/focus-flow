"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
	AuthError,
	User,
	AuthResponse,
	Session,
} from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
	login,
	signup,
	signOut as serverSignOut,
	signInWithGoogle as serverSignInWithGoogle,
	handleAuthCallback as serverHandleAuthCallback,
} from "@/app/_actions/auth";
import { getUserProfile } from "@/app/_actions/users";

// 型定義
interface SignUpParams {
	email: string;
	password: string;
	options?: {
		data?: {
			name?: string;
		};
	};
}

interface SignInParams {
	email: string;
	password: string;
}

export const useAuth = () => {
	const supabase = createClient();
	const navigate = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);

	// ユーザー情報の初期化と監視
	useEffect(() => {
		// 現在のユーザーを取得
		supabase.auth.getUser().then(({ data: { user } }) => {
			setUser(user ?? null);
			setIsLoading(false);
		});

		// セッションの変更を監視
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	// サインアップ
	const signUp = useCallback(
		async (params: SignUpParams): Promise<AuthResponse> => {
			setIsLoading(true);
			try {
				const formData = new FormData();
				formData.append("email", params.email);
				formData.append("password", params.password);

				const response = await signup(formData);
				if (!response.error && response.data?.user) {
					setUser(response.data.user);
				}
				return response;
			} catch (error) {
				console.error("useAuth signUp error:", error);
				return {
					data: { user: null, session: null },
					error: error as AuthError,
				};
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// サインイン
	const signIn = useCallback(
		async (params: SignInParams): Promise<AuthResponse> => {
			setIsLoading(true);
			try {
				const formData = new FormData();
				formData.append("email", params.email);
				formData.append("password", params.password);

				const result = await login(formData);
				if (!result.error && result.data?.session) {
					setSession(result.data.session);
					setUser(result.data.session.user);

					// プロフィールの確認
					const profile = await getUserProfile(result.data.session.user.id);

					// 遷移先の振り分け
					if (profile) {
						navigate.push("/webapp");
					} else {
						navigate.push("/webapp/setup");
					}
				}
				return result;
			} catch (error) {
				return {
					data: { user: null, session: null },
					error: error as AuthError,
				};
			} finally {
				setIsLoading(false);
			}
		},
		[navigate],
	);

	// サインアウト
	const signOut = useCallback(async () => {
		try {
			const result = await serverSignOut();
			if (result.error) {
				throw new Error(result.error.message);
			}
			return { error: null };
		} catch (error) {
			console.error("Error signing out:", error);
			return {
				error:
					error instanceof Error
						? (error as AuthError)
						: ({ message: "サインアウトに失敗しました" } as AuthError),
			};
		}
	}, []);

	// Google認証
	const signInWithGoogle = useCallback(async () => {
		try {
			const result = await serverSignInWithGoogle();
			if (result.error) {
				throw new Error(result.error.message);
			}
			if (result.url) {
				window.location.href = result.url;
			}
			return result;
		} catch (error) {
			console.error("Google sign in error:", error);
			return {
				error:
					error instanceof Error
						? ({ message: error.message } as AuthError)
						: ({ message: "Google認証に失敗しました" } as AuthError),
			};
		}
	}, []);

	// 認証コールバック処理
	const handleAuthCallback = useCallback(async (code: string) => {
		try {
			const result = await serverHandleAuthCallback(code);
			if (result.error) {
				throw new Error(result.error.message);
			}
			return result;
		} catch (error) {
			console.error("認証コールバックエラー:", error);
			return {
				data: { user: null },
				error: {
					message:
						error instanceof Error ? error.message : "Unknown error occurred",
					status: 500,
				},
			};
		}
	}, []);

	return {
		user,
		session,
		isLoading,
		signUp,
		signIn,
		signOut,
		signInWithGoogle,
		handleAuthCallback,
	} as const;
};
