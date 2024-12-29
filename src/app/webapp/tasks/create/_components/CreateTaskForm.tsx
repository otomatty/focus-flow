// src/app/_components/task/CreateTaskForm.tsx
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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScheduleSection } from "./form-sections/ScheduleSection";
import { ProgressSection } from "./form-sections/ProgressSection";
import { DetailsSection } from "./form-sections/DetailsSection";
import { DependencySection } from "./form-sections/DependencySection";
import { ExperienceSection } from "./form-sections/ExperienceSection";
import { StyleSection } from "./form-sections/StyleSection";
import { GroupSection } from "./form-sections/GroupSection";
import { PrioritySelect } from "./form-sections/PrioritySelect";
import { TaskPromptField } from "./TaskPromptField";
import type { TaskFormData } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function CreateTaskForm() {
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [taskCreation, setTaskCreation] = useAtom(taskCreationAtom);
	const setCurrentStep = useAtom(setCurrentStepAtom)[1];
	const [analyzingTaskId, setAnalyzingTaskId] = useState<string | null>(null);
	const [breakingDownTaskId, setBreakingDownTaskId] = useState<string | null>(
		null,
	);

	const form = useForm<TaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			priority: "medium",
			status: "not_started",
			progress_percentage: 0,
			is_recurring: false,
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
					type: "task" as const,
					skill_category: task.skill_category,
					experience_points: task.experience_points,
					status: "not_started" as const,
					progress_percentage: 0,
					difficulty_level: 1,
					style: { color: null, icon: null },
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
						variant="outline"
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

					<Accordion type="multiple" className="w-full">
						<AccordionItem value="schedule">
							<AccordionTrigger>スケジュール</AccordionTrigger>
							<AccordionContent>
								<ScheduleSection control={form.control} />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="progress">
							<AccordionTrigger>進捗</AccordionTrigger>
							<AccordionContent>
								<ProgressSection control={form.control} />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="details">
							<AccordionTrigger>タスク詳細</AccordionTrigger>
							<AccordionContent>
								<DetailsSection control={form.control} />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="dependency">
							<AccordionTrigger>依存関係</AccordionTrigger>
							<AccordionContent>
								<DependencySection control={form.control} />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="experience">
							<AccordionTrigger>経験値・スキル</AccordionTrigger>
							<AccordionContent>
								<ExperienceSection control={form.control} />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="style">
							<AccordionTrigger>スタイル設定</AccordionTrigger>
							<AccordionContent>
								<StyleSection control={form.control} />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="group">
							<AccordionTrigger>グループ設定</AccordionTrigger>
							<AccordionContent>
								<GroupSection control={form.control} />
							</AccordionContent>
						</AccordionItem>
					</Accordion>
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
