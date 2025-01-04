"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	CheckCircle2,
	RefreshCcw,
	Loader2,
	ChevronRight,
	Clock,
	Gauge,
	Trophy,
	Code,
	Server,
	Palette,
	Settings,
	Bug,
	FileText,
} from "lucide-react";
import type { TaskWithParent, AIAnalysis } from "@/types/task";
import { formatDuration, parseDuration } from "@/utils/time";
import { EditTaskDialog } from "./EditTaskDialog";
import { useSetAtom, useAtomValue } from "jotai";
import {
	analyzeTaskAtom,
	breakdownTaskAtom,
	getTaskAnalysisAtom,
} from "@/store/taskActions";
import { editingTaskIdAtom } from "@/store/dialog";

// スキルカテゴリに基づくアイコンのマッピング
const skillCategoryIcons: Record<string, React.ComponentType> = {
	frontend: Code,
	backend: Server,
	design: Palette,
	devops: Settings,
	testing: Bug,
	documentation: FileText,
};

interface TaskCardListProps {
	tasks: TaskWithParent[];
	analyzingTaskId: string | null;
	breakingDownTaskId: string | null;
}

export function TaskCardList({
	tasks,
	analyzingTaskId,
	breakingDownTaskId,
}: TaskCardListProps) {
	const handleAnalyze = useSetAtom(analyzeTaskAtom);
	const handleBreakdown = useSetAtom(breakdownTaskAtom);
	const setEditingTaskId = useSetAtom(editingTaskIdAtom);
	const getTaskAnalysis = useAtomValue(getTaskAnalysisAtom);

	return (
		<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent relative overflow-x-auto">
			<div className="flex gap-6 pb-4">
				{Object.entries(
					tasks.reduce<Record<string, TaskWithParent[]>>((groups, task) => {
						const parentTitle =
							"parentTask" in task ? task.parentTask || task.title : task.title;
						if (!groups[parentTitle]) {
							groups[parentTitle] = [];
						}
						groups[parentTitle].push(task);
						return groups;
					}, {}),
				).map(([parentTitle, groupTasks]) => (
					<div key={parentTitle} className="w-[350px] flex-none space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="font-semibold">{parentTitle}</h4>
							<Badge variant="outline">{groupTasks.length}個のタスク</Badge>
						</div>
						<div className="space-y-3">
							{groupTasks.map((task) => {
								const isBreakdownTask = "parentTask" in task;
								const taskAnalysis = getTaskAnalysis(task.title);
								const analysis = isBreakdownTask
									? task.analysis
									: taskAnalysis?.analysis;

								return (
									<Card
										key={`${task.title}-${task.estimated_duration}`}
										className="relative cursor-pointer hover:bg-accent/50 transition-colors"
										style={{
											borderColor: task.style?.color || undefined,
											borderWidth: task.style?.color ? "2px" : undefined,
										}}
										onClick={() => setEditingTaskId(task.title)}
									>
										<CardHeader className="pb-2">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<CardTitle className="flex items-center gap-2 text-base">
														{task.style?.icon && (
															<div className="h-4 w-4">
																{skillCategoryIcons[
																	task.skill_category?.toLowerCase() || ""
																]
																	? React.createElement(
																			skillCategoryIcons[
																				task.skill_category?.toLowerCase() || ""
																			],
																		)
																	: null}
															</div>
														)}
														{task.title}
													</CardTitle>
													<CardDescription>{task.description}</CardDescription>
												</div>
												<div className="flex items-center gap-2">
													<EditTaskDialog task={task} />
													{taskAnalysis ? (
														<div className="flex items-center gap-2">
															{breakingDownTaskId === task.title ? (
																<Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
															) : (
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-8 w-8 p-0"
																	onClick={(e) => {
																		e.stopPropagation();
																		handleBreakdown(task);
																	}}
																>
																	<RefreshCcw className="h-4 w-4" />
																	<span className="sr-only">細分化</span>
																</Button>
															)}
															<CheckCircle2 className="h-5 w-5 text-green-500" />
														</div>
													) : (
														<Button
															variant="ghost"
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																handleAnalyze(task);
															}}
															disabled={analyzingTaskId === task.title}
														>
															{analyzingTaskId === task.title ? (
																<>
																	<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																	分析中...
																</>
															) : (
																"分析"
															)}
														</Button>
													)}
												</div>
											</div>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												<div className="flex flex-wrap gap-2">
													{task.dependencies?.map((dep) => (
														<Badge
															key={dep.prerequisite_task_title}
															variant={
																dep.dependency_type === "required"
																	? "default"
																	: "secondary"
															}
															className="flex items-center gap-1"
														>
															<ChevronRight className="h-3 w-3" />
															{dep.prerequisite_task_title}
														</Badge>
													))}
												</div>
												<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
													{task.estimated_duration && (
														<Badge
															variant="secondary"
															className="flex items-center gap-1"
														>
															<Clock className="h-3 w-3" />
															{formatDuration(
																parseDuration(task.estimated_duration),
															)}
														</Badge>
													)}
													{task.difficulty_level && (
														<div className="flex items-center gap-1">
															<Gauge className="h-4 w-4" />
															難易度 {task.difficulty_level}
														</div>
													)}
													{task.experience_points && (
														<div className="flex items-center gap-1">
															<Trophy className="h-4 w-4" />
															{task.experience_points} XP
														</div>
													)}
												</div>
												<div className="flex flex-wrap gap-2">
													{task.category && (
														<Badge variant="outline">{task.category}</Badge>
													)}
													{task.skill_category && (
														<Badge
															variant="secondary"
															style={{
																backgroundColor: task.style?.color || undefined,
																color: task.style?.color ? "white" : undefined,
															}}
														>
															{task.skill_category}
														</Badge>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
