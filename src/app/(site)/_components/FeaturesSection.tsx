"use client";

import { AnimatedSection } from "./AnimatedSection";
import {
	Brain,
	Target,
	Sparkles,
	Timer,
	BookOpen,
	Repeat,
	Users,
	LineChart,
	Star,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

interface Feature {
	icon: any;
	title: string;
	description: string;
	details: {
		benefits: string[];
		comingSoon: string[];
	};
	bgGradient: string;
	accentColor: string;
}

const features = [
	{
		icon: Brain,
		title: "AIアシスタント",
		description:
			"あなたの行動パターンを学習し、最適な時間管理と目標達成のための提案を行います。パーソナライズされたアドバイスで、効率的な成長をサポートします。",
		details: {
			benefits: [
				"24時間365日のパーソナルアシスタント",
				"行動パターンの学習と最適化",
				"タスクの優先順位付けサポート",
				"集中時間の最適化提案",
			],
			comingSoon: ["音声アシスタント機能", "マルチモーダルAI対応"],
		},
		bgGradient: "from-purple-500/20 to-indigo-500/20",
		accentColor: "text-indigo-600",
	},
	{
		icon: Target,
		title: "目標達成システム",
		description:
			"大きな目標を小さなタスクに分解し、着実に達成へと導きます。プロジェクト管理からデイリータスクまで、体系的な目標管理を実現します。",
		details: {
			benefits: [
				"目標の階層化と分解",
				"マイルストーン管理",
				"進捗トラッキング",
				"達成度の可視化",
			],
			comingSoon: ["AIによる目標提案", "チーム目標の連携"],
		},
		bgGradient: "from-blue-500/20 to-cyan-500/20",
		accentColor: "text-blue-600",
	},
	{
		icon: Timer,
		title: "集中タイマー",
		description:
			"ポモドーロテクニックとAIが連携し、最適な作業と休憩のバランスを提案。集中力を最大化し、効率的な作業を実現します。",
		details: {
			benefits: [
				"カスタマイズ可能なタイマー",
				"集中度のリアルタイム分析",
				"最適な休憩時間の提案",
				"BGM/ホワイトノイズ機能",
			],
			comingSoon: ["バイオリズム連携", "VRモード"],
		},
		bgGradient: "from-green-500/20 to-emerald-500/20",
		accentColor: "text-emerald-600",
	},
	{
		icon: Sparkles,
		title: "ゲーム機能",
		description:
			"日々の努力が目に見える形で成長につながります。経験値獲得、レベルアップ、実績システムで、継続的なモチベーション維持をサポートします。",
		details: {
			benefits: [
				"経験値システム",
				"実績バッジコレクション",
				"デイリーチャレンジ",
				"ランキングシステム",
			],
			comingSoon: ["カスタムアバター", "協力クエスト"],
		},
		bgGradient: "from-yellow-500/20 to-orange-500/20",
		accentColor: "text-orange-600",
	},
	{
		icon: BookOpen,
		title: "ナレッジベース",
		description:
			"アイデアや知識を整理し、関連付けて管理できます。マークダウン対応のノートで、あなたの知識を体系的に蓄積します。",
		details: {
			benefits: [
				"リッチテキストエディタ",
				"知識の関連付け",
				"タグ管理システム",
				"検索機能",
			],
			comingSoon: ["AI要約機能", "マインドマップ統合"],
		},
		bgGradient: "from-pink-500/20 to-rose-500/20",
		accentColor: "text-rose-600",
	},
	{
		icon: Repeat,
		title: "習慣形成",
		description:
			"理想の習慣を設定し、継続的な実践をサポート。進捗の可視化と達成度分析で、着実な成長を実感できます。",
		details: {
			benefits: [
				"習慣トラッキング",
				"ストリーク記録",
				"習慣の連鎖分析",
				"リマインダー設定",
			],
			comingSoon: ["習慣予測AI", "ソーシャルチャレンジ"],
		},
		bgGradient: "from-violet-500/20 to-purple-500/20",
		accentColor: "text-violet-600",
	},
	{
		icon: Users,
		title: "コミュニティ",
		description:
			"同じ目標を持つ仲間と繋がり、互いの成長を支援。進捗の共有やディスカッションで、モチベーションを高め合えます。",
		details: {
			benefits: [
				"目標別グループ作成",
				"進捗共有機能",
				"相互応援システム",
				"グループチャレンジ",
			],
			comingSoon: ["メンター制度", "オンラインイベント"],
		},
		bgGradient: "from-teal-500/20 to-green-500/20",
		accentColor: "text-teal-600",
	},
	{
		icon: LineChart,
		title: "成長分析",
		description:
			"あなたの成�プロセスを多角的に分析。データに基づく洞察で、より効果的な成長戦略を提案します。",
		details: {
			benefits: [
				"詳細な統計分析",
				"成長曲線の可視化",
				"パフォーマンス予測",
				"カスタムレポート",
			],
			comingSoon: ["AIによる改善提案", "ビッグデータ分析"],
		},
		bgGradient: "from-cyan-500/20 to-blue-500/20",
		accentColor: "text-cyan-600",
	},
];

function MobileFeatureDetails({ feature }: { feature: Feature }) {
	return (
		<div className="px-4 pb-8">
			<div className="space-y-6">
				<div>
					<h3 className="flex items-center text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
						<Star className="w-4 h-4 mr-2 text-yellow-500" />
						主な機能
					</h3>
					<ul className="grid grid-cols-1 gap-2">
						{feature.details.benefits.map((benefit, index) => (
							<li
								key={index}
								className="flex items-start space-x-3 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2"
							>
								<div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400 flex-shrink-0" />
								<span className="text-sm">{benefit}</span>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h3 className="flex items-center text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
						<Sparkles className="w-4 h-4 mr-2 text-purple-500" />
						Coming Soon
					</h3>
					<ul className="grid grid-cols-1 gap-2">
						{feature.details.comingSoon.map((item, index) => (
							<li
								key={index}
								className="flex items-start space-x-3 text-gray-600 dark:text-gray-300 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-2"
							>
								<div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
								<span className="text-sm">{item}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

function FeatureCard({
	feature,
	isExpanded,
	onClick,
}: { feature: Feature; isExpanded: boolean; onClick: () => void }) {
	const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

	if (isMobile) {
		return (
			<Drawer>
				<DrawerTrigger asChild>
					<motion.div
						whileTap={{ scale: 0.98 }}
						className="group cursor-pointer relative p-3 rounded-xl transition-all duration-300 border hover:border-transparent
							h-[72px] flex flex-col bg-white dark:bg-gray-800"
					>
						<div className="flex items-center space-x-3">
							<div className="p-2 rounded-lg transition-colors flex-shrink-0 bg-white/80 dark:bg-gray-700/80">
								<feature.icon className={`w-5 h-5 ${feature.accentColor}`} />
							</div>
							<h3 className="text-base font-semibold line-clamp-1 text-gray-900 dark:text-gray-100">
								{feature.title}
							</h3>
						</div>
					</motion.div>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-lg">
						<div
							className={`p-4 bg-gradient-to-br ${feature.bgGradient} dark:bg-opacity-10`}
						>
							<DrawerTitle className="sr-only">
								{feature.title}の詳細情報
							</DrawerTitle>
							<div className="flex items-center space-x-3 mb-4">
								<div className="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90">
									<feature.icon className={`w-5 h-5 ${feature.accentColor}`} />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									{feature.title}
								</h3>
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
								{feature.description}
							</p>
							<MobileFeatureDetails feature={feature} />
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<motion.div
			whileHover={{ scale: isExpanded ? 1 : 1.02, y: isExpanded ? 0 : -5 }}
			whileTap={{ scale: 0.98 }}
			className={`group cursor-pointer relative p-3 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 border hover:border-transparent
				h-[72px] sm:h-[200px] flex flex-col
				${
					isExpanded
						? `bg-gradient-to-br ${feature.bgGradient} shadow-lg border-transparent dark:bg-opacity-10`
						: "bg-white hover:bg-gradient-to-br hover:shadow-xl hover:bg-opacity-50 dark:bg-gray-800 dark:hover:bg-opacity-90"
				} ${feature.bgGradient}`}
			onClick={onClick}
		>
			<div className="flex items-center space-x-3">
				<div
					className={`p-2 rounded-lg transition-colors flex-shrink-0 
					${
						isExpanded
							? "bg-white/90 shadow-md dark:bg-gray-800/90"
							: "bg-white/80 group-hover:bg-white/90 backdrop-blur-sm dark:bg-gray-700/80 dark:group-hover:bg-gray-700/90"
					}`}
				>
					<feature.icon
						className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.accentColor}`}
					/>
				</div>
				<h3
					className={`text-base sm:text-xl font-semibold line-clamp-1
					${
						isExpanded
							? "text-gray-800 dark:text-gray-100"
							: "text-gray-900 group-hover:text-gray-800 dark:text-gray-100 dark:group-hover:text-white"
					}`}
				>
					{feature.title}
				</h3>
			</div>
			<p
				className={`hidden sm:block text-sm leading-relaxed line-clamp-4 mt-4
				${
					isExpanded
						? "text-gray-700 dark:text-gray-200"
						: "text-gray-600 group-hover:text-gray-700 dark:text-gray-300 dark:group-hover:text-gray-200"
				}`}
			>
				{feature.description}
			</p>
			<div
				className={`absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-offset-2 dark:ring-offset-gray-900 transition-all duration-300
				${
					isExpanded
						? `ring-${feature.accentColor.replace("text-", "")} ring-opacity-50`
						: "ring-transparent"
				}`}
			/>
		</motion.div>
	);
}

function FeatureDetails({
	feature,
	index,
}: { feature: Feature; index: number }) {
	const isFirstRow = index < 2;
	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.3 }}
			className={`col-span-2 lg:col-span-4 bg-gradient-to-br ${feature.bgGradient} rounded-xl sm:rounded-2xl p-4 sm:p-8 overflow-hidden dark:bg-opacity-10`}
			style={{
				gridRow: isFirstRow ? 2 : 4,
				order: isFirstRow ? index + 4 : index + 4,
			}}
		>
			<div className="max-w-7xl mx-auto grid sm:grid-cols-2 gap-4 sm:gap-8">
				<div>
					<h3 className="flex items-center text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
						<Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
						主な機能
					</h3>
					<ul className="grid grid-cols-1 gap-2 sm:gap-3">
						{feature.details.benefits.map((benefit, index) => (
							<li
								key={index}
								className="flex items-start space-x-3 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 sm:p-3"
							>
								<div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400 flex-shrink-0" />
								<span className="text-sm sm:text-base">{benefit}</span>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h3 className="flex items-center text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
						<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500" />
						Coming Soon
					</h3>
					<ul className="grid grid-cols-1 gap-2 sm:gap-3">
						{feature.details.comingSoon.map((item, index) => (
							<li
								key={index}
								className="flex items-start space-x-3 text-gray-600 dark:text-gray-300 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-2 sm:p-3"
							>
								<div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
								<span className="text-sm sm:text-base">{item}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</motion.div>
	);
}

export function FeaturesSection() {
	const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

	const handleFeatureClick = (title: string) => {
		if (window.innerWidth < 640) return; // モバイルでは展開機能を無効化
		setExpandedFeature(expandedFeature === title ? null : title);
	};

	return (
		<section
			id="features"
			className="py-12 sm:py-24 scroll-mt-16 bg-gray-50 dark:bg-gray-900"
		>
			<div className="container mx-auto px-4">
				<AnimatedSection className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16">
					<h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
						あなたの成長を支える、8つの機能
					</h2>
					<p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Focus Flowは、目標達成から習慣形成まで、
						<br className="hidden md:block" />
						あなたの継続的な成長をトータルでサポートします
					</p>
				</AnimatedSection>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-min gap-2 sm:gap-6 max-w-7xl mx-auto">
					{features.map((feature, index) => (
						<AnimatedSection key={feature.title} delay={index * 0.1}>
							<FeatureCard
								feature={feature}
								isExpanded={expandedFeature === feature.title}
								onClick={() => handleFeatureClick(feature.title)}
							/>
						</AnimatedSection>
					))}
					<AnimatePresence>
						{expandedFeature && (
							<FeatureDetails
								feature={
									features.find((f) => f.title === expandedFeature) ??
									features[0]
								}
								index={features.findIndex((f) => f.title === expandedFeature)}
							/>
						)}
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}
