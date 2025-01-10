"use client";

import { OAuthButton } from "./OAuthButton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const titleVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0 },
};

const gradientVariants = {
	animate: {
		background: [
			"linear-gradient(45deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.1) 100%)",
			"linear-gradient(135deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.1) 100%)",
			"linear-gradient(225deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.1) 100%)",
			"linear-gradient(315deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.1) 100%)",
			"linear-gradient(45deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.1) 100%)",
		],
		transition: {
			duration: 10,
			repeat: Number.POSITIVE_INFINITY,
			ease: "linear",
		},
	},
};

export function LoginForm() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			transition={{ duration: 0.5 }}
			className="w-full max-w-2xl px-4"
		>
			<div className="relative">
				{/* アニメーションのあるグラデーション背景 */}
				<motion.div
					variants={gradientVariants}
					animate="animate"
					className="absolute -inset-1 rounded-2xl blur-2xl opacity-75"
				/>
				<Card className="relative overflow-hidden border-none sm:border bg-white/95 dark:bg-gray-950/95 shadow-2xl backdrop-blur-xl py-6">
					{/* デコレーティブな背景要素 */}
					<div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
					<div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-3xl pointer-events-none opacity-50" />

					{/* ロゴ */}
					<div className="relative pt-6 flex justify-center">
						<motion.div
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="bg-white dark:bg-gray-900"
						>
							<Image
								src="/images/focus-flow_logo.svg"
								alt="Focus Flow Logo"
								width={48}
								height={48}
								className="object-contain"
							/>
						</motion.div>
					</div>

					<CardHeader className="space-y-4 pt-6 pb-8 relative px-8 sm:px-16">
						<motion.div
							variants={titleVariants}
							initial="hidden"
							animate="visible"
							transition={{ delay: 0.2, duration: 0.5 }}
						>
							<CardTitle className="text-3xl font-bold text-center bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
								ログイン / 新規登録
							</CardTitle>
						</motion.div>
						<motion.div
							variants={titleVariants}
							initial="hidden"
							animate="visible"
							transition={{ delay: 0.4, duration: 0.5 }}
						>
							<CardDescription className="text-center text-base">
								{error === "auth" ? (
									<span className="text-red-500 flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-950/50 py-2.5 px-4 rounded-lg">
										<AlertCircle className="h-5 w-5 flex-shrink-0" />
										<span>
											認証エラーが発生しました。もう一度お試しください。
										</span>
									</span>
								) : (
									<span className="text-muted-foreground">
										お好みの方法でログインまたは新規登録してください
									</span>
								)}
							</CardDescription>
						</motion.div>
					</CardHeader>

					<CardContent className="space-y-5 pb-8 relative px-8 sm:px-16">
						<motion.div
							variants={buttonVariants}
							initial="hidden"
							animate="visible"
							transition={{ delay: 0.6, duration: 0.5 }}
							className="relative"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-xl opacity-50 -z-10 rounded-lg" />
							<OAuthButton
								provider="google"
								label="Googleで続ける"
								className="hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 bg-white dark:bg-gray-900 h-12"
							/>
						</motion.div>
						<motion.div
							variants={buttonVariants}
							initial="hidden"
							animate="visible"
							transition={{ delay: 0.8, duration: 0.5 }}
							className="relative"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-xl opacity-50 -z-10 rounded-lg" />
							<OAuthButton
								provider="github"
								label="GitHubで続ける"
								className="hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 bg-white dark:bg-gray-900 h-12"
							/>
						</motion.div>
					</CardContent>
				</Card>
			</div>
		</motion.div>
	);
}
