"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
	{
		question: "無料プランと有料プランの主な違いは何ですか？",
		answer:
			"無料プランでは基本的なポモドーロタイマーとタスク管理機能をご利用いただけます。有料プランでは、カスタマイズ可能なタイマー設定、詳細な分析機能、無制限のプロジェクト作成、フォーカスモードなど、より高度な機能をご利用いただけます。",
	},
	{
		question: "プランはいつでも変更できますか？",
		answer:
			"はい、プランはいつでも変更可能です。アップグレードの場合は即時反映され、ダウングレードの場合は現在の請求期間の終了時に反映されます。プラン変更による日割り計算も自動で行われます。",
	},
	{
		question: "支払い方法は何がありますか？",
		answer:
			"クレジットカード（Visa、Mastercard、American Express）、デビットカード、PayPalでのお支払いに対応しています。法人のお客様には請求書でのお支払いも承っております。",
	},
	{
		question: "無料トライアルはありますか？",
		answer:
			"はい、Pro プランと Team プランには14日間の無料トライアル期間があります。トライアル期間中は、プランの全機能をご利用いただけます。クレジットカードの登録は不要で、トライアル期間中のキャンセルも可能です。",
	},
	{
		question: "チームプランのメンバー数に制限はありますか？",
		answer:
			"チームプランの基本料金には5名までのメンバーが含まれています。追加メンバーは1名あたり月額500円でご利用いただけます。大規模なチームでのご利用については、カスタムプランをご用意しておりますので、お問い合わせください。",
	},
	{
		question: "解約はいつでもできますか？",
		answer:
			"はい、解約はいつでも可能です。解約���は現在の請求期間の終了まで、プランの機能をご利用いただけます。解約による返金は行っておりませんが、日割り計算された未使用分は次回の請求額から差し引かれます。",
	},
];

export function PricingFaq() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

			<div className="container relative mx-auto px-4">
				<motion.div
					className="max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
							よくある質問
						</h2>
						<p className="text-lg text-gray-600">
							料金プランについてよくいただく質問をまとめました。
							<br />
							その他のご質問は、お気軽にお問い合わせください。
						</p>
					</div>

					<motion.div
						className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
						variants={{
							hidden: { opacity: 0 },
							show: {
								opacity: 1,
								transition: {
									staggerChildren: 0.1,
								},
							},
						}}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
					>
						<Accordion type="single" collapsible className="w-full">
							{faqs.map((faq, index) => (
								<motion.div
									key={index}
									variants={{
										hidden: { opacity: 0, x: -20 },
										show: { opacity: 1, x: 0 },
									}}
								>
									<AccordionItem value={`item-${index}`}>
										<AccordionTrigger className="text-left">
											{faq.question}
										</AccordionTrigger>
										<AccordionContent className="text-gray-600">
											{faq.answer}
										</AccordionContent>
									</AccordionItem>
								</motion.div>
							))}
						</Accordion>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
