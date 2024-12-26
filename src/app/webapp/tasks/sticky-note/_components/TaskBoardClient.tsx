"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { projectsAtom } from "@/stores/project";
import { TaskBoard } from "./TaskBoard";
import { ReactFlowProvider } from "reactflow";
import type { Project } from "@/types/project";

interface TaskBoardClientProps {
	initialProjects: Project[];
}

export function TaskBoardClient({ initialProjects }: TaskBoardClientProps) {
	const [, setProjects] = useAtom(projectsAtom);

	useEffect(() => {
		setProjects(initialProjects);
	}, [initialProjects, setProjects]);

	return (
		<div className="h-full w-full">
			<ReactFlowProvider>
				<TaskBoard />
			</ReactFlowProvider>
		</div>
	);
}
