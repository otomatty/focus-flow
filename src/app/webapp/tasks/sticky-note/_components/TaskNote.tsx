import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Palette } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Clock,
	Edit2,
	Timer,
} from "lucide-react";

const taskFormSchema = z.object({
	title: z.string().min(1, "タイトルを入力してください"),
	description: z.string().optional(),
	priority: z.enum(["high", "medium", "low"]).optional(),
	status: z.enum(["not_started", "in_progress", "completed"]),
	color: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskNoteProps {
	data: {
		title: string;
		description?: string;
		priority?: "high" | "medium" | "low";
		category?: string;
		status: "not_started" | "in_progress" | "completed";
		color?: string;
	};
	selected?: boolean;
	isConnectable?: boolean;
	onChange?: (data: TaskNoteProps["data"]) => void;
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

const noteColors = [
	{ value: "default", label: "デフォルト", class: "bg-card" },
	{
		value: "yellow",
		label: "イエロー",
		class: "bg-yellow-50 dark:bg-yellow-950",
	},
	{ value: "blue", label: "ブルー", class: "bg-blue-50 dark:bg-blue-950" },
	{ value: "green", label: "グリーン", class: "bg-green-50 dark:bg-green-950" },
	{ value: "pink", label: "ピンク", class: "bg-pink-50 dark:bg-pink-950" },
];

const priorityIcons = {
	high: <AlertCircle className="h-4 w-4 text-red-500" />,
	medium: <Clock className="h-4 w-4 text-yellow-500" />,
	low: <Timer className="h-4 w-4 text-blue-500" />,
};

const statusIcons = {
	not_started: <Calendar className="h-4 w-4 text-gray-500" />,
	in_progress: <Clock className="h-4 w-4 text-blue-500" />,
	completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

export const TaskNote = ({
	data,
	selected,
	isConnectable,
	onChange,
}: TaskNoteProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isSelectOpen, setIsSelectOpen] = useState(false);
	const {
		title,
		description,
		priority,
		status,
		category,
		color = "default",
	} = data;

	const form = useForm<TaskFormValues>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: {
			title,
			description,
			priority,
			status,
			color,
		},
	});

	const handleDoubleClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setIsEditing(true);
	}, []);

	const handleChange = useCallback(
		(values: Partial<TaskFormValues>) => {
			onChange?.({
				...data,
				...values,
			});
		},
		[data, onChange],
	);

	const handleBlur = useCallback(
		(e: React.FocusEvent) => {
			if (isSelectOpen) return;

			if (e.currentTarget.contains(e.relatedTarget as Node)) {
				return;
			}
			setIsEditing(false);
		},
		[isSelectOpen],
	);

	const handleEditClick = useCallback(
		(e: React.MouseEvent) => {
			if (isEditing) {
				e.stopPropagation();
			}
		},
		[isEditing],
	);

	return (
		<Card
			className={cn(
				"p-4 shadow-lg transition-all group relative",
				priorityColors[priority ?? "low"],
				color === "default"
					? statusColors[status]
					: noteColors.find((c) => c.value === color)?.class,
				selected && "ring-2 ring-blue-500 shadow-xl scale-105",
				"border-l-4",
				"hover:shadow-xl hover:scale-105 active:scale-100",
			)}
			onDoubleClick={handleDoubleClick}
			onClick={handleEditClick}
		>
			{selected && (
				<div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-background" />
			)}
			<Handle
				type="target"
				position={Position.Top}
				className="w-2 h-2 !bg-muted-foreground"
				isConnectable={isConnectable}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="w-2 h-2 !bg-muted-foreground"
				isConnectable={isConnectable}
			/>

			<div className="flex items-center justify-between gap-2 mb-2">
				<div className="flex items-center gap-2">
					{category && (
						<span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
							{category}
						</span>
					)}
					<Select
						value={color}
						onValueChange={(value) => handleChange({ color: value })}
						onOpenChange={setIsSelectOpen}
					>
						<SelectTrigger className="w-[32px] h-[32px] p-0">
							<SelectValue>
								<Palette className="h-4 w-4" />
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{noteColors.map((color) => (
								<SelectItem
									key={color.value}
									value={color.value}
									className={cn("cursor-pointer", color.class)}
								>
									{color.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{!isEditing && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setIsEditing(true);
						}}
						className="opacity-0 group-hover:opacity-100 transition-opacity"
					>
						<Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
					</button>
				)}
			</div>

			{isEditing ? (
				<Form {...form}>
					<form className="space-y-2" onBlur={handleBlur}>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											placeholder="タイトルを入力"
											autoFocus
											className="font-semibold"
											onChange={(e) => {
												field.onChange(e);
												handleChange({ title: e.target.value });
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											{...field}
											placeholder="説明を入力"
											className="text-sm resize-none"
											rows={3}
											onChange={(e) => {
												field.onChange(e);
												handleChange({ description: e.target.value });
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									<Select
										value={field.value}
										onValueChange={(value) => {
											field.onChange(value);
											handleChange({ priority: value as typeof priority });
										}}
										onOpenChange={setIsSelectOpen}
									>
										<SelectTrigger>
											<SelectValue placeholder="優先度を選択" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="high">高</SelectItem>
											<SelectItem value="medium">中</SelectItem>
											<SelectItem value="low">��</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<Select
										value={field.value}
										onValueChange={(value) => {
											field.onChange(value);
											handleChange({ status: value as typeof status });
										}}
										onOpenChange={setIsSelectOpen}
									>
										<SelectTrigger>
											<SelectValue placeholder="ステータスを選択" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="not_started">未着手</SelectItem>
											<SelectItem value="in_progress">進行中</SelectItem>
											<SelectItem value="completed">完了</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			) : (
				<>
					<h3 className="font-semibold mb-2">
						{title || (
							<span className="text-muted-foreground">タイトルを入力</span>
						)}
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
						{description || (
							<span className="text-muted-foreground">説明を入力</span>
						)}
					</p>
					<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
						<div className="flex items-center gap-2">
							{statusIcons[status]}
							<span>{status.replace(/_/g, " ")}</span>
						</div>
						{priority && (
							<div className="flex items-center gap-2">
								{priorityIcons[priority]}
								<span>
									{priority === "high"
										? "高"
										: priority === "medium"
											? "中"
											: "低"}
								</span>
							</div>
						)}
					</div>
				</>
			)}
		</Card>
	);
};
