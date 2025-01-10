"use client";

import { signInWithOAuth } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Provider = "google" | "github";

interface OAuthButtonProps {
	provider: Provider;
	label?: string;
	className?: string;
}

export function OAuthButton({ provider, label, className }: OAuthButtonProps) {
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
				window.location.href = result.url;
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
			className={cn(
				"w-full relative overflow-hidden group",
				"hover:border-primary/50 hover:bg-primary/5",
				"active:scale-[0.98] transition-all duration-200",
				className,
			)}
			onClick={handleSignIn}
			disabled={isLoading}
		>
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
			{isLoading ? (
				<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current" />
			) : provider === "github" ? (
				<Github className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
			) : (
				<Image
					src="/images/google.svg"
					alt="Google"
					width={20}
					height={20}
					className="mr-2 transition-transform duration-200 group-hover:scale-110"
				/>
			)}
			{label ||
				`${provider.charAt(0).toUpperCase() + provider.slice(1)}で続ける`}
		</Button>
	);
}
