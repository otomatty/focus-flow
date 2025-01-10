"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { projectAtom } from "@/stores/project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, ArrowRight, Check } from "lucide-react";
import {
	ProjectDialog,
	type ProjectFormValues,
} from "@/app/webapp/projects/_components/ProjectDialog";
import { createProject } from "@/app/_actions/tasks/projects";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import type { Project } from "@/types/project";

interface TaskBoardHeaderProps {
	projects: Project[];
}

export function TaskBoardHeader({ projects }: TaskBoardHeaderProps) {
	const [selectedProject, setSelectedProject] = useAtom(projectAtom);

	const handleCreateProject = async (data: ProjectFormValues) => {
		const { error } = await createProject({
			...data,
			startDate: data.startDate?.toISOString(),
			endDate: data.endDate?.toISOString(),
		});
		return { error };
	};

	const handleProjectSelect = useCallback(
		(project: Project) => {
			setSelectedProject(project);
		},
		[setSelectedProject],
	);

	return (
		<div className="flex items-center justify-between p-4 border-b">
			<div className="flex items-center gap-4">
				<ResponsiveDialog
					trigger={
						<Button variant="outline" className="flex items-center gap-2">
							<FolderOpen className="h-4 w-4" />
							{selectedProject ? selectedProject.name : "プロジェクトを選択"}
						</Button>
					}
					title="プロジェクトを選択"
					description="タスクを管理するプロジェクトを選択してください"
				>
					<div className="p-4 space-y-2">
						{projects.map((project) => (
							<Button
								key={project.id}
								variant="ghost"
								className="w-full justify-between"
								onClick={() => handleProjectSelect(project)}
							>
								<div className="flex items-center gap-2">
									<span>{project.name}</span>
									{selectedProject?.id === project.id && (
										<Badge
											variant="secondary"
											className="flex items-center gap-1"
										>
											<Check className="h-3 w-3" />
											選択中
										</Badge>
									)}
								</div>
								<ArrowRight className="h-4 w-4" />
							</Button>
						))}
					</div>
				</ResponsiveDialog>
			</div>
			<ProjectDialog
				trigger={
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						新規プロジェクト
					</Button>
				}
				onSubmit={handleCreateProject}
			/>
		</div>
	);
}
