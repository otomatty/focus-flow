import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
			<header className="border-b">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<Link href="/" className="text-2xl font-bold">
						Focus Flow
					</Link>
					<nav className="flex items-center gap-4">
						<Link
							href="#features"
							className="text-gray-600 hover:text-gray-900"
						>
							機能
						</Link>
						<Link href="#pricing" className="text-gray-600 hover:text-gray-900">
							料金
						</Link>
						<Link href="#faq" className="text-gray-600 hover:text-gray-900">
							FAQ
						</Link>
						<Button asChild variant="outline">
							<Link href="/auth/login">ログイン</Link>
						</Button>
						<Button asChild>
							<Link href="/auth/signup">無料で始める</Link>
						</Button>
					</nav>
				</div>
			</header>

			<main className="flex-1">{children}</main>

			<footer className="border-t py-8 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Focus Flow</h3>
							<p className="text-gray-500 text-sm">
								生産性を最大化するポモドーロタイマー
							</p>
						</div>
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">製品</h3>
							<ul className="space-y-2">
								<li>
									<Link
										href="#features"
										className="text-gray-500 hover:text-gray-900"
									>
										機能
									</Link>
								</li>
								<li>
									<Link
										href="#pricing"
										className="text-gray-500 hover:text-gray-900"
									>
										料金
									</Link>
								</li>
								<li>
									<Link
										href="#faq"
										className="text-gray-500 hover:text-gray-900"
									>
										FAQ
									</Link>
								</li>
							</ul>
						</div>
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">サポート</h3>
							<ul className="space-y-2">
								<li>
									<Link
										href="/contact"
										className="text-gray-500 hover:text-gray-900"
									>
										お問い合わせ
									</Link>
								</li>
								<li>
									<Link
										href="/privacy"
										className="text-gray-500 hover:text-gray-900"
									>
										プライバシーポリシー
									</Link>
								</li>
								<li>
									<Link
										href="/terms"
										className="text-gray-500 hover:text-gray-900"
									>
										利用規約
									</Link>
								</li>
							</ul>
						</div>
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">ソーシャル</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="https://twitter.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-500 hover:text-gray-900"
									>
										Twitter
									</a>
								</li>
								<li>
									<a
										href="https://github.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-500 hover:text-gray-900"
									>
										GitHub
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 pt-8 border-t text-center text-gray-500">
						<p>
							&copy; {new Date().getFullYear()} Focus Flow. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
