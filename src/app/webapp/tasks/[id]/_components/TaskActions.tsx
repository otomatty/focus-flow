"use client";

import { useTask } from "@/hooks/use-task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateTaskStatus, deleteTask } from "@/app/_actions/tasks";
import { toast } from "sonner";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskActionsProps {
	taskId: string;
}

export function TaskActions({ taskId }: TaskActionsProps) {
	const router = useRouter();
	const { task, setTask, isLoading } = useTask(taskId);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-6 w-32" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!task) {
		return null;
	}

	async function handleStatusChange(status: Task["status"]) {
		try {
			setIsUpdating(true);
			const data = await updateTaskStatus(taskId, status);
			if (data) {
				setTask({
					...data,
					estimated_duration: data.estimated_duration?.toString() ?? null,
					ai_analysis: data.ai_analysis
						? JSON.parse(JSON.stringify(data.ai_analysis))
						: null,
					experience_points: Number(data.experience_points ?? 0),
				});
				toast.success("タスクのステータスを更新しました");
			}
		} catch (error) {
			console.error("タスクの更新に失敗しました:", error);
			toast.error("タスクの更新に失敗しました");
		} finally {
			setIsUpdating(false);
		}
	}

	async function handleDelete() {
		if (!window.confirm("このタスクを削除してもよろしいですか？")) {
			return;
		}

		try {
			setIsDeleting(true);
			await deleteTask(taskId);
			toast.success("タスクを削除しました");
			router.push("/webapp/tasks");
		} catch (error) {
			console.error("タスクの削除に失敗しました:", error);
			toast.error("タスクの削除に失敗しました");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>タスクの操作</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				{task.status === "not_started" && (
					<Button
						className="w-full"
						onClick={() => handleStatusChange("in_progress")}
						disabled={isUpdating}
					>
						開始する
					</Button>
				)}
				{task.status === "in_progress" && (
					<Button
						className="w-full"
						onClick={() => handleStatusChange("completed")}
						disabled={isUpdating}
					>
						完了する
					</Button>
				)}
				<Button
					variant="destructive"
					className="w-full"
					onClick={handleDelete}
					disabled={isDeleting}
				>
					削除する
				</Button>
			</CardContent>
		</Card>
	);
}
