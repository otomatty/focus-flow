import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	LayoutGrid,
	List,
	Plus,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectDialog } from "./ProjectDialog";
import { createProject } from "@/app/_actions/projects";
import type { ProjectFormValues } from "./ProjectDialog";

interface ProjectHeaderProps {
	viewMode?: "grid" | "list";
	onViewModeChange?: (mode: "grid" | "list") => void;
	onSearch?: (query: string) => void;
}

export function ProjectHeader({
	viewMode = "grid",
	onViewModeChange,
	onSearch,
}: ProjectHeaderProps) {
	const handleCreateProject = async (data: ProjectFormValues) => {
		const { error } = await createProject({
			...data,
			startDate: data.startDate?.toISOString(),
			endDate: data.endDate?.toISOString(),
		});
		return { error };
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">プロジェクト</h1>
					<p className="text-muted-foreground">
						プロジェクトの作成、管理、タスクの整理を行います。
					</p>
				</div>
				<div className="flex items-center gap-2">
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
			</div>

			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="プロジェクト名で検索"
						className="pl-8"
						onChange={(e) => onSearch?.(e.target.value)}
					/>
				</div>
				<div className="flex items-center gap-1 bg-muted rounded-md p-1">
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8",
							viewMode === "grid" && "bg-background shadow-sm",
						)}
						onClick={() => onViewModeChange?.("grid")}
					>
						<LayoutGrid className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8",
							viewMode === "list" && "bg-background shadow-sm",
						)}
						onClick={() => onViewModeChange?.("list")}
					>
						<List className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
