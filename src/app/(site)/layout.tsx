import type { Metadata } from "next";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";

export const metadata: Metadata = {
	title: "Focus Flow - 生産性を最大化するポモドーロタイマー",
	description:
		"Focus Flowは、ポモドーロテクニックとタスク管理を組み合わせた、モダンで使いやすい生産性向上アプリです。",
};

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col">
			<SiteHeader />
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
