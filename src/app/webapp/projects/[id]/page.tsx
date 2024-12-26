"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { projectAtom } from "@/stores/project";
import { getProject } from "@/app/_actions/projects";
import { ProjectHeader } from "./_components/ProjectHeader";
import { ProjectProgress } from "./_components/ProjectProgress";
import { ProjectActivity } from "./_components/ProjectActivity";
import { ProjectTasks } from "./_components/ProjectTasks";
import { use } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/types/project";

interface Props {
	params: Promise<{
		id: string;
	}>;
}

export default function ProjectPage({ params }: Props) {
	const { id: projectId } = use(params);
	const [, setProject] = useAtom(projectAtom);

	useEffect(() => {
		const fetchProject = async () => {
			const { project: rawProject, error } = await getProject(projectId);
			if (error) {
				console.error(error);
				return;
			}
			if (rawProject) {
				setProject({
					id: rawProject.id,
					name: rawProject.name,
					description: rawProject.description,
					status: rawProject.status,
					priority: rawProject.priority,
					color: rawProject.color,
					startDate: rawProject.start_date,
					endDate: rawProject.end_date,
					isArchived: rawProject.is_archived,
					createdAt: rawProject.created_at,
					updatedAt: rawProject.updated_at,
					userId: rawProject.user_id,
					projectTasks: rawProject.project_tasks ?? [],
				} as Project);
			}
		};
		fetchProject();
	}, [projectId, setProject]);

	return (
		<div className="h-full flex flex-col">
			<ProjectHeader />
			<Separator />
			<ScrollArea className="flex-1">
				<div className="space-y-6 p-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<ProjectProgress />
						<ProjectActivity />
					</div>
					<ProjectTasks />
				</div>
			</ScrollArea>
		</div>
	);
}
