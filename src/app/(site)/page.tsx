import type { Metadata } from "next";
import { HeroSection } from "./_components/HeroSection";
import { FeaturesSection } from "./_components/FeaturesSection";
import { PricingSection } from "./_components/PricingSection";
import { FaqSection } from "./_components/FaqSection";
import { CtaSection } from "./_components/CtaSection";

export const metadata: Metadata = {
	title: {
		absolute: "Focus Flow - 生産性を最大化するタスク管理ツール",
	},
	description:
		"Focus Flowは、フォーカスモードとフローステートを活用して、あなたの生産性を最大限に引き出すタスク管理ツールです。",
	openGraph: {
		title: "Focus Flow - 生産性を最大化するタスク管理ツール",
		description:
			"Focus Flowは、フォーカスモードとフローステートを活用して、あなたの生産性を最大限に引き出すタスク管理ツールです。",
		images: [
			{
				url: `/api/og?title=${encodeURIComponent(
					"生産性を最大化する\nタスク管理ツール",
				)}&mode=home`,
				width: 1200,
				height: 630,
				alt: "Focus Flow - ホーム",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Focus Flow - 生産性を最大化するタスク管理ツール",
		description:
			"Focus Flowは、フォーカスモードとフローステートを活用して、あなたの生産性を最大限に引き出すタスク管理ツールです。",
		images: [
			`/api/og?title=${encodeURIComponent(
				"生産性を最大化する\nタスク管理ツール",
			)}&mode=home`,
		],
	},
};

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<FeaturesSection />
			<PricingSection />
			<FaqSection />
			<CtaSection />
		</>
	);
}
