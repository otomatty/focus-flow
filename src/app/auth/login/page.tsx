"use client";

import { OAuthButton } from "../_components/OAuthButton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return (
		<Card className="border-none sm:border shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-950/95">
			<CardHeader className="space-y-3 pb-8">
				<CardTitle className="text-3xl font-bold text-center bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
					ログイン
				</CardTitle>
				<CardDescription className="text-center text-base">
					{error === "auth" ? (
						<span className="text-red-500">
							認証エラーが発生しました。もう一度お試しください。
						</span>
					) : (
						"お好みの方法でログインしてください"
					)}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 pb-8">
				<OAuthButton provider="google" label="Googleでログイン" />
				<OAuthButton provider="github" label="GitHubでログイン" />
				<div className="text-center text-sm text-gray-500 pt-2">
					アカウントをお持ちでない場合は{" "}
					<Link
						href="/auth/signup"
						className="text-primary hover:underline transition-colors duration-200"
					>
						新規登録
					</Link>
				</div>
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
