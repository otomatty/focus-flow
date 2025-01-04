import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Clock, Zap } from "lucide-react";
import type { Quest, UserQuest } from "@/types/quests";

interface QuestProgressProps {
	quest: Quest;
	userQuest: UserQuest;
}

export function QuestProgress({ quest, userQuest }: QuestProgressProps) {
	const requirementIcon = {
		task_count: <Target className="w-4 h-4 text-primary" />,
		task_streak: <Zap className="w-4 h-4 text-yellow-500" />,
		time_spent: <Clock className="w-4 h-4 text-blue-500" />,
	};

	const requirementLabel = {
		task_count: "タスク完了数",
		task_streak: "連続達成日数",
		time_spent: "作業時間",
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Target className="w-5 h-5 text-primary" />
					進捗状況
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<div className="flex justify-between text-sm mb-2">
						<span>全体の進捗</span>
						<span className="text-primary font-medium">
							{userQuest.progress.percentage}%
						</span>
					</div>
					<Progress value={userQuest.progress.percentage} className="h-2" />
					<p className="text-sm text-muted-foreground mt-2 text-center">
						{userQuest.progress.current}/{userQuest.progress.target} 達成
					</p>
				</div>
				<div className="space-y-4">
					{quest.requirements.map((requirement) => (
						<div
							key={requirement.type}
							className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
						>
							{
								requirementIcon[
									requirement.type as keyof typeof requirementIcon
								]
							}
							<div className="flex-1">
								<div className="flex justify-between items-center mb-1">
									<span className="text-sm font-medium">
										{
											requirementLabel[
												requirement.type as keyof typeof requirementLabel
											]
										}
									</span>
									<span className="text-sm text-muted-foreground">
										{requirement.current}/{requirement.target}
									</span>
								</div>
								<Progress
									value={(requirement.current / requirement.target) * 100}
									className="h-1.5"
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
