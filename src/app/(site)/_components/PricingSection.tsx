import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "./AnimatedSection";
import Link from "next/link";

interface PricingPlan {
	name: string;
	description: string;
	price: string;
	features: string[];
	buttonText: string;
	isPopular?: boolean;
}

const pricingPlans: PricingPlan[] = [
	{
		name: "ベーシック",
		description: "個人での利用に最適なプラン",
		price: "無料",
		features: [
			"基本的なタスク管理",
			"ポモドーロタイマー",
			"シンプルな統計",
			"3つまでのプロジェクト作成",
			"基本的なAIアシスタント",
		],
		buttonText: "無料で始める",
	},
	{
		name: "プロ",
		description: "より高度な機能が必要な方向けのプラン",
		price: "¥980/月",
		features: [
			"無制限のタスク管理",
			"詳細な分析レポート",
			"無制限のプロジェクト作成",
			"高度なAIアシスタント",
			"カスタマイズ可能なダッシュボード",
			"優先サポート",
			"チーム共有機能（最大5人）",
		],
		buttonText: "プロプランを試す",
		isPopular: true,
	},
	{
		name: "エンタープライズ",
		description: "大規模なチームや組織向けのプラン",
		price: "お問い合わせ",
		features: [
			"プロプランの全機能",
			"無制限のチームメンバー",
			"カスタムインテグレーション",
			"専任サポートマネージャー",
			"SLA保証",
			"オンボーディングサポート",
			"カスタムトレーニング",
		],
		buttonText: "お問い合わせ",
	},
];

export function PricingSection() {
	return (
		<section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
			<div className="container px-4 mx-auto">
				<AnimatedSection className="text-center space-y-4 mb-16">
					<h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
						シンプルな料金プラン
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						あなたのニーズに合わせて、最適なプランをお選びください。
						<br className="hidden sm:block" />
						いつでもプランの変更が可能です。
					</p>
				</AnimatedSection>

				<div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{pricingPlans.map((plan, index) => (
						<AnimatedSection
							key={plan.name}
							className="relative"
							delay={index * 0.1}
						>
							<Card
								className={`relative h-full overflow-hidden backdrop-blur-sm ${
									plan.isPopular
										? "border-2 border-primary shadow-lg dark:bg-gray-800/40"
										: "border border-border/50 dark:bg-gray-800/30"
								}`}
							>
								{plan.isPopular && (
									<>
										<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />
										<div className="absolute top-4 left-4 inline-flex items-center">
											<div className="flex items-center space-x-1 rounded-full bg-primary/10 dark:bg-primary/20 px-2 py-1">
												<div className="h-1.5 w-1.5 rounded-full bg-primary" />
												<span className="text-xs font-medium text-primary">
													人気のプラン
												</span>
											</div>
										</div>
									</>
								)}
								<div className="flex flex-col h-full pt-12">
									<div className="px-8 pb-0 space-y-6">
										<div>
											<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
												{plan.name}
											</h3>
											<p className="mt-2 text-muted-foreground">
												{plan.description}
											</p>
										</div>
										<div className="space-y-1">
											<span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
												{plan.price}
											</span>
											{plan.price !== "お問い合わせ" && (
												<span className="text-muted-foreground ml-1">/月</span>
											)}
										</div>
										<ul className="space-y-3">
											{plan.features.map((feature) => (
												<li
													key={feature}
													className="flex items-center text-gray-600 dark:text-gray-300"
												>
													<div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-3">
														<Check className="h-3 w-3 text-primary" />
													</div>
													<span>{feature}</span>
												</li>
											))}
										</ul>
									</div>
									<div className="p-8 pt-6 mt-auto">
										<Button
											className={`w-full h-11 text-sm font-medium transition-all ${
												plan.isPopular
													? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
													: "bg-background hover:bg-accent dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-border dark:border-gray-700 text-foreground dark:text-gray-100"
											}`}
											asChild
										>
											<Link
												href={
													plan.name === "ベーシック"
														? "/auth/login"
														: plan.name === "プロ"
															? "/subscribe"
															: "/contact"
												}
											>
												{plan.buttonText}
											</Link>
										</Button>
									</div>
								</div>
							</Card>
						</AnimatedSection>
					))}
				</div>

				<AnimatedSection className="text-center mt-16">
					<p className="text-sm text-muted-foreground">
						すべてのプランに14日間の無料トライアル期間が付きます。
						<br />
						クレジットカードは不要です。
					</p>
				</AnimatedSection>
			</div>
		</section>
	);
}
