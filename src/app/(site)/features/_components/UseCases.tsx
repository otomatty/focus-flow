"use client";

import { Code2, Pencil, BookOpen, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const useCases = [
	{
		title: "プログラミング",
		description:
			"深い集中が必要なコーディング作業に最適。ポモドーロタイマーとフォーカスモードで、効率的な開発作業を実現します。",
		icon: Code2,
	},
	{
		title: "クリエイティブワーク",
		description:
			"デザインや執筆作業でのフローステートをサポート。作業の中断を防ぎ、創造性を最大限に引き出します。",
		icon: Pencil,
	},
	{
		title: "学習・研究",
		description:
			"効果的な学習セッションの管理に。集中時間の記録と分析で、最適な学習パターンを見つけ出します。",
		icon: BookOpen,
	},
	{
		title: "ビジネス作業",
		description:
			"会議や締め切り管理、タスク整理に。スマート通知で重要な予定を逃さず、効率的な業務遂行を支援します。",
		icon: Briefcase,
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
	hidden: { opacity: 0, x: -20 },
	show: { opacity: 1, x: 0 },
};

export function UseCases() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
				<motion.div
					className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
					initial={{ opacity: 0, scale: 0.5 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1 }}
				/>
				<motion.div
					className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
					initial={{ opacity: 0, scale: 0.5 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1, delay: 0.2 }}
				/>
			</div>

			<div className="container relative mx-auto px-4">
				<motion.div
					className="max-w-2xl mx-auto text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
						活用シーン
					</h2>
					<p className="text-lg text-gray-600">
						Focus Flowは、さまざまな作業シーンで活用できます。
						あなたの作業スタイルに合わせて、最適な使い方を見つけてください。
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 gap-8 sm:grid-cols-2"
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
				>
					{useCases.map((useCase) => (
						<motion.div
							key={useCase.title}
							className="group relative"
							variants={item}
						>
							<div className="flex gap-6 items-start p-8 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
								<div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
									<useCase.icon className="h-6 w-6 text-primary" />
								</div>
								<div>
									<h3 className="text-xl font-semibold mb-3">
										{useCase.title}
									</h3>
									<p className="text-gray-600">{useCase.description}</p>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
