"use client";

import { motion } from "framer-motion";

const sections = [
	{
		title: "1. 利用規約の適用",
		content: `本利用規約（以下「本規約」といいます）は、Focus Flow（以下「当サービス」といいます）の利用に関する条件を、サービスを利用するすべての方（以下「ユーザー」といいます）と当サービスの運営者との間で定めるものです。
    
    ユーザーは、本規約に同意の上、当サービスを利用するものとします。`,
	},
	{
		title: "2. サービスの利用",
		content: `当サービスの利用にあたり、ユーザーは以下の事項を遵守するものとします：
    
    • 登録情報は正確かつ最新の情報を提供すること
    • アカウント情報の管理を適切に行うこと
    • 不正アクセスや不正利用を行わないこと
    • 他のユーザーの利用を妨げる行為を行わないこと
    
    これらに違反した場合、当サービスの利用を制限または停止することがあります。`,
	},
	{
		title: "3. 料金および支払い",
		content: `当サービスの料金プランおよび支払いについて：
    
    • 料金は事前に定められた金額を請求します
    • 支払いは指定された方法で行うものとします
    • 料金の変更がある場合は事前に通知します
    • 返金は原則として行いません
    
    支払い条件の詳細は、料金プランページをご確認ください。`,
	},
	{
		title: "4. 知的財産権",
		content: `当サービスに関する知的財産権について：
    
    • 当サービスに関するすべての権利は当サービスに帰属します
    • ユーザーが作成したコンテンツの権利はユーザーに帰属します
    • 当サービスの無断複製・転載は禁止します
    
    知的財産権の侵害が確認された場合、法的措置を取る場合があります。`,
	},
	{
		title: "5. 免責事項",
		content: `当サービスは以下の事項について免責されるものとします：
    
    • システムの障害や中断によるデータの損失
    • ユーザー間のトラブル
    • 第三者による不正アクセス
    • 天災等の不可抗力による損害
    
    ユーザーは自己の責任において当サービスを利用するものとします。`,
	},
	{
		title: "6. 規約の変更",
		content: `当サービスは、必要に応じて本規約を変更することができます：
    
    • 変更内容は事前に通知します
    • 変更後の利用継続は同意とみなします
    • 重要な変更の場合は、同意を得る場合があります
    
    最新の規約は常に当ページでご確認いただけます。`,
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

export function TermsContent() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

			<div className="container relative mx-auto px-4">
				<motion.div
					className="max-w-3xl mx-auto"
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
				>
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
						{sections.map((section) => (
							<motion.div
								key={section.title}
								className="mb-12 last:mb-0"
								variants={item}
							>
								<h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
								<div className="text-gray-600 whitespace-pre-line">
									{section.content}
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
