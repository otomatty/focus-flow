"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Github } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Provider = "google" | "github";

interface OAuthButtonProps {
	provider: Provider;
	label?: string;
}

export function OAuthButton({ provider, label }: OAuthButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const supabase = createClientComponentClient();

	const signInWithOAuth = async () => {
		try {
			setIsLoading(true);
			await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${location.origin}/auth/callback`,
				},
			});
		} catch (error) {
			console.error("OAuth Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="outline"
			className="w-full"
			onClick={signInWithOAuth}
			disabled={isLoading}
		>
			{isLoading ? (
				<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current" />
			) : provider === "github" ? (
				<Github className="mr-2 h-5 w-5" />
			) : (
				<Image
					src="/google.svg"
					alt="Google"
					width={20}
					height={20}
					className="mr-2"
				/>
			)}
			{label ||
				`${provider.charAt(0).toUpperCase() + provider.slice(1)}でログイン`}
		</Button>
	);
}
