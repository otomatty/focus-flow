"use client";

import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminHeader() {
	return (
		<header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center gap-4 border-b bg-background px-4">
			<div className="flex items-center gap-4">
				<SidebarTrigger />
				<div className="flex items-center gap-2">
					<Shield className="size-5" />
					<span className="font-semibold">システム管理</span>
				</div>
			</div>
			<div className="flex flex-1 items-center justify-between gap-4">
				<nav className="flex items-center gap-4">
					<Button variant="ghost" size="sm" className="gap-2" asChild>
						<Link href="/webapp">
							<ArrowLeft className="size-4" />
							アプリケーションに戻る
						</Link>
					</Button>
				</nav>
				<div className="flex items-center gap-4">
					<Button variant="outline" size="sm">
						ヘルプ
					</Button>
				</div>
			</div>
		</header>
	);
}
