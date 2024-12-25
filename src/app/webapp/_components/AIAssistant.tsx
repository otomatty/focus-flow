"use client";

import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function AIAssistant() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Bot className="h-5 w-5" />
					<span className="sr-only">AIアシスタント</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>AIアシスタント</DialogTitle>
					<DialogDescription>
						AIアシスタントがタスク管理をサポートします。
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<p className="text-sm text-muted-foreground">準備中です...</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
