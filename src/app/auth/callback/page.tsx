"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallbackPage() {
	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		const handleAuthCallback = async () => {
			const { error } = await supabase.auth.getSession();
			if (error) {
				console.error("Auth error:", error.message);
				router.push("/auth/login?error=auth");
			} else {
				router.push("/webapp");
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
