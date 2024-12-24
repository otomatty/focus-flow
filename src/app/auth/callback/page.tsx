"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				// URLからエラーパラメータを確認
				const params = new URLSearchParams(window.location.hash.substring(1));
				const error = params.get("error");
				const errorDescription = params.get("error_description");

				if (error) {
					console.error("Auth error:", errorDescription);
					router.push("/auth/login?error=auth");
					return;
				}

				// セッションの取得を試みる
				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				if (sessionError || !session) {
					console.error("Session error:", sessionError?.message);
					router.push("/auth/login?error=auth");
					return;
				}

				// セッションが正常に取得できた場合
				router.push("/webapp");
			} catch (error) {
				console.error("Callback error:", error);
				router.push("/auth/login?error=auth");
			}
		};

		handleAuthCallback();
	}, [router, supabase.auth]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
		</div>
	);
}
