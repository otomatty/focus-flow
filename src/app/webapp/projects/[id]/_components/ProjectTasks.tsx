"use client";

import { useAtom } from "jotai";
import { projectAtom } from "@/stores/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Task {
	id: string;
	name: string;
	status: string;
	dueDate?: string;
}

export function ProjectTasks() {
	const [project] = useAtom(projectAtom);

	if (!project) return null;

	// TODO: プロジェクトのタスク一覧を取得する
	const tasks: Task[] = [];

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>タスク一覧</CardTitle>
				<Button size="sm">
					<Plus className="mr-2 h-4 w-4" />
					タスクを追加
				</Button>
			</CardHeader>
			<CardContent>
				{tasks.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>タスク名</TableHead>
								<TableHead>ステータス</TableHead>
								<TableHead>期限</TableHead>
								<TableHead className="w-[100px]">操作</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell>{task.name}</TableCell>
									<TableCell>{task.status}</TableCell>
									<TableCell>{task.dueDate}</TableCell>
									<TableCell>...</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="text-center py-6 text-sm text-muted-foreground">
						タスクはまだありません
					</div>
				)}
			</CardContent>
		</Card>
	);
}
