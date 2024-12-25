"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function FeaturesCta() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0">
				<motion.div
					className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				/>
				<motion.div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
					initial={{ opacity: 0, scale: 0.5 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1 }}
				/>
			</div>

			<div className="container relative mx-auto px-4">
				<motion.div
					className="max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border">
						<div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6">
							<Sparkles className="h-6 w-6 text-primary" />
						</div>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
							生産性向上の第一歩を
							<br />
							踏み出しましょう
						</h2>
						<p className="text-lg text-gray-600 mb-8">
							Focus Flowの全機能を14日間無料でお試しいただけます。
							<br />
							クレジットカードは不要で、いつでもキャンセル可能です。
						</p>
						<motion.div
							className="flex gap-4 justify-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
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
								<Link href="/contact">お問い合わせ</Link>
							</Button>
						</motion.div>

						<motion.div
							className="mt-8 pt-8 border-t flex justify-center gap-8"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<span className="w-2 h-2 bg-green-500 rounded-full" />
								1,000+ ユーザー
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<span className="w-2 h-2 bg-blue-500 rounded-full" />
								4.8/5.0 評価
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<span className="w-2 h-2 bg-purple-500 rounded-full" />
								24/7 サポート
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
