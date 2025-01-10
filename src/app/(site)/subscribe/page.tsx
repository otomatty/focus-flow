import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubscribePage() {
	return (
		<div className="min-h-[80vh] flex items-center justify-center">
			<Card className="max-w-2xl w-full mx-4 p-8 text-center space-y-6">
				<div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
					<Clock className="w-8 h-8 text-primary" />
				</div>
				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						決済システム準備中
					</h1>
					<p className="text-muted-foreground">
						現在、より安全で便利な決済システムを構築中です。
						<br />
						もうしばらくお待ちください。
					</p>
				</div>
				<div className="pt-4">
					<Link href="/">
						<Button variant="outline" className="space-x-2">
							<ArrowLeft className="w-4 h-4" />
							<span>トップページに戻る</span>
						</Button>
					</Link>
				</div>
			</Card>
		</div>
	);
}
