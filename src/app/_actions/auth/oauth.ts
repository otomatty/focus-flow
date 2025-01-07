"use server";

import { createClient } from "@/lib/supabase/server";

// 認証プロバイダーの型定義
export type Provider = "google" | "github";

// レスポンス型の定義
export interface OAuthResponse {
	error?: {
		message: string;
		status: number;
	};
	url?: string;
}

// エラー型の定義
interface OAuthError {
	message: string;
	status?: number;
	code?: string;
}

// OAuthエラーメッセージの定数
const OAUTH_ERROR_MESSAGES = {
	ProviderNotSupported: "このプロバイダーは現在サポートされていません",
	ConnectionError: "認証サーバーとの接続に失敗しました",
	ConfigurationError: "認証の設定に問題があります",
	UserCancelled: "ユーザーによって認証がキャンセルされました",
	PopupBlocked: "ポップアップがブロックされました",
	DatabaseError:
		"データベースエラーが発生しました。しばらく時間をおいて再度お試しください",
	UnexpectedFailure:
		"予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください",
	ServerError:
		"サーバーエラーが発生しました。しばらく時間をおいて再度お試しください",
	Default: "認証に失敗しました",
} as const;

// OAuthエラーコードからメッセージを取得する関数
function getOAuthErrorMessage(error: OAuthError): string {
	if (!error) return OAUTH_ERROR_MESSAGES.Default;

	if (error.message?.includes("Database error")) {
		return OAUTH_ERROR_MESSAGES.DatabaseError;
	}

	switch (error.code) {
		case "unexpected_failure":
			return OAUTH_ERROR_MESSAGES.UnexpectedFailure;
		case "server_error":
			return OAUTH_ERROR_MESSAGES.ServerError;
		default:
			switch (error.message) {
				case "Provider not supported":
					return OAUTH_ERROR_MESSAGES.ProviderNotSupported;
				case "Connection error":
					return OAUTH_ERROR_MESSAGES.ConnectionError;
				case "Configuration error":
					return OAUTH_ERROR_MESSAGES.ConfigurationError;
				case "User cancelled":
					return OAUTH_ERROR_MESSAGES.UserCancelled;
				case "Popup blocked":
					return OAUTH_ERROR_MESSAGES.PopupBlocked;
				default:
					console.error("Unhandled OAuth error:", {
						message: error.message,
						code: error.code,
						status: error.status,
						timestamp: new Date().toISOString(),
					});
					return OAUTH_ERROR_MESSAGES.Default;
			}
	}
}

// 汎用的なOAuth認証関数
export async function signInWithOAuth(
	provider: Provider,
): Promise<OAuthResponse> {
	try {
		console.log(`Starting ${provider} sign in process...`, {
			provider,
			timestamp: new Date().toISOString(),
		});

		const supabase = await createClient();

		// 既存のセッションをチェック
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

		if (error) {
			const errorMessage = getOAuthErrorMessage(error);
			console.error(`${provider} sign in error:`, {
				error,
				message: errorMessage,
				timestamp: new Date().toISOString(),
			});
			return {
				error: {
					message: errorMessage,
					status: error.status || 400,
				},
			};
		}

		if (data.url) {
			console.log(`Successfully obtained ${provider} auth URL`, {
				provider,
				timestamp: new Date().toISOString(),
			});
			return { url: data.url };
		}

		console.error("No URL returned from OAuth setup", {
			provider,
			timestamp: new Date().toISOString(),
		});
		return {
			error: {
				message: "認証URLの取得に失敗しました",
				status: 500,
			},
		};
	} catch (error) {
		console.error(`Unexpected error in ${provider} sign in:`, {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			provider,
			timestamp: new Date().toISOString(),
		});
		return {
			error: {
				message: `${provider}ログイン処理中に予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください`,
				status: 500,
			},
		};
	}
}

// プロバイダー別のラッパー関数
// 各プロバイダーに特有の設定や前処理が必要な場合に、ここで対応できます
export async function signInWithGoogle(): Promise<OAuthResponse> {
	return signInWithOAuth("google");
}

export async function signInWithGitHub(): Promise<OAuthResponse> {
	return signInWithOAuth("github");
}
