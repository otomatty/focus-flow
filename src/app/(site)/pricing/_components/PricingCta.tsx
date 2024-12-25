"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function PricingCta() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

			<div className="container relative mx-auto px-4">
				<motion.div
					className="max-w-3xl mx-auto text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
						今すぐ始めましょう
					</h2>
					<p className="text-lg text-gray-600 mb-8">
						14日間の無料トライアルで、Focus Flowの全機能をお試しいただけます。
						<br />
						クレジットカードの登録は不要です。
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg">
							<Link href="/auth/signup">無料で始める</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/contact">お問い合わせ</Link>
						</Button>
					</div>

					<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<svg
								className="h-5 w-5 text-primary"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="チェックマーク"
								role="img"
							>
								<path
									d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span>クレジットカード不要</span>
						</div>
						<div className="flex items-center gap-2">
							<svg
								className="h-5 w-5 text-primary"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="チェックマーク"
								role="img"
							>
								<path
									d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span>14日間無料トライアル</span>
						</div>
						<div className="flex items-center gap-2">
							<svg
								className="h-5 w-5 text-primary"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="チェックマーク"
								role="img"
							>
								<path
									d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span>いつでもキャンセル可能</span>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
