import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { ProjectFilter as ProjectFilterType } from "@/types/project";

interface ProjectFilterProps {
	filter?: ProjectFilterType;
	onFilterChange?: (filter: ProjectFilterType) => void;
}

export function ProjectFilter({ filter, onFilterChange }: ProjectFilterProps) {
	const handleFilterChange = (
		key: keyof ProjectFilterType,
		value: ProjectFilterType[keyof ProjectFilterType],
	) => {
		onFilterChange?.({
			...filter,
			[key]: value,
		});
	};

	const getArchiveValue = () => {
		if (filter?.isArchived === undefined) return "all";
		return filter.isArchived ? "true" : "false";
	};

	const handleArchiveChange = (value: string) => {
		if (value === "all") {
			handleFilterChange("isArchived", undefined);
		} else {
			handleFilterChange("isArchived", value === "true");
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold mb-4">フィルター</h2>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label>ステータス</Label>
						<Select
							value={filter?.status || "all"}
							onValueChange={(value) =>
								handleFilterChange(
									"status",
									value === "all" ? undefined : value,
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="すべて" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">すべて</SelectItem>
								<SelectItem value="not_started">未着手</SelectItem>
								<SelectItem value="in_progress">進行中</SelectItem>
								<SelectItem value="completed">完了</SelectItem>
								<SelectItem value="on_hold">保留中</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>優先度</Label>
						<Select
							value={filter?.priority || "all"}
							onValueChange={(value) =>
								handleFilterChange(
									"priority",
									value === "all" ? undefined : value,
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="すべて" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">すべて</SelectItem>
								<SelectItem value="high">高</SelectItem>
								<SelectItem value="medium">中</SelectItem>
								<SelectItem value="low">低</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>アーカイブ</Label>
						<Select
							value={getArchiveValue()}
							onValueChange={handleArchiveChange}
						>
							<SelectTrigger>
								<SelectValue placeholder="すべて" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">すべて</SelectItem>
								<SelectItem value="false">アクティブ</SelectItem>
								<SelectItem value="true">アーカイブ済み</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	);
}
