"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ErrorActions() {
	return (
		<div className="space-y-4">
			<Button asChild className="w-full">
				<Link href="/">ホームに戻る</Link>
			</Button>
			<Button
				variant="outline"
				className="w-full"
				onClick={() => window.location.reload()}
			>
				ページを再読み込み
			</Button>
		</div>
	);
}
