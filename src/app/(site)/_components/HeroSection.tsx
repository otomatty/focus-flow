"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* グラデーション背景 */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1 }}
			/>

			{/* 装飾的な背景要素 */}
			<motion.div
				className="absolute inset-0"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				{/* 中心の太陽のような要素 */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					<div className="w-40 h-40 bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-xl animate-self-rotate" />
					<div className="absolute inset-0 w-40 h-40 bg-orange-200/30 rounded-full mix-blend-multiply filter blur-xl animate-self-rotate animation-delay-2000" />
				</div>

				{/* 軌道要素 */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					{/* 第1軌道 */}
					<div className="animate-orbit-1">
						<div className="relative">
							<div className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-300/40 rounded-full mix-blend-multiply filter blur-lg animate-self-rotate" />
							<div className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-md" />
						</div>
					</div>

					{/* 第2軌道 */}
					<div className="animate-orbit-2 animation-delay-2000">
						<div className="relative">
							<div className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-300/40 rounded-full mix-blend-multiply filter blur-xl animate-self-rotate" />
							<div className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-lg" />
						</div>
					</div>

					{/* 第3軌道 */}
					<div className="animate-orbit-3 animation-delay-4000">
						<div className="relative">
							<div className="absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-xl animate-self-rotate" />
							<div className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-lg" />
						</div>
					</div>
				</div>

				{/* 装飾的な星のような要素 */}
				<div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse-slow" />
				<div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-pulse-slow animation-delay-2000" />
				<div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse-slow animation-delay-4000" />
			</motion.div>

			{/* メインコンテンツ */}
			<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
						「今日」を超えて、
						<br />
						<span className="text-indigo-600">「なりたい自分」へ</span>
					</h1>
					<p className="text-xl md:text-2xl text-gray-600 mb-4">
						あなたの小さな一歩が、確かな成長への道筋を作る
					</p>
					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
						Focus Flowは、あなたの成長をデザインするプラットフォーム。
						<br className="hidden md:block" />
						日々の小さな進歩を可視化し、理想の自分への道のりを明確にします。
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							asChild
							size="lg"
							className="bg-indigo-600 hover:bg-indigo-700"
						>
							<Link href="/auth/login">無料で始める</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="#features">機能を見る</Link>
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
