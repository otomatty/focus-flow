import type { Metadata } from "next";
import { PrivacyHero } from "./_components/PrivacyHero";
import { PrivacyContent } from "./_components/PrivacyContent";

export const metadata: Metadata = {
	title: "プライバシーポリシー | Focus Flow",
	description:
		"Focus Flowのプライバシーポリシー。ユーザーの個人情報の取り扱いについて、明確かつ透明性のある形で説明しています。",
	openGraph: {
		title: "プライバシーポリシー | Focus Flow",
		description:
			"Focus Flowのプライバシーポリシー。ユーザーの個人情報の取り扱いについて、明確かつ透明性のある形で説明しています。",
		images: [
			{
				url: `/api/og?title=${encodeURIComponent(
					"プライバシーポリシー",
				)}&mode=privacy`,
				width: 1200,
				height: 630,
				alt: "Focus Flow - プライバシーポリシー",
			},
		],
	},
};

export default function PrivacyPage() {
	return (
		<main>
			<PrivacyHero />
			<PrivacyContent />
		</main>
	);
}
