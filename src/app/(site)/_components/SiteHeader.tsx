import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/custom/ThemeSwitcher";

export function SiteHeader() {
	return (
		<header className="border-b">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<Image
						src="/images/focus-flow_logo.svg"
						alt="Focus Flow Logo"
						width={32}
						height={32}
						className="w-8 h-8"
					/>
					<span className="text-2xl font-bold">Focus Flow</span>
				</Link>
				<nav className="flex items-center gap-4">
					<Link href="/features" className="text-gray-600 hover:text-gray-900">
						機能
					</Link>
					<Link href="/pricing" className="text-gray-600 hover:text-gray-900">
						料金
					</Link>
					<Link href="/contact" className="text-gray-600 hover:text-gray-900">
						お問い合わせ
					</Link>
					<ThemeSwitcher />
					<Button asChild variant="outline">
						<Link href="/auth/login">ログイン</Link>
					</Button>
					<Button asChild>
						<Link href="/auth/signup">無料で始める</Link>
					</Button>
				</nav>
			</div>
		</header>
	);
}
