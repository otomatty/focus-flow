"use client";

import { useAtom } from "jotai";
import { projectAtom } from "@/stores/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";

export function ProjectProgress() {
	const [project] = useAtom(projectAtom);

	if (!project) return null;

	// TODO: タスクの統計情報を取得する
	const stats = {
		total: 10,
		completed: 6,
		inProgress: 3,
		overdue: 1,
	};

	const progress = Math.round((stats.completed / stats.total) * 100);

	return (
		<>
			{/* 進捗バー */}
			<Card>
				<CardHeader>
					<CardTitle>進捗状況</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>完了率</span>
							<span className="font-medium">{progress}%</span>
						</div>
						<Progress value={progress} />
					</div>
				</CardContent>
			</Card>

			{/* タスク統計 */}
			<Card>
				<CardHeader>
					<CardTitle>タスク統計</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-2 gap-4">
					<div className="flex items-center gap-2">
						<div className="rounded-full bg-muted p-2">
							<ListTodo className="h-4 w-4" />
						</div>
						<div>
							<div className="text-sm font-medium">全タスク</div>
							<div className="text-2xl font-bold">{stats.total}</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="rounded-full bg-muted p-2">
							<CheckCircle2 className="h-4 w-4" />
						</div>
						<div>
							<div className="text-sm font-medium">完了</div>
							<div className="text-2xl font-bold">{stats.completed}</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="rounded-full bg-muted p-2">
							<Clock className="h-4 w-4" />
						</div>
						<div>
							<div className="text-sm font-medium">進行中</div>
							<div className="text-2xl font-bold">{stats.inProgress}</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="rounded-full bg-muted p-2">
							<AlertCircle className="h-4 w-4" />
						</div>
						<div>
							<div className="text-sm font-medium">期限切れ</div>
							<div className="text-2xl font-bold">{stats.overdue}</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
