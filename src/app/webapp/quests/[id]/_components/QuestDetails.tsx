import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { Quest, UserQuest } from "@/types/quests";

interface QuestDetailsProps {
	quest: Quest;
	userQuest: UserQuest;
}

export function QuestDetails({ quest, userQuest }: QuestDetailsProps) {
	const statusColor = {
		NOT_STARTED: "bg-secondary",
		IN_PROGRESS: "bg-blue-500",
		COMPLETED: "bg-green-500",
		FAILED: "bg-red-500",
	};

	const statusText = {
		NOT_STARTED: "未開始",
		IN_PROGRESS: "進行中",
		COMPLETED: "完了",
		FAILED: "失敗",
	};

	const questTypeText = {
		TASK_COMPLETION: "タスク",
		TIME_MANAGEMENT: "時間管理",
		STREAK: "継続",
		ACHIEVEMENT: "実績",
	};

	const endDate = new Date(userQuest.end_date);
	const remainingDays = Math.ceil(
		(endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold">{quest.title}</h1>
					<p className="text-muted-foreground">{quest.description}</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className={statusColor[userQuest.status]}>
						{statusText[userQuest.status]}
					</Badge>
					<Badge variant="outline">{questTypeText[quest.quest_type]}</Badge>
				</div>
			</div>
			<div className="flex items-center text-sm text-muted-foreground">
				<CalendarDays className="w-4 h-4 mr-1" />
				残り{remainingDays}日
			</div>
		</div>
	);
}
