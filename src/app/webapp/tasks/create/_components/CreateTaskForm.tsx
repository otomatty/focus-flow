// src/app/_components/task/CreateTaskForm.tsx
"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TaskAnalysisProgress } from "./TaskAnalysisProgress";
import { taskSchema } from "@/schemas/taskSchema";
import { taskCreationAtom, setCurrentStepAtom } from "@/store/taskCreation";
import { decomposeTaskAction } from "@/app/_actions/tasks/creation";
import { Loader2 } from "lucide-react";
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

export type FormData = {
	// 基本情報
	title: string;
	priority: "high" | "medium" | "low";

	// スケジュール
	start_date?: Date;
	due_date?: Date;
	estimated_duration?: string;
	is_recurring?: boolean;
	recurring_pattern?: {
		type: "daily" | "weekly" | "monthly";
		interval: number;
		end_date?: Date;
	};

	// 進捗
	status?:
		| "not_started"
		| "in_progress"
		| "in_review"
		| "blocked"
		| "completed"
		| "cancelled";
	progress_percentage?: number;
	actual_duration?: string;

	// タスク詳細
	description?: string;
	category?: string;
	difficulty_level?: number;
	tags?: string[];

	// 依存関係
	dependencies?: {
		task_id: string;
		type: "required" | "optional" | "conditional";
		link_type:
			| "finish_to_start"
			| "start_to_start"
			| "finish_to_finish"
			| "start_to_finish";
		lag_time?: string;
		conditions?: string;
		id: string;
	}[];

	// 経験値・スキル
	experience_points?: number;
	skill_category?: string;
	skill_distribution?: Record<string, number>;

	// スタイル
	style?: {
		color?: string;
		icon?: string;
	};

	// グループ設定
	project_id?: string;
	parent_group_id?: string;
	view_type?: "list" | "kanban" | "gantt" | "mindmap";
};

export function CreateTaskForm() {
	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [taskCreation, setTaskCreation] = useAtom(taskCreationAtom);
	const [, setCurrentStep] = useAtom(setCurrentStepAtom);
	const [analyzingTaskId, setAnalyzingTaskId] = useState<string | null>(null);
	const [breakingDownTaskId, setBreakingDownTaskId] = useState<string | null>(
		null,
	);

	const form = useForm<FormData>({
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
		const title = form.getValues("title");
		if (!title) {
			form.setError("title", {
				type: "manual",
				message: "タイトルを入力してください",
			});
			return;
		}

		setIsAnalyzing(true);
		try {
			const result = await decomposeTaskAction(title);
			if (result.success && result.data) {
				const formattedTasks = result.data.map((task) => ({
					...task,
					tags: [],
				}));
				setTaskCreation((prev) => ({
					...prev,
					decomposedTasks: formattedTasks,
					currentStep: "decompose",
				}));
				setCurrentStep("decompose");
			} else {
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
					<div className="flex items-start gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>タスクのタイトル</FormLabel>
									<FormControl>
										<Input placeholder="タスクのタイトルを入力" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="button"
							variant="outline"
							className="mt-8"
							onClick={onAnalyze}
							disabled={isAnalyzing}
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
					</div>

					<div className="space-y-6">
						<PrioritySelect control={form.control} />
					</div>

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
