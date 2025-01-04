import { Clock, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import type { Quest } from "@/types/dashboard";

interface QuestDetailDialogProps {
	quest: Quest;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function QuestDetailDialog({
	quest,
	open,
	onOpenChange,
}: QuestDetailDialogProps) {
	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={onOpenChange}
			title={quest.title}
			description={quest.description}
			trigger={null}
		>
			<div className="p-4 space-y-6 overflow-y-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{quest.deadline && (
						<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							<Clock className="w-4 h-4" />
							<span>期限: {new Date(quest.deadline).toLocaleDateString()}</span>
						</div>
					)}
					<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
						<Target className="w-4 h-4" />
						<span>
							進捗: {((quest.progress / quest.maxProgress) * 100).toFixed(1)}%
						</span>
					</div>
				</div>

				{quest.requirements && quest.requirements.length > 0 && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
							クリア条件
						</h4>
						<ul className="space-y-1">
							{quest.requirements.map((req, index) => (
								<li
									key={`${quest.id}-req-${index}`}
									className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
									{req}
								</li>
							))}
						</ul>
					</div>
				)}

				<div className="space-y-2">
					<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
						進捗状況
					</h4>
					<div className="space-y-2">
						<Progress value={(quest.progress / quest.maxProgress) * 100} />
						<div className="text-sm text-gray-500 dark:text-gray-400">
							{quest.progress} / {quest.maxProgress}
						</div>
					</div>
				</div>

				{quest.rewards && quest.rewards.length > 0 && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
							報酬
						</h4>
						<div className="flex flex-wrap gap-2">
							{quest.rewards.map((reward, index) => (
								<div
									key={`${quest.id}-reward-${index}`}
									className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full"
								>
									<Trophy className="w-4 h-4 text-yellow-500" />
									<span className="text-sm text-yellow-700 dark:text-yellow-300">
										{reward.type === "exp" && "経験値"}
										{reward.type === "item" && "アイテム"}
										{reward.type === "title" && "称号"}
										{reward.amount && `: ${reward.amount}`}
										{reward.value && ` ${reward.value}`}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex justify-end gap-2">
					<Button
						variant="outline"
						size="sm"
						className="text-red-500 hover:text-red-600"
					>
						放棄
					</Button>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
