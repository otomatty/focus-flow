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

// 汎用的なOAuth認証関数
export async function signInWithOAuth(
	provider: Provider,
): Promise<OAuthResponse> {
	try {
		console.log(`Starting ${provider} sign in process...`);
		const supabase = await createClient();

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
			console.error(`${provider} sign in error:`, error);
			return {
				error: {
					message: `${provider}ログインに失敗しました`,
					status: 400,
				},
			};
		}

		if (data.url) {
			console.log(`Successfully obtained ${provider} auth URL`);
			return { url: data.url };
		}

		console.error("No URL returned from OAuth setup");
		return {
			error: {
				message: "認証URLの取得に失敗しました",
				status: 500,
			},
		};
	} catch (error) {
		console.error(`Unexpected error in ${provider} sign in:`, error);
		return {
			error: {
				message: `${provider}ログイン処理中にエラーが発生しました`,
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
