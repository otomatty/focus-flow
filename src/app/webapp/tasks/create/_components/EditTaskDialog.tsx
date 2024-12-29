"use client";

import { useState, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { editingTaskIdAtom, handleTaskUpdateAtom } from "@/store/dialog";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { DecomposedTask } from "@/types/task";
import { formatDuration, parseDuration, formatToDuration } from "@/utils/time";

interface EditTaskDialogProps {
	task: DecomposedTask;
}

export function EditTaskDialog({ task }: EditTaskDialogProps) {
	const [editedTask, setEditedTask] = useState(task);
	const [isOpen, setIsOpen] = useState(false);
	const handleTaskUpdate = useSetAtom(handleTaskUpdateAtom);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setIsOpen(open);
			if (!open) {
				setEditedTask(task); // リセット
			}
		},
		[task],
	);

	const handleSave = useCallback(() => {
		handleTaskUpdate(editedTask);
		setIsOpen(false);
	}, [editedTask, handleTaskUpdate]);

	return (
		<ResponsiveDialog
			open={isOpen}
			onOpenChange={handleOpenChange}
			title="タスクの編集"
			description="タスクの詳細を編集できます"
			trigger={
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0"
					onClick={(e) => {
						e.stopPropagation();
						setIsOpen(true);
					}}
				>
					<span className="sr-only">編集</span>
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
					>
						<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
						<path d="m15 5 4 4" />
					</svg>
				</Button>
			}
		>
			<div className="space-y-4 p-4">
				<div className="space-y-2">
					<Label htmlFor="title">タイトル</Label>
					<Input
						id="title"
						value={editedTask.title}
						onChange={(e) =>
							setEditedTask({ ...editedTask, title: e.target.value })
						}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="description">説明</Label>
					<Textarea
						id="description"
						value={editedTask.description}
						onChange={(e) =>
							setEditedTask({ ...editedTask, description: e.target.value })
						}
						className="min-h-[100px]"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="estimated_duration">予想所要時間（分）</Label>
					<Input
						id="estimated_duration"
						type="number"
						value={parseDuration(editedTask.estimated_duration)}
						onChange={(e) =>
							setEditedTask({
								...editedTask,
								estimated_duration: formatToDuration(Number(e.target.value)),
							})
						}
					/>
					<p className="text-sm text-muted-foreground">
						現在の表示:{" "}
						{formatDuration(parseDuration(editedTask.estimated_duration))}
					</p>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						キャンセル
					</Button>
					<Button onClick={handleSave}>保存</Button>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
