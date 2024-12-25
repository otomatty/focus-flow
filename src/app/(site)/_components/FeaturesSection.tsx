import { AnimatedSection } from "./AnimatedSection";
import { Timer, ListTodo, BarChart3, Bell, Target, Trophy } from "lucide-react";

const features = [
	{
		icon: Timer,
		title: "ポモドーロタイマー",
		description:
			"25分の作業と5分の休憩を交互に行うポモドーロテクニックを簡単に実践できます。",
	},
	{
		icon: ListTodo,
		title: "タスク管理",
		description:
			"タスクの作成、編集、完了管理が簡単にできます。優先順位をつけて効率的に作業を進めましょう。",
	},
	{
		icon: BarChart3,
		title: "統計分析",
		description:
			"作業時間や完了タスクの統計を確認できます。データに基づいて生産性を改善しましょう。",
	},
	{
		icon: Bell,
		title: "リマインダー",
		description:
			"タスクの期限が近づくとリマインダーで通知。大切な締め切りを逃しません。",
	},
	{
		icon: Target,
		title: "目標設定",
		description:
			"日次・週次・月次の目標を設定し、進捗を追跡。目標達成をサポートします。",
	},
	{
		icon: Trophy,
		title: "実績システム",
		description:
			"目標達成や継続的な利用でバッジを獲得。モチベーション維持をゲーミフィケーションで支援します。",
	},
];

export function FeaturesSection() {
	return (
		<section id="features" className="py-24 scroll-mt-16">
			<div className="container mx-auto px-4">
				<AnimatedSection className="text-center space-y-4 mb-16">
					<h2 className="text-3xl font-bold">主な機能</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Focus Flowは、あなたの生産性を最大限に引き出すための
						包括的な機能セットを提供します
					</p>
				</AnimatedSection>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{features.map((feature, index) => (
						<AnimatedSection
							key={feature.title}
							delay={index * 0.1}
							className="group relative p-8 rounded-2xl bg-white hover:bg-blue-50 transition-colors border hover:border-blue-200"
						>
							<div className="absolute top-8 right-8">
								<feature.icon className="w-6 h-6 text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity" />
							</div>
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">{feature.title}</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						</AnimatedSection>
					))}
				</div>
			</div>
		</section>
	);
}
