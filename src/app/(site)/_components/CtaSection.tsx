import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "./AnimatedSection";

export function CtaSection() {
	return (
		<section className="relative py-24 overflow-hidden">
			{/* 背景のグラデーション */}
			<div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-gray-50 to-gray-50/50 dark:from-gray-900/50 dark:via-gray-900 dark:to-gray-900/50" />

			{/* デコレーション要素 */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-30 dark:opacity-20">
					<div className="absolute inset-0 rotate-45 scale-150 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-3xl" />
				</div>
			</div>

			<div className="container relative px-4 mx-auto">
				<AnimatedSection className="max-w-4xl mx-auto text-center space-y-8">
					<div className="inline-flex items-center space-x-1 rounded-full bg-primary/10 dark:bg-primary/20 px-3 py-1">
						<Star className="w-4 h-4 text-primary" />
						<span className="text-sm font-medium text-primary">
							14日間無料トライアル
						</span>
					</div>

					<div className="space-y-4">
						<h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100">
							あなたの成長の物語を、
							<br className="hidden sm:block" />
							今日から始めましょう
						</h2>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Focus Flowと共に、理想の自分への一歩を踏み出しませんか？
							<br className="hidden sm:block" />
							クレジットカード不要で、すぐに始められます。
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<Button asChild size="lg" className="w-full sm:w-auto text-base">
							<Link href="/auth/login" className="space-x-2">
								<span>無料で始める</span>
								<ArrowRight className="w-4 h-4" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="w-full sm:w-auto text-base"
						>
							<Link href="/features">機能詳細を見る</Link>
						</Button>
					</div>

					<p className="text-sm text-muted-foreground pt-4">
						* 無料プランは個人利用に最適です。チームでの利用をご検討の場合は
						<Link href="/pricing" className="text-primary hover:underline">
							料金プラン
						</Link>
						をご確認ください。
					</p>
				</AnimatedSection>
			</div>
		</section>
	);
}
