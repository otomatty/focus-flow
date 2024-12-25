import type { Metadata } from "next";
import { ContactHero } from "./_components/ContactHero";
import { ContactForm } from "./_components/ContactForm";
import { ContactInfo } from "./_components/ContactInfo";

export const metadata: Metadata = {
	title: "お問い合わせ | Focus Flow",
	description:
		"Focus Flowに関するご質問、ご要望、お困りの点など、お気軽にお問い合わせください。サポートチームが迅速に対応いたします。",
	openGraph: {
		title: "お問い合わせ | Focus Flow",
		description:
			"Focus Flowに関するご質問、ご要望、お困りの点など、お気軽にお問い合わせください。サポートチームが迅速に対応いたします。",
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("お問い合わせ")}&mode=contact`,
				width: 1200,
				height: 630,
				alt: "Focus Flow - お問い合わせ",
			},
		],
	},
};

export default function ContactPage() {
	return (
		<main>
			<ContactHero />
			<ContactInfo />
			<ContactForm />
		</main>
	);
}
