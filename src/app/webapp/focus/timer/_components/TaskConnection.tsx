"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ListTodo, Repeat } from "lucide-react";

export function TaskConnection() {
	return (
		<div className="space-y-6">
			<Tabs defaultValue="tasks" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="tasks" className="flex items-center gap-2">
						<ListTodo className="h-4 w-4" />
						タスク
					</TabsTrigger>
					<TabsTrigger value="habits" className="flex items-center gap-2">
						<Repeat className="h-4 w-4" />
						習慣
					</TabsTrigger>
					<TabsTrigger value="schedules" className="flex items-center gap-2">
						<CheckCircle className="h-4 w-4" />
						スケジュール
					</TabsTrigger>
				</TabsList>

				<TabsContent value="tasks" className="mt-4">
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="タスクを選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="task-1">タスク1</SelectItem>
							<SelectItem value="task-2">タスク2</SelectItem>
							<SelectItem value="task-3">タスク3</SelectItem>
						</SelectContent>
					</Select>
				</TabsContent>

				<TabsContent value="habits" className="mt-4">
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="習慣を選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="habit-1">習慣1</SelectItem>
							<SelectItem value="habit-2">習慣2</SelectItem>
							<SelectItem value="habit-3">習慣3</SelectItem>
						</SelectContent>
					</Select>
				</TabsContent>

				<TabsContent value="schedules" className="mt-4">
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="スケジュールを選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="schedule-1">スケジュール1</SelectItem>
							<SelectItem value="schedule-2">スケジュール2</SelectItem>
							<SelectItem value="schedule-3">スケジュール3</SelectItem>
						</SelectContent>
					</Select>
				</TabsContent>
			</Tabs>

			<div className="flex justify-end">
				<Button variant="outline">新規作成</Button>
			</div>
		</div>
	);
}
