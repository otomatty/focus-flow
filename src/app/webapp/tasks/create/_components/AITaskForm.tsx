"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Form } from "@/components/ui/form";
import { TaskAnalysisProgress } from "./TaskAnalysisProgress";
import { taskSchema } from "@/schemas/taskSchema";
import { taskCreationAtom, setCurrentStepAtom } from "@/store/taskCreation";
import { analyzeTaskAction } from "@/app/_actions/tasks/creation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TaskPromptField } from "./TaskPromptField";
import type { AITaskFormData } from "@/types/task";
import { PrioritySelect } from "./form-sections/PrioritySelect";

export function AITaskForm() {
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [taskCreation, setTaskCreation] = useAtom(taskCreationAtom);
	const setCurrentStep = useAtom(setCurrentStepAtom)[1];
	const [analyzingTaskId, setAnalyzingTaskId] = useState<string | null>(null);
	const [breakingDownTaskId, setBreakingDownTaskId] = useState<string | null>(
		null,
	);

	const form = useForm<AITaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			priority: "medium",
			status: "not_started",
			progress_percentage: 0,
		},
	});

	const onAnalyze = async () => {
		const description = form.getValues("description");

		console.log("=== タスク分析開始 ===");
		console.log("入力内容:", { description });

		if (!description) {
			console.log("エラー: タスクの内容が入力されていません");
			form.setError("description", {
				type: "manual",
				message: "タスクの内容を入力してください",
			});
			return;
		}

		setIsAnalyzing(true);
		try {
			console.log("analyzeTaskAction呼び出し:", {
				title: "",
				description,
				priority: form.getValues("priority"),
			});

			const result = await analyzeTaskAction({
				title: "",
				description,
				priority: form.getValues("priority"),
			});

			console.log("分析結果:", result);

			if (result.success && result.data) {
				console.log("分解されたタスク:", result.data.breakdowns);

				const formattedTasks = result.data.breakdowns.map((task) => ({
					title: task.title,
					description: task.description || "",
					estimated_duration: task.estimated_duration,
					priority: form.getValues("priority"),
					skill_category: task.skill_category,
					experience_points: task.experience_points,
					status: "not_started" as const,
					progress_percentage: 0,
					style: { color: null, icon: null },
					type: "task" as const,
					difficulty_level: 1,
				}));

				console.log("フォーマット済みタスク:", formattedTasks);

				setTaskCreation((prev) => ({
					...prev,
					decomposedTasks: formattedTasks,
					currentStep: "decompose",
				}));
				setCurrentStep("decompose");
			} else {
				console.error("エラー:", result.error);
				throw new Error(result.error);
			}
		} catch (error) {
			console.error("タスク分析エラー:", error);
		} finally {
			setIsAnalyzing(false);
		}
	};

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form className="space-y-4">
					<TaskPromptField control={form.control} isAnalyzing={isAnalyzing} />

					<div className="space-y-6">
						<PrioritySelect control={form.control} />
					</div>

					<Button
						type="button"
						className="w-full"
						disabled={isAnalyzing}
						onClick={onAnalyze}
					>
						{isAnalyzing ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								分析中...
							</>
						) : (
							"AIで分析"
						)}
					</Button>
				</form>
			</Form>

			{taskCreation.currentStep !== "input" && (
				<TaskAnalysisProgress
					analyzingTaskId={analyzingTaskId}
					breakingDownTaskId={breakingDownTaskId}
				/>
			)}
		</div>
	);
}
