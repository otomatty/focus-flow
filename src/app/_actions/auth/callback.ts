"use server";

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { AuthError } from "@supabase/supabase-js";

export interface CallbackResponse {
	data: {
		user: User | null;
	};
	error?: {
		message: string;
		status: number;
	};
}

// コラー型の定義
interface AuthCallbackError {
	message: string;
	status?: number;
	code?: string;
}

// コールバックエラーメッセージの定数
const CALLBACK_ERROR_MESSAGES = {
	InvalidCode: "無効な認証コードです",
	ExpiredCode: "認証コードの有効期限が切れています",
	SessionCreationFailed: "セッションの作成に失敗しました",
	DatabaseError:
		"データベースエラーが発生しました。しばらく時間をおいて再度お試しください",
	UnexpectedFailure:
		"予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください",
	ServerError:
		"サーバーエラーが発生しました。しばらく時間をおいて再度お試しください",
	Default: "認証コールバックの処理に失敗しました",
} as const;

// コールバックエラーコードからメッセージを取得する関数
function getCallbackErrorMessage(error: AuthCallbackError): string {
	if (error.message?.includes("Database error")) {
		return CALLBACK_ERROR_MESSAGES.DatabaseError;
	}

	switch (error.code) {
		case "unexpected_failure":
			return CALLBACK_ERROR_MESSAGES.UnexpectedFailure;
		case "server_error":
			return CALLBACK_ERROR_MESSAGES.ServerError;
		default:
			switch (error.message) {
				case "Invalid code":
					return CALLBACK_ERROR_MESSAGES.InvalidCode;
				case "Expired code":
					return CALLBACK_ERROR_MESSAGES.ExpiredCode;
				case "Failed to create session":
					return CALLBACK_ERROR_MESSAGES.SessionCreationFailed;
				default:
					console.error("Unhandled callback error:", {
						message: error.message,
						code: error.code,
						status: error.status,
						timestamp: new Date().toISOString(),
					});
					return CALLBACK_ERROR_MESSAGES.Default;
			}
	}
}

// コールバック処理
export async function handleAuthCallback(code: string) {
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 1000; // 1秒

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		const startTime = performance.now();
		try {
			const supabase = await createClient();

			// 既存のセッションをチェック
			const {
				data: { session: currentSession },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError) {
				console.error("Session check error:", {
					error: sessionError,
					attempt,
					timestamp: new Date().toISOString(),
					elapsedMs: Math.round(performance.now() - startTime),
				});
			}

			// 既存のセッションがある場合は一旦サインアウト
			if (currentSession) {
				await supabase.auth.signOut();
				console.log("Signed out existing session", {
					timestamp: new Date().toISOString(),
					elapsedMs: Math.round(performance.now() - startTime),
				});
			}

			const { data, error } = await supabase.auth.exchangeCodeForSession(code);

			if (error) {
				const errorMessage = getCallbackErrorMessage(error);
				console.error("Auth callback error:", {
					error,
					message: errorMessage,
					attempt,
					timestamp: new Date().toISOString(),
					elapsedMs: Math.round(performance.now() - startTime),
				});

				if (attempt === MAX_RETRIES) {
					return {
						data: { session: null, user: null },
						error: { ...error, message: errorMessage },
					};
				}
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				continue;
			}

			if (!data.session) {
				console.error("No session data returned", {
					timestamp: new Date().toISOString(),
					elapsedMs: Math.round(performance.now() - startTime),
				});

				if (attempt === MAX_RETRIES) {
					return {
						data: { session: null, user: null },
						error: {
							message: CALLBACK_ERROR_MESSAGES.SessionCreationFailed,
							status: 500,
						} as AuthError,
					};
				}
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				continue;
			}

			return { data, error: null };
		} catch (error) {
			console.error("Unexpected auth callback error:", {
				error,
				attempt,
				stack: error instanceof Error ? error.stack : undefined,
				timestamp: new Date().toISOString(),
				elapsedMs: Math.round(performance.now() - startTime),
			});

			if (attempt === MAX_RETRIES) {
				return {
					data: { session: null, user: null },
					error: {
						message:
							"認証コールバックの処理中に予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください",
						status: 500,
					} as AuthError,
				};
			}
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
		}
	}

	return {
		data: { session: null, user: null },
		error: {
			message: "認証コールバックの処理に失敗しました",
			status: 500,
		} as AuthError,
	};
}
