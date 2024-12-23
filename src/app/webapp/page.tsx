import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WebAppPage() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<header className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">ダッシュボード</h1>
				<Button>新規タスク作成</Button>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>今日のフォーカスセッション</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0 / 4</div>
						<p className="text-gray-500">完了したセッション</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>タスクの進捗</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0 / 5</div>
						<p className="text-gray-500">完了したタスク</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>今日の集中時間</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0時間</div>
						<p className="text-gray-500">合計フォーカス時間</p>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				<h2 className="text-2xl font-bold">今日のタスク</h2>
				<div className="space-y-2">
					<p className="text-gray-500">タスクがありません</p>
				</div>
			</div>
		</div>
	);
}
