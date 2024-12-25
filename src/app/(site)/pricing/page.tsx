import type { Metadata } from "next";
import { PricingHero } from "./_components/PricingHero";
import { PricingPlans } from "./_components/PricingPlans";
import { PricingFaq } from "./_components/PricingFaq";
import { PricingCta } from "./_components/PricingCta";

export const metadata: Metadata = {
	title: "料金プラン | Focus Flow",
	description:
		"Focus Flowの料金プランをご紹介。個人利用から企業利用まで、柔軟なプランをご用意しています。全てのプランで14日間の無料トライアルをご利用いただけます。",
	openGraph: {
		title: "料金プラン | Focus Flow",
		description:
			"Focus Flowの料金プランをご紹介。個人利用から企業利用まで、柔軟なプランをご用意しています。全てのプランで14日間の無料トライアルをご利用いただけます。",
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("料金プラン")}&mode=pricing`,
				width: 1200,
				height: 630,
				alt: "Focus Flow - 料金プラン",
			},
		],
	},
};

export default function PricingPage() {
	return (
		<main>
			<PricingHero />
			<PricingPlans />
			<PricingFaq />
			<PricingCta />
		</main>
	);
}
