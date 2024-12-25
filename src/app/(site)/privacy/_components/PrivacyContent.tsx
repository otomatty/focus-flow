"use client";

import { motion } from "framer-motion";

const sections = [
	{
		title: "1. 個人情報の収集",
		content: `Focus Flowは、サービスの提供にあたり、以下の個人情報を収集する場合があります：
    
    • アカウント情報（氏名、メールアドレス等）
    • 利用情報（アクセスログ、利用状況等）
    • 決済情報（クレジットカード情報等）
    
    これらの情報は、サービスの提供、改善、およびカスタマーサポートのために使用されます。`,
	},
	{
		title: "2. 個人情報の利用目的",
		content: `収集した個人情報は、以下の目的で利用されます：
    
    • サービスの提供および運営
    • ユーザーサポートの提供
    • サービスの改善および新機能の開発
    • 利用状況の分析
    • お知らせやアップデート情報の送信
    
    目的外の利用は行わず、法令に基づく場合を除き、第三者への提供は行いません。`,
	},
	{
		title: "3. 個人情報の管理",
		content: `Focus Flowは、収集した個人情報の管理について：
    
    • 適切な安全管理措置を講じます
    • 従業員に対する教育を実施します
    • 定期的な監査を行います
    
    個人情報への不正アクセスや漏洩を防ぐため、必要な対策を講じています。`,
	},
	{
		title: "4. Cookie（クッキー）の使用",
		content: `当サービスでは、ユーザー体験の向上のためにCookieを使用しています：
    
    • セッション管理
    • ユーザー設定の保存
    • アクセス解析
    
    ブラウザの設定でCookieを無効にすることも可能ですが、一部の機能が利用できなくなる場合があります。`,
	},
	{
		title: "5. 個人情報の開示・訂正・削除",
		content: `ユーザーは、自己の個人情報について：
    
    • 開示を請求することができます
    • 訂正を請求することができます
    • 削除を請求することができます
    
    これらの請求は、本人確認を行った上で対応いたします。`,
	},
	{
		title: "6. プライバシーポリシーの変更",
		content: `本プライバシーポリシーの内容は、法令の改正や社会情勢の変化に応じて、予告なく変更す���ことがあります。
    
    変更があった場合は、当サイトでの告知や登録されたメールアドレスへの通知により、ユーザーに周知いたします。`,
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

export function PrivacyContent() {
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
