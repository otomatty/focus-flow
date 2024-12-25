"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FeaturesHero() {
	return (
		<section className="relative py-20 overflow-hidden">
			{/* 背景のグラデーション */}
			<div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

			{/* 装飾的な背景要素 */}
			<div className="absolute inset-0">
				<motion.div
					className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1 }}
				/>
				<motion.div
					className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.2 }}
				/>
			</div>

			<div className="container relative mx-auto px-4">
				<div className="max-w-3xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
							生産性を最大化する
							<span className="block mt-2">パワフルな機能</span>
						</h1>
					</motion.div>

					<motion.p
						className="text-xl text-gray-600 mb-8 leading-relaxed"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						Focus
						Flowは、あなたの作業効率を最大限に引き出すための機能を提供します。
						<span className="block mt-2">
							ポモドーロテクニックとタスク管理を組み合わせた独自の機能で、
							フォーカスとフローの状態を維持します。
						</span>
					</motion.p>

					<motion.div
						className="flex gap-4 justify-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<Button asChild size="lg" className="group">
							<Link href="/auth/signup">
								無料で始める
								<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="hover:bg-primary/5"
						>
							<Link href="/pricing">料金プランを見る</Link>
						</Button>
					</motion.div>

					{/* 装飾的なバッジ */}
					<motion.div
						className="mt-12 flex justify-center gap-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						<div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm">
							<span className="w-2 h-2 bg-green-500 rounded-full" />
							14日間無料トライアル
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm">
							<span className="w-2 h-2 bg-blue-500 rounded-full" />
							クレジットカード不要
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
