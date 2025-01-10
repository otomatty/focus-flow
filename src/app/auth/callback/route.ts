import { handleAuthCallback } from "@/app/_actions/auth";
import { initializeUserProfile } from "@/app/_actions/users/user-profile";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const code = searchParams.get("code");
		const error = searchParams.get("error");
		const errorDescription = searchParams.get("error_description");
		const state = searchParams.get("state");

		console.log("Auth callback received:", {
			hasCode: !!code,
			error,
			errorDescription,
			state,
			url: request.url,
			timestamp: new Date().toISOString(),
		});

		if (error) {
			console.error("Auth callback error:", {
				error,
				errorDescription,
				state,
				timestamp: new Date().toISOString(),
			});
			return Response.redirect(new URL("/auth/login?error=auth", request.url));
		}

		if (!code) {
			console.error("No code provided in callback", {
				searchParams: Object.fromEntries(searchParams.entries()),
				timestamp: new Date().toISOString(),
			});
			return Response.redirect(
				new URL("/auth/login?error=no_code", request.url),
			);
		}

		// コードをセッションに交換
		const { data, error: callbackError } = await handleAuthCallback(code);

		if (callbackError || !data?.session) {
			console.error("Session exchange error:", {
				error: callbackError,
				hasSession: !!data?.session,
				timestamp: new Date().toISOString(),
				details: callbackError
					? {
							code: callbackError.code,
							status: callbackError.status,
							name: callbackError.name,
							stack: callbackError.stack,
						}
					: null,
			});
			return Response.redirect(new URL("/auth/login?error=auth", request.url));
		}

		try {
			// Server Actionを使用してユーザープロフィールを初期化
			await initializeUserProfile(data.session.user.id);
			// 認証成功
			return Response.redirect(new URL("/webapp", request.url));
		} catch (error) {
			console.error("Failed to initialize user:", error);
			return Response.redirect(
				new URL("/auth/login?error=init_failed", request.url),
			);
		}
	} catch (error) {
		console.error("Callback error:", error);
		return Response.redirect(new URL("/auth/login?error=auth", request.url));
	}
}
