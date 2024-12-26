import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";
import {
	Folder,
	ChevronDown,
	ChevronRight,
	AlertCircle,
	Clock,
	Timer,
	Calendar,
	CheckCircle2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskGroupData {
	title: string;
	isCollapsed?: boolean;
	width?: number;
	height?: number;
	description?: string;
	priority?: "high" | "medium" | "low";
	status: "not_started" | "in_progress" | "completed";
	progress?: number; // 0-100の進捗率
}

interface TaskGroupProps {
	data: TaskGroupData;
	selected?: boolean;
	isConnectable?: boolean;
	onChange?: (data: TaskGroupData) => void;
}

const priorityColors = {
	high: "border-red-500",
	medium: "border-yellow-500",
	low: "border-blue-500",
};

const statusColors = {
	not_started: "bg-gray-100 dark:bg-gray-800",
	in_progress: "bg-blue-50 dark:bg-blue-950",
	completed: "bg-green-50 dark:bg-green-950",
};

const priorityIcons = {
	high: <AlertCircle className="h-5 w-5 text-red-500" />,
	medium: <Clock className="h-5 w-5 text-yellow-500" />,
	low: <Timer className="h-5 w-5 text-blue-500" />,
};

const statusIcons = {
	not_started: <Calendar className="h-5 w-5 text-gray-500" />,
	in_progress: <Clock className="h-5 w-5 text-blue-500" />,
	completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
};

export const TaskGroup = ({
	data,
	selected,
	isConnectable,
	onChange,
}: TaskGroupProps) => {
	const [isCollapsed, setIsCollapsed] = useState(data.isCollapsed ?? false);
	const [isEditing, setIsEditing] = useState(false);
	const {
		title,
		width = 300,
		height = 200,
		priority,
		status = "not_started",
		progress = 0,
	} = data;

	const handleToggleCollapse = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			setIsCollapsed((prev) => !prev);
			onChange?.({ ...data, isCollapsed: !isCollapsed });
		},
		[data, isCollapsed, onChange],
	);

	const handleStatusChange = useCallback(
		(newStatus: TaskGroupData["status"]) => {
			onChange?.({ ...data, status: newStatus });
		},
		[data, onChange],
	);

	const handlePriorityChange = useCallback(
		(newPriority: TaskGroupData["priority"]) => {
			onChange?.({ ...data, priority: newPriority });
		},
		[data, onChange],
	);

	const handleTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.({ ...data, title: e.target.value });
		},
		[data, onChange],
	);

	const handleTitleBlur = useCallback(() => {
		setIsEditing(false);
	}, []);

	const handleTitleDoubleClick = useCallback(() => {
		setIsEditing(true);
	}, []);

	return (
		<Card
			className={cn(
				"shadow-lg transition-all -z-10",
				selected && "ring-2 ring-blue-500",
				"border-2 border-dashed",
				priorityColors[priority ?? "low"],
				isCollapsed ? "h-[60px]" : "",
				"bg-background/50 backdrop-blur-sm",
				"hover:shadow-xl group",
			)}
			style={{
				width: isCollapsed ? 200 : width,
				height: isCollapsed ? 60 : height,
				minWidth: 200,
				minHeight: 60,
			}}
		>
			<Handle
				type="target"
				position={Position.Top}
				className="w-2 h-2"
				isConnectable={isConnectable}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="w-2 h-2"
				isConnectable={isConnectable}
			/>

			<div
				className={cn(
					"flex items-center gap-2 p-4 bg-background/80 border-b border-border",
					"cursor-move",
					"group-hover:bg-muted/50",
				)}
			>
				<button
					type="button"
					onClick={handleToggleCollapse}
					className="text-muted-foreground hover:text-foreground"
				>
					{isCollapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</button>
				<Folder className="h-4 w-4 text-muted-foreground" />

				{isEditing ? (
					<Input
						value={title}
						onChange={handleTitleChange}
						onBlur={handleTitleBlur}
						className="h-7 flex-1"
						autoFocus
					/>
				) : (
					<span
						className="font-semibold flex-1 cursor-text"
						onDoubleClick={handleTitleDoubleClick}
					>
						{title || "グループ"}
					</span>
				)}

				<div className="flex items-center gap-3">
					<TooltipProvider>
						<Tooltip>
							<DropdownMenu>
								<TooltipTrigger asChild>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
											onClick={(e) => e.stopPropagation()}
										>
											{priority ? priorityIcons[priority] : priorityIcons.low}
										</button>
									</DropdownMenuTrigger>
								</TooltipTrigger>
								<TooltipContent>
									<p>優先度を設定</p>
								</TooltipContent>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => handlePriorityChange("high")}
										className="gap-2"
									>
										<AlertCircle className="h-4 w-4" />
										優先度: 高
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handlePriorityChange("medium")}
										className="gap-2"
									>
										<Clock className="h-4 w-4" />
										優先度: 中
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handlePriorityChange("low")}
										className="gap-2"
									>
										<Timer className="h-4 w-4" />
										優先度: 低
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</Tooltip>

						<Tooltip>
							<DropdownMenu>
								<TooltipTrigger asChild>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
											onClick={(e) => e.stopPropagation()}
										>
											{statusIcons[status]}
										</button>
									</DropdownMenuTrigger>
								</TooltipTrigger>
								<TooltipContent>
									<p>ステータスを設定</p>
								</TooltipContent>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => handleStatusChange("not_started")}
										className="gap-2"
									>
										<Calendar className="h-4 w-4" />
										ステータス: 未着手
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleStatusChange("in_progress")}
										className="gap-2"
									>
										<Clock className="h-4 w-4" />
										ステータス: 進行中
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleStatusChange("completed")}
										className="gap-2"
									>
										<CheckCircle2 className="h-4 w-4" />
										ステータス: 完了
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			{!isCollapsed && (
				<>
					<div className="px-4 pt-2">
						<Progress value={progress} className="h-1" />
					</div>
					<div className="p-4">
						<div className="w-full h-full rounded-md">
							{/* 子要素はここに配置されます */}
						</div>
					</div>
				</>
			)}
		</Card>
	);
};
