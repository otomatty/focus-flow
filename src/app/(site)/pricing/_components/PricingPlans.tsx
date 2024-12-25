"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
	{
		name: "Free",
		description: "個人での基本的な利用に最適",
		price: "0",
		features: [
			"基本的なポモドーロタイマー",
			"シンプルなタスク管理",
			"1つのプロジェクト",
			"基本的な統計情報",
		],
		cta: "無料で始める",
		href: "/auth/signup",
		popular: false,
	},
	{
		name: "Pro",
		description: "生産性を最大限に引き出したい個人に",
		price: "980",
		features: [
			"カスタマイズ可能なタイマー",
			"高度なタスク管理",
			"無制限のプロジェクト",
			"詳細な分析とレポート",
			"フォーカスモード",
			"優先サポート",
		],
		cta: "Pro プランを選択",
		href: "/auth/signup?plan=pro",
		popular: true,
	},
	{
		name: "Team",
		description: "チームでの利用に最適",
		price: "2,980",
		features: [
			"Pro プランの全機能",
			"チームメンバー管理",
			"チーム分析",
			"プロジェクト共有",
			"カスタムインテグレーション",
			"専属サポート",
		],
		cta: "Team プランを選択",
		href: "/auth/signup?plan=team",
		popular: false,
	},
];

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export function PricingPlans() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

			<div className="container relative mx-auto px-4">
				<motion.div
					className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12 max-w-7xl mx-auto"
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
				>
					{plans.map((plan) => (
						<motion.div
							key={plan.name}
							className={`relative rounded-2xl bg-white p-8 shadow-sm ${
								plan.popular
									? "ring-2 ring-primary lg:scale-105"
									: "hover:shadow-md"
							} transition-all duration-300`}
							variants={item}
						>
							{plan.popular && (
								<div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary py-2 text-center text-sm font-semibold text-white shadow-sm">
									人気プラン
								</div>
							)}

							<div className="mb-8">
								<h3 className="text-xl font-semibold">{plan.name}</h3>
								<p className="mt-2 text-gray-600">{plan.description}</p>
								<p className="mt-6">
									<span className="text-4xl font-bold">¥{plan.price}</span>
									<span className="text-gray-600">/月</span>
								</p>
							</div>

							<ul className="mb-8 space-y-4">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-center gap-3">
										<Check className="h-5 w-5 text-primary" />
										<span className="text-gray-600">{feature}</span>
									</li>
								))}
							</ul>

							<Button
								asChild
								className="w-full"
								variant={plan.popular ? "default" : "outline"}
								size="lg"
							>
								<Link href={plan.href}>{plan.cta}</Link>
							</Button>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
