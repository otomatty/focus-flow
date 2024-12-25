import { Button } from "@/components/ui/button";
import { AnimatedSection } from "./AnimatedSection";
import Link from "next/link";

export function CtaSection() {
	return (
		<section className="relative py-24">
			{/* 背景のグラデーション */}
			<div className="absolute inset-0 bg-blue-600" />

			{/* 装飾的な背景要素 */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
				<div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
			</div>

			<div className="relative container mx-auto px-4 text-center space-y-8">
				<AnimatedSection className="space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold text-white">
						今すぐ生産性を向上させましょう
					</h2>
					<p className="text-xl text-blue-100 max-w-2xl mx-auto">
						Focus Flowを使って、より効率的な作業習慣を身につけまし���う。
						まずは無料で始めてみませんか？
					</p>
				</AnimatedSection>

				<AnimatedSection delay={0.2} className="flex justify-center gap-4">
					<Button
						asChild
						size="lg"
						className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8"
					>
						<Link href="/auth/signup">無料で始める</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="text-white border-white hover:bg-blue-700 rounded-full px-8"
					>
						<Link href="/contact">お問い合わせ</Link>
					</Button>
				</AnimatedSection>

				<AnimatedSection delay={0.4} className="text-blue-100">
					<p>
						14日間の返金保証付き。
						<br className="md:hidden" />
						クレジットカードは必要ありません。
					</p>
				</AnimatedSection>
			</div>
		</section>
	);
}
