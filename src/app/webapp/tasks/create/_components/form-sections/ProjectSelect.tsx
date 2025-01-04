"use client";

import { useEffect, useState } from "react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Control } from "react-hook-form";
import type { StandardTaskFormData } from "@/types/task";
import { getProjects, createProject } from "@/app/_actions/projects";
import type { Project } from "@/types/project";
import { useAuth } from "@/hooks/useAuth";
import { ProjectDialog } from "@/app/webapp/projects/_components/ProjectDialog";
import type { ProjectFormValues } from "@/app/webapp/projects/_components/ProjectDialog";

interface ProjectSelectProps {
	control: Control<StandardTaskFormData>;
}

export function ProjectSelect({ control }: ProjectSelectProps) {
	const [projects, setProjects] = useState<Project[]>([]);
	const { user } = useAuth();

	useEffect(() => {
		async function fetchProjects() {
			if (!user) return;
			const { projects: fetchedProjects } = await getProjects({
				isArchived: false,
			});
			if (fetchedProjects) {
				setProjects(fetchedProjects as unknown as Project[]);
			}
		}
		fetchProjects();
	}, [user]);

	const handleCreateProject = async (data: ProjectFormValues) => {
		if (!user) return { error: "ユーザーが認証されていません" };

		try {
			const { project, error } = await createProject({
				...data,
				startDate: data.startDate?.toISOString(),
				endDate: data.endDate?.toISOString(),
			});
			if (error) return { error };

			if (project) {
				setProjects((prev) => [...prev, project as unknown as Project]);
			}

			return { error: null };
		} catch (error) {
			return { error: "プロジェクトの作成に失敗しました" };
		}
	};

	return (
		<FormField
			control={control}
			name="project_id"
			render={({ field }) => (
				<FormItem>
					<FormLabel>プロジェクト</FormLabel>
					<div className="flex gap-2">
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="プロジェクトを選択" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="none">プロジェクトなし</SelectItem>
								{projects.map((project) => (
									<SelectItem key={project.id} value={project.id}>
										{project.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<ProjectDialog
							trigger={
								<Button variant="outline" size="icon">
									<Plus className="h-4 w-4" />
								</Button>
							}
							onSubmit={handleCreateProject}
						/>
					</div>
				</FormItem>
			)}
		/>
	);
}
