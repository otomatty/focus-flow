"use client";

import { Clock, ListTodo, LineChart, Bell, Focus, Brain } from "lucide-react";
import { motion } from "framer-motion";

const features = [
	{
		name: "ポモドーロタイマー",
		description:
			"25分の集中作業と5分の休憩を組み合わせた効果的な時間管理手法。カスタマイズ可能な時間設定で、あなたの作業リズムに最適化できます。",
		icon: Clock,
	},
	{
		name: "タスク管理",
		description:
			"直感的なインターフェースで、タスクの作成、編集、優先順位付けが簡単に。プロジェクトごとの整理や期限設定で、効率的なタスク管理を実現します。",
		icon: ListTodo,
	},
	{
		name: "フロー分析",
		description:
			"作業時間、集中度、完了タスクなどのデータを可視化。あなたの生産性パターンを分析し、最適な作業スタイルを見つけ出します。",
		icon: LineChart,
	},
	{
		name: "スマート通知",
		description:
			"作業の中断を最小限に抑えるインテリジェントな通知システム。集中時は通知をブロックし、休憩時に重要な情報をまとめて通知します。",
		icon: Bell,
	},
	{
		name: "フォーカスモード",
		description:
			"作業に集中するための専用モード。不要な通知をブロックし、作業に必要な情報のみを表示することで、深い集中状態を維持します。",
		icon: Focus,
	},
	{
		name: "フローステート分析",
		description:
			"あなたの作業パターンを分析し、最も生産性の高い時間帯や条件を特定。フローステートに入りやすい環境づくりをサポートします。",
		icon: Brain,
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

export function FeaturesList() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

			<div className="container relative mx-auto px-4">
				<motion.div
					className="max-w-2xl mx-auto text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
						すべての機能
					</h2>
					<p className="text-lg text-gray-600">
						Focus Flowが提供する主要な機能をご紹介します。
						すべての機能は、あなたの生産性向上のために設計されています。
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
				>
					{features.map((feature) => (
						<motion.div
							key={feature.name}
							className="group relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
							variants={item}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative">
								<div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-5 group-hover:bg-primary/20 transition-colors">
									<feature.icon className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">{feature.name}</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
