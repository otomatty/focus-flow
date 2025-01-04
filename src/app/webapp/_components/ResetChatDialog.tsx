import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import { Trash2 } from "lucide-react";

interface ResetChatDialogProps {
	onReset: () => void;
}

export function ResetChatDialog({ onReset }: ResetChatDialogProps) {
	return (
		<ResponsiveDialog
			trigger={
				<Button
					variant="ghost"
					size="sm"
					className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
				>
					<Trash2 className="h-4 w-4 mr-1" />
					リセット
				</Button>
			}
			title="会話履歴のリセット"
			description="会話履歴をリセットしますか？この操作は取り消せません。"
		>
			<div className="p-4 space-y-4">
				<p className="text-sm text-muted-foreground">
					会話履歴をリセットすると、これまでのやり取りがすべて削除されます。
				</p>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onReset}>
						リセット
					</Button>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
