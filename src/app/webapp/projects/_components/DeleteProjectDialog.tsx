import { useState } from "react";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteProject } from "@/app/_actions/projects";
import type { Project } from "@/types/project";

interface DeleteProjectDialogProps {
	project: Project;
	trigger: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function DeleteProjectDialog({
	project,
	trigger,
	open,
	onOpenChange,
}: DeleteProjectDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			const { error } = await deleteProject(project.id);

			if (error) {
				toast({
					title: error,
					variant: "destructive",
				});
				return;
			}

			toast({
				title: "プロジェクトを削除しました",
				variant: "default",
			});
			handleOpenChange(false);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		onOpenChange?.(open);
	};

	return (
		<ResponsiveDialog
			open={isOpen}
			onOpenChange={handleOpenChange}
			trigger={trigger}
			title="プロジェクトの削除"
			description="このプロジェクトを削除してもよろしいですか？この操作は取り消せません。"
		>
			<div className="p-4 space-y-4">
				<div className="text-sm text-muted-foreground">
					<p>プロジェクト名: {project.name}</p>
					{project.description && <p>説明: {project.description}</p>}
				</div>
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => handleOpenChange(false)}
					>
						キャンセル
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "削除中..." : "削除"}
					</Button>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
