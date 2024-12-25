import { Button } from "@/components/ui/button";
import { AnimatedSection } from "./AnimatedSection";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
	{
		name: "無料プラン",
		price: "¥0",
		period: "月",
		description: "個人での利用に最適",
		features: [
			"基本的なポモドーロタイマー",
			"シンプルなタスク管理",
			"基本的な統計情報",
			"1デバイスでの利用",
			"コミュニティサポート",
		],
		cta: {
			text: "無料で始める",
			href: "/auth/signup",
		},
		popular: false,
	},
	{
		name: "Proプラン",
		price: "¥980",
		period: "月",
		description: "より高度な機能が必要なプロフェッショナル向け",
		features: [
			"無料プランの全機能",
			"詳細な分析レポート",
			"カスタマイズ可能なタイマー",
			"複数デバイスでの同期",
			"優先サポート",
			"広告なし",
			"データのエクスポート",
		],
		cta: {
			text: "Pro版を試す",
			href: "/auth/signup?plan=pro",
		},
		popular: true,
	},
];

export function PricingSection() {
	return (
		<section id="pricing" className="py-24 bg-gray-50 scroll-mt-16">
			<div className="container mx-auto px-4">
				<AnimatedSection className="text-center space-y-4 mb-16">
					<h2 className="text-3xl font-bold">料金プラン</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						シンプルで分かりやすい料金体系。必要な機能を必要なだけ。
						いつでもプランを変更できます。
					</p>
				</AnimatedSection>

				<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					{plans.map((plan, index) => (
						<AnimatedSection
							key={plan.name}
							delay={index * 0.2}
							className={`relative p-8 rounded-2xl ${
								plan.popular
									? "bg-blue-600 text-white shadow-lg"
									: "bg-white border shadow-sm"
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-4 right-4 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
									人気
								</div>
							)}

							<div className="space-y-6">
								<div className="space-y-2">
									<h3 className="text-xl font-semibold">{plan.name}</h3>
									<div className="flex items-baseline gap-1">
										<span className="text-4xl font-bold">{plan.price}</span>
										<span
											className={
												plan.popular ? "text-blue-200" : "text-gray-500"
											}
										>
											/{plan.period}
										</span>
									</div>
									<p
										className={plan.popular ? "text-blue-200" : "text-gray-600"}
									>
										{plan.description}
									</p>
								</div>

								<ul className="space-y-3">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-center gap-3">
											<Check
												className={`w-5 h-5 ${
													plan.popular ? "text-blue-300" : "text-green-600"
												}`}
											/>
											<span>{feature}</span>
										</li>
									))}
								</ul>

								<Button
									asChild
									className={`w-full ${
										plan.popular
											? "bg-white text-blue-600 hover:bg-blue-50"
											: ""
									}`}
									variant={plan.popular ? "default" : "outline"}
								>
									<Link href={plan.cta.href}>{plan.cta.text}</Link>
								</Button>
							</div>
						</AnimatedSection>
					))}
				</div>

				<AnimatedSection
					delay={0.4}
					className="mt-12 text-center text-gray-600 max-w-2xl mx-auto"
				>
					<p className="text-sm">
						※ すべてのプランは14日間の返金保証付きです。
						Pro版は7日間の無料トライアルが可能です。
					</p>
				</AnimatedSection>
			</div>
		</section>
	);
}
