import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Target } from "lucide-react";
import type { Quest, UserQuest } from "@/types/quests";
import { cn } from "@/lib/utils";

interface QuestRequirementsProps {
	quest: Quest;
	userQuest: UserQuest;
}

export function QuestRequirements({
	quest,
	userQuest,
}: QuestRequirementsProps) {
	const requirementText = {
		task_count: "タスクを完了する",
		task_streak: "日連続でタスクを達成する",
		time_spent: "時間の作業を完了する",
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Target className="w-5 h-5 text-primary" />
					達成条件
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-4">
					{quest.requirements.map((requirement) => {
						const isCompleted = requirement.current >= requirement.target;
						const progress = (requirement.current / requirement.target) * 100;
						return (
							<li
								key={requirement.type}
								className={cn(
									"relative p-4 rounded-lg border",
									"before:absolute before:inset-0 before:rounded-lg before:bg-primary/5",
									"before:transition-[width] before:duration-500",
									"hover:bg-accent/50 transition-colors",
								)}
								style={
									{
										"--progress": `${progress}%`,
									} as React.CSSProperties
								}
							>
								<div className="relative flex items-center gap-3">
									{isCompleted ? (
										<CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
									) : (
										<Circle className="w-5 h-5 text-muted-foreground shrink-0" />
									)}
									<div className="space-y-1">
										<div className="font-medium">
											{requirement.target}
											{
												requirementText[
													requirement.type as keyof typeof requirementText
												]
											}
										</div>
										<div className="text-sm text-muted-foreground">
											現在の進捗: {requirement.current}/{requirement.target} (
											{Math.round(progress)}%)
										</div>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
}
