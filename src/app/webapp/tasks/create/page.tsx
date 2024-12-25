"use client";

import { PageHeader } from "@/components/custom/PageHeader";
import { TaskCreateForm } from "./_components/TaskCreateForm";
import { TaskBreakdownPreview } from "./_components/TaskBreakdownPreview";
import { useState } from "react";

export default function CreateTaskPage() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	return (
		<div className="container max-w-4xl space-y-8">
			<PageHeader
				title="タスクの作成"
				description="タスクのタイトルを入力し、AIに分析させることで、タスクの詳細を自動的に設定できます。"
			/>
			<TaskCreateForm
				onTitleChange={setTitle}
				onDescriptionChange={setDescription}
			/>
			<TaskBreakdownPreview title={title} description={description} />
		</div>
	);
}
