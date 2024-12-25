import type { Metadata } from "next";
import { FeaturesHero } from "./_components/FeaturesHero";
import { FeaturesList } from "./_components/FeaturesList";
import { UseCases } from "./_components/UseCases";
import { FeaturesCta } from "./_components/FeaturesCta";

export const metadata: Metadata = {
	title: "機能紹介",
	description:
		"Focus Flowの主要な機能をご紹介。タスク管理、フォーカスモード、フローステート分析など、生産性を向上させる機能が満載です。",
	openGraph: {
		title: "機能紹介 | Focus Flow",
		description:
			"Focus Flowの主要な機能をご紹介。タスク管理、フォーカスモード、フローステート分析など、生産性を向上させる機能が満載です。",
		images: [
			{
				url: `/api/og?title=${encodeURIComponent(
					"Focus Flowの機能",
				)}&mode=features`,
				width: 1200,
				height: 630,
				alt: "Focus Flow - 機能紹介",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "機能紹介 | Focus Flow",
		description:
			"Focus Flowの主要な機能をご紹介。タスク管理、フォーカスモード、フローステート分析など、生産性を向上させる機能が満載です。",
		images: [
			`/api/og?title=${encodeURIComponent("Focus Flowの機能")}&mode=features`,
		],
	},
};

export default function FeaturesPage() {
	return (
		<>
			<FeaturesHero />
			<FeaturesList />
			<UseCases />
			<FeaturesCta />
		</>
	);
}
