"use client";

import { Mail, MessageCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const contactInfo = [
	{
		title: "メールでのお問い合わせ",
		description: "24時間365日受付。通常2営業日以内に返信いたします。",
		icon: Mail,
		action: "support@focus-flow.app",
	},
	{
		title: "チャットサポート",
		description: "平日10:00-18:00の間、リアルタイムでご対応いたします。",
		icon: MessageCircle,
		action: "チャットを開く",
	},
	{
		title: "対応時間",
		description: "返信は平日10:00-18:00の間に行っております。",
		icon: Clock,
		action: "営業時間の詳細",
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

export function ContactInfo() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

			<div className="container relative mx-auto px-4">
				<motion.div
					className="max-w-2xl mx-auto text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
						お問い合わせ方法
					</h2>
					<p className="text-lg text-gray-600">
						以下の方法からお好きな方法でお問い合わせください。
						<br />
						できる限り迅速な対応を心がけております。
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
				>
					{contactInfo.map((info) => (
						<motion.div
							key={info.title}
							className="group relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
							variants={item}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative">
								<div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-5 group-hover:bg-primary/20 transition-colors">
									<info.icon className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">{info.title}</h3>
								<p className="text-gray-600 mb-4">{info.description}</p>
								<p className="text-primary font-medium">{info.action}</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
