"use client";

import { OAuthButton } from "@/components/auth/oauth-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl text-center">ログイン</CardTitle>
				<CardDescription className="text-center">
					{error === "auth"
						? "認証エラーが発生しました。もう一度お試しください。"
						: "お好みの方法でログインしてください"}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<OAuthButton provider="google" />
				<OAuthButton provider="github" />
			</CardContent>
		</Card>
	);
}

export default function LoginPage() {
	return (
		<Suspense>
			<LoginContent />
		</Suspense>
	);
}
