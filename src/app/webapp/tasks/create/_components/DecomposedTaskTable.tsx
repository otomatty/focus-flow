"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { TaskWithParent } from "@/types/task";

interface DecomposedTaskTableProps {
	tasks: TaskWithParent[];
}

export function DecomposedTaskTable({ tasks }: DecomposedTaskTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>タイトル</TableHead>
						<TableHead>説明</TableHead>
						<TableHead>所要時間</TableHead>
						<TableHead>依存関係</TableHead>
						<TableHead>カテゴリ</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tasks.map((task) => (
						<TableRow key={`${task.title}-${task.estimated_duration}`}>
							<TableCell className="font-medium">
								{task.title}
								{"parentTask" in task && (
									<Badge variant="secondary" className="ml-2">
										{task.parentTask}
									</Badge>
								)}
							</TableCell>
							<TableCell>{task.description}</TableCell>
							<TableCell>{task.estimated_duration}</TableCell>
							<TableCell>
								<div className="flex flex-wrap gap-2">
									{task.dependencies?.map(
										(dep: {
											prerequisite_task_title: string;
											dependency_type: "required" | "optional" | "conditional";
											link_type:
												| "finish_to_start"
												| "start_to_start"
												| "finish_to_finish"
												| "start_to_finish";
										}) => (
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
												<span className="text-xs">({dep.link_type})</span>
											</Badge>
										),
									)}
								</div>
							</TableCell>
							<TableCell>
								{task.analysis?.category && (
									<Badge variant="outline">{task.analysis.category}</Badge>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
