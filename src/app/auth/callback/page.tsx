"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleAuthCallback } from "@/app/_actions/auth";
import { initializeUserProfile } from "@/app/_actions/user/userProfile.action";

export default function AuthCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const processCallback = async () => {
			try {
				const code = searchParams.get("code");
				const error = searchParams.get("error");
				const errorDescription = searchParams.get("error_description");

				if (error) {
					console.error("Auth error:", errorDescription);
					router.push("/auth/login?error=auth");
					return;
				}

				if (!code) {
					console.error("No code provided");
					router.push("/auth/login?error=no_code");
					return;
				}

				// セードをセッションに交換
				const { data, error: callbackError } = await handleAuthCallback(code);

				if (callbackError || !data?.session) {
					console.error("Session error:", callbackError?.message);
					router.push("/auth/login?error=auth");
					return;
				}

				try {
					// Server Actionを使用してユーザープロフィールを初期化
					await initializeUserProfile(data.session.user.id);
					// 認証成功
					router.push("/webapp");
				} catch (error) {
					console.error("Failed to initialize user:", error);
					router.push("/auth/login?error=init_failed");
				}
			} catch (error) {
				console.error("Callback error:", error);
				router.push("/auth/login?error=auth");
			}
		};

		processCallback();
	}, [router, searchParams]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
		</div>
	);
}
