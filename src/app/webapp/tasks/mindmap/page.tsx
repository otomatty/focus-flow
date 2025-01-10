import { getProjects } from "@/app/_actions/tasks/projects";
import { TaskBoardClient } from "./_components/TaskBoardClient";
import { convertToCamelCase } from "@/utils/caseConverter";
import type { Project } from "@/types/project";

export default async function TaskBoardPage() {
	const { projects } = await getProjects();
	const convertedProjects = convertToCamelCase(
		projects ?? [],
	) as unknown as Project[];

	return <TaskBoardClient initialProjects={convertedProjects} />;
}
