"use client";

import { signInWithOAuth } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Provider = "google" | "github";

interface OAuthButtonProps {
	provider: Provider;
	label?: string;
}

export function OAuthButton({ provider, label }: OAuthButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSignIn = async () => {
		try {
			setIsLoading(true);
			const result = await signInWithOAuth(provider);

			if (result.error) {
				console.error("OAuth Error:", result.error);
				return;
			}

			if (result.url) {
				router.push(result.url);
			}
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
			onClick={handleSignIn}
			disabled={isLoading}
		>
			{isLoading ? (
				<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current" />
			) : provider === "github" ? (
				<Github className="mr-2 h-5 w-5" />
			) : (
				<Image
					src="/images/google.svg"
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
