import Link from "next/link";

export function SiteFooter() {
	return (
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
									href="/features"
									className="text-gray-500 hover:text-gray-900"
								>
									機能
								</Link>
							</li>
							<li>
								<Link
									href="/pricing"
									className="text-gray-500 hover:text-gray-900"
								>
									料金
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-gray-500 hover:text-gray-900"
								>
									お問い合わせ
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
									href="https://twitter.com/focus_flow"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-500 hover:text-gray-900"
								>
									Twitter
								</a>
							</li>
							<li>
								<a
									href="https://github.com/focus-flow"
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
	);
}
