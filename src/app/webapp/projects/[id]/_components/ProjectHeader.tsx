"use client";

import { useAtom } from "jotai";
import { projectAtom } from "@/stores/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Pencil,
	MoreHorizontal,
	Archive,
	Trash2,
	Calendar,
} from "lucide-react";
import { ProjectDialog } from "../../_components/ProjectDialog";
import { DeleteProjectDialog } from "../../_components/DeleteProjectDialog";
import { updateProject } from "@/app/_actions/projects";
import { useRouter } from "next/navigation";
import { differenceInDays, format } from "date-fns";
import { ja } from "date-fns/locale";
import type { ProjectFormValues } from "../../_components/ProjectDialog";

const statusMap = {
	not_started: { label: "未着手", variant: "secondary" as const },
	in_progress: { label: "進行中", variant: "default" as const },
	completed: { label: "完了", variant: "default" as const },
	on_hold: { label: "保留中", variant: "outline" as const },
} as const;

const priorityMap = {
	high: { label: "高", variant: "destructive" as const },
	medium: { label: "中", variant: "default" as const },
	low: { label: "低", variant: "secondary" as const },
} as const;

export function ProjectHeader() {
	const [project] = useAtom(projectAtom);
	const router = useRouter();

	if (!project) return null;

	const handleUpdateProject = async (data: ProjectFormValues) => {
		const { error } = await updateProject(project.id, {
			...data,
			description: data.description ?? undefined,
			startDate: data.startDate?.toISOString(),
			endDate: data.endDate?.toISOString(),
		});
		return { error };
	};

	// 日数の計算
	const startDate = project.startDate ? new Date(project.startDate) : null;
	const endDate = project.endDate ? new Date(project.endDate) : null;
	const today = new Date();

	let totalDays = 0;
	let remainingDays = 0;
	let progress = 0;

	if (startDate && endDate) {
		totalDays = differenceInDays(endDate, startDate);
		remainingDays = differenceInDays(endDate, today);
		const elapsedDays = differenceInDays(today, startDate);
		progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
	}

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
					{project.description && (
						<p className="text-muted-foreground">{project.description}</p>
					)}
					<div className="flex items-center gap-2">
						<Badge
							variant={
								statusMap[project.status as keyof typeof statusMap].variant
							}
						>
							{statusMap[project.status as keyof typeof statusMap].label}
						</Badge>
						<Badge
							variant={
								priorityMap[project.priority as keyof typeof priorityMap]
									.variant
							}
						>
							優先度:{" "}
							{priorityMap[project.priority as keyof typeof priorityMap].label}
						</Badge>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<ProjectDialog
						project={project}
						trigger={
							<Button variant="outline" size="icon">
								<Pencil className="h-4 w-4" />
							</Button>
						}
						onSubmit={handleUpdateProject}
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() =>
									handleUpdateProject({
										name: project.name,
										description: project.description ?? undefined,
										status: project.status as
											| "not_started"
											| "in_progress"
											| "completed"
											| "on_hold",
										priority: project.priority as "high" | "medium" | "low",
										color: project.color ?? undefined,
										startDate: project.startDate
											? new Date(project.startDate)
											: undefined,
										endDate: project.endDate
											? new Date(project.endDate)
											: undefined,
										isArchived: !project.isArchived,
									})
								}
							>
								<Archive className="mr-2 h-4 w-4" />
								{project.isArchived ? "アーカイブを解除" : "アーカイブ"}
							</DropdownMenuItem>
							<DeleteProjectDialog
								project={project}
								trigger={
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										className="text-destructive"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										削除
									</DropdownMenuItem>
								}
							/>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{startDate && endDate && (
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar className="h-4 w-4" />
						<div>
							{format(startDate, "yyyy/MM/dd", { locale: ja })} -{" "}
							{format(endDate, "yyyy/MM/dd", { locale: ja })}
						</div>
					</div>
					<div className="space-y-1">
						<div className="flex items-center justify-between text-sm">
							<div>期間の進捗</div>
							<div className="text-muted-foreground">
								{remainingDays > 0 ? `残り${remainingDays}日` : "期限切れ"}
							</div>
						</div>
						<Progress value={progress} className="h-2" />
						<div className="text-xs text-muted-foreground text-right">
							{Math.round(progress)}% 完了
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
