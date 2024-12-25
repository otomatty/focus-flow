import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "./AnimatedSection";

const faqs = [
	{
		question: "ポモドーロテクニックとは何ですか？",
		answer:
			"25分の集中作業と5分の休憩を交互に行う時間管理手法です。この手法により、効率的に作業を進めることができます。科学的な研究に基づいており、集中力の維持と生産性の向上に効果的です。",
	},
	{
		question: "無料プランでも十分に使えますか？",
		answer:
			"はい、基本的な機能は全て無料でご利用いただけます。ポモドーロタイマー、基本的なタスク管理、シンプルな統計情報など、生産性向上に必要な主要な機能を提供しています。より高度な機能が必要な場合はProプランをお試しください。",
	},
	{
		question: "モバイルアプリはありますか？",
		answer:
			"現在はWebアプリのみのご提供ですが、近日中にiOS/Androidアプリのリリースを予定しています。Webアプリは全てのデバイスでレスポンシブ対応しており、モバイルブラウザでも快適にご利用いただけます。",
	},
	{
		question: "プランはいつでも変更できますか？",
		answer:
			"はい、いつでもプランの変更が可能です。アップグレードは即時反映され、ダウングレードは次の請求期間から適用されます。また、Pro版は7日間の無料トライアルをご用意しています。",
	},
	{
		question: "データのエクスポートは可能ですか？",
		answer:
			"Proプランでは、タスクデータや作業統計を CSV 形式でエクスポートできます。無料プランでは基本的な統計情報の閲覧のみ可能です。",
	},
	{
		question: "複数のデバイスで同期できますか？",
		answer:
			"Proプランでは、複数のデバイス間でデータを完全に同期できます。無料プランは1つのデバイスでの利用に限定されています。",
	},
];

export function FaqSection() {
	return (
		<section id="faq" className="py-24 scroll-mt-16">
			<div className="container mx-auto px-4">
				<AnimatedSection className="text-center space-y-4 mb-16">
					<h2 className="text-3xl font-bold">よくある質問</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Focus Flowについてよく寄せられる質問をまとめました。
						お探しの答えが見つからない場合は、お気軽にお問い合わせください。
					</p>
				</AnimatedSection>

				<div className="max-w-3xl mx-auto">
					<Accordion type="single" collapsible>
						{faqs.map((faq, index) => (
							<AnimatedSection key={faq.question} delay={index * 0.1}>
								<AccordionItem value={`item-${index}`}>
									<AccordionTrigger className="text-left">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="text-gray-600">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							</AnimatedSection>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
