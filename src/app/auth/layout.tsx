import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "認証 - Focus Flow",
	description:
		"Focus Flowへようこそ。ログインまたはアカウントを作成してください。",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="container relative min-h-screen grid place-items-center my-8">
			<Button
				variant="ghost"
				className="absolute left-4 top-4 md:left-8 md:top-8 transition-colors duration-200"
				asChild
			>
				<Link href="/">
					<ChevronLeft className="mr-2 h-4 w-4" />
					トップページ
				</Link>
			</Button>
			{children}
		</div>
	);
}
