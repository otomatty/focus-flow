"use client";

import { motion } from "framer-motion";

export function PrivacyHero() {
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
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
						プライバシーポリシー
					</h1>
					<p className="text-lg text-gray-600">
						Focus Flowは、ユーザーの個人情報の取り扱いについて、
						<br />
						以下のプライバシーポリシーを定めています。
					</p>
				</motion.div>
			</div>
		</section>
	);
}
