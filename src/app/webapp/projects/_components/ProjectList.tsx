import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	MoreHorizontal,
	Pencil,
	Calendar,
	Clock,
	CheckCircle2,
	Flag,
	Trash2,
} from "lucide-react";
import type { Project } from "@/types/project";
import { ProjectDialog, type ProjectFormValues } from "./ProjectDialog";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { updateProject } from "@/app/_actions/tasks/projects";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface ProjectListProps {
	projects: Project[];
	viewMode: "grid" | "list";
}

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

export function ProjectList({ projects, viewMode }: ProjectListProps) {
	const handleUpdateProject = async (id: string, data: ProjectFormValues) => {
		const { error } = await updateProject(id, {
			...data,
			startDate: data.startDate?.toISOString(),
			endDate: data.endDate?.toISOString(),
		});
		return { error };
	};

	if (viewMode === "list") {
		return (
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>プロジェクト名</TableHead>
							<TableHead>ステータス</TableHead>
							<TableHead>優先度</TableHead>
							<TableHead>開始日</TableHead>
							<TableHead>終了日</TableHead>
							<TableHead className="w-[40px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{projects.map((project) => (
							<TableRow key={project.id}>
								<TableCell>
									<Link
										href={`/webapp/projects/${project.id}`}
										className="hover:underline"
									>
										<div className="font-medium">{project.name}</div>
									</Link>
								</TableCell>
								<TableCell>
									<Badge
										variant={
											statusMap[project.status as keyof typeof statusMap]
												.variant as BadgeVariant
										}
									>
										{statusMap[project.status as keyof typeof statusMap].label}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant={
											priorityMap[project.priority as keyof typeof priorityMap]
												.variant as BadgeVariant
										}
									>
										{
											priorityMap[project.priority as keyof typeof priorityMap]
												.label
										}
									</Badge>
								</TableCell>
								<TableCell>
									{project.startDate &&
										format(new Date(project.startDate), "yyyy/MM/dd", {
											locale: ja,
										})}
								</TableCell>
								<TableCell>
									{project.endDate &&
										format(new Date(project.endDate), "yyyy/MM/dd", {
											locale: ja,
										})}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<ProjectDialog
												project={project}
												trigger={
													<DropdownMenuItem
														onSelect={(e) => e.preventDefault()}
													>
														<Pencil className="mr-2 h-4 w-4" />
														編集
													</DropdownMenuItem>
												}
												onSubmit={(data) =>
													handleUpdateProject(project.id, data)
												}
											/>
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
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{projects.map((project) => (
				<Link
					key={project.id}
					href={`/webapp/projects/${project.id}`}
					className="block"
				>
					<Card className="group hover:shadow-md transition-shadow">
						<CardHeader className="flex flex-row items-start justify-between space-y-0">
							<div className="space-y-1.5">
								<CardTitle className="font-semibold leading-none">
									{project.name}
								</CardTitle>
								{project.description && (
									<p className="text-sm text-muted-foreground line-clamp-2">
										{project.description}
									</p>
								)}
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="opacity-0 group-hover:opacity-100 transition-opacity"
										onClick={(e) => e.preventDefault()}
									>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<ProjectDialog
										project={project}
										trigger={
											<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
												<Pencil className="mr-2 h-4 w-4" />
												編集
											</DropdownMenuItem>
										}
										onSubmit={(data) => handleUpdateProject(project.id, data)}
									/>
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
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Badge
									variant={
										statusMap[project.status as keyof typeof statusMap]
											.variant as BadgeVariant
									}
									className="flex items-center gap-1"
								>
									<CheckCircle2 className="h-3 w-3" />
									{statusMap[project.status as keyof typeof statusMap].label}
								</Badge>
								<Badge
									variant={
										priorityMap[project.priority as keyof typeof priorityMap]
											.variant as BadgeVariant
									}
									className="flex items-center gap-1"
								>
									<Flag className="h-3 w-3" />
									{
										priorityMap[project.priority as keyof typeof priorityMap]
											.label
									}
								</Badge>
							</div>
							<div className="flex flex-col gap-2 text-sm">
								{project.startDate && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Calendar className="h-4 w-4" />
										<span>
											開始:{" "}
											{format(new Date(project.startDate), "yyyy/MM/dd", {
												locale: ja,
											})}
										</span>
									</div>
								)}
								{project.endDate && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Clock className="h-4 w-4" />
										<span>
											終了:{" "}
											{format(new Date(project.endDate), "yyyy/MM/dd", {
												locale: ja,
											})}
										</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}
