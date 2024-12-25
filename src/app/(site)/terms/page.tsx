import type { Metadata } from "next";
import { TermsHero } from "./_components/TermsHero";
import { TermsContent } from "./_components/TermsContent";

export const metadata: Metadata = {
	title: "利用規約 | Focus Flow",
	description:
		"Focus Flowの利用規約。サービスの利用条件、ユーザーの権利と義務、免責事項などについて説明しています。",
	openGraph: {
		title: "利用規約 | Focus Flow",
		description:
			"Focus Flowの利用規約。サービスの利用条件、ユーザーの権利と義務、免責事項などについて説明しています。",
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("利用規約")}&mode=terms`,
				width: 1200,
				height: 630,
				alt: "Focus Flow - 利用規約",
			},
		],
	},
};

export default function TermsPage() {
	return (
		<main>
			<TermsHero />
			<TermsContent />
		</main>
	);
}
