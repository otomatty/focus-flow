"use client";

import { Suspense, useEffect } from "react";
import { getProjects } from "@/app/_actions/projects";
import { ProjectList } from "./_components/ProjectList";
import { ProjectHeader } from "./_components/ProjectHeader";
import { ProjectFilter } from "./_components/ProjectFilter";
import { Separator } from "@/components/ui/separator";
import { ProjectEmpty } from "./_components/ProjectEmpty";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Project } from "@/types/project";
import { convertToCamelCase } from "@/utils/caseConverter";
import { useAtom } from "jotai";
import {
	projectsAtom,
	searchQueryAtom,
	filterAtom,
	viewModeAtom,
	filteredProjectsAtom,
} from "@/stores/project";

export default function ProjectsPage() {
	const [viewMode, setViewMode] = useAtom(viewModeAtom);
	const [filter, setFilter] = useAtom(filterAtom);
	const [, setSearchQuery] = useAtom(searchQueryAtom);
	const [, setProjects] = useAtom(projectsAtom);
	const [filteredProjects] = useAtom(filteredProjectsAtom);

	useEffect(() => {
		const fetchProjects = async () => {
			const { projects: rawProjects, error } = await getProjects(filter);
			if (rawProjects) {
				setProjects(convertToCamelCase(rawProjects as unknown) as Project[]);
			}
		};
		fetchProjects();
	}, [filter, setProjects]);

	return (
		<div className="h-full flex flex-col">
			<div className="flex-none px-6 py-6">
				<ProjectHeader
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					onSearch={setSearchQuery}
				/>
			</div>
			<Separator />
			<div className="flex-1 flex overflow-hidden">
				<ScrollArea className="w-[200px] flex-none px-6 py-6">
					<ProjectFilter filter={filter} onFilterChange={setFilter} />
				</ScrollArea>
				<Separator orientation="vertical" />
				<ScrollArea className="flex-1 px-6 py-6">
					<Suspense fallback={<div>Loading...</div>}>
						{filteredProjects.length > 0 ? (
							<ProjectList projects={filteredProjects} viewMode={viewMode} />
						) : (
							<ProjectEmpty />
						)}
					</Suspense>
				</ScrollArea>
			</div>
		</div>
	);
}
