import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Sparkles } from "lucide-react";
import type { Quest } from "@/types/quests";

interface QuestRewardsProps {
	quest: Quest;
}

export function QuestRewards({ quest }: QuestRewardsProps) {
	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Trophy className="w-5 h-5 text-primary" />
					報酬
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
						<div className="p-2 rounded-full bg-yellow-500/10">
							<Trophy className="w-6 h-6 text-yellow-500" />
						</div>
						<div>
							<div className="font-medium">経験値</div>
							<div className="text-2xl font-bold text-yellow-500">
								+{quest.reward_exp}
								<span className="text-base font-normal text-muted-foreground ml-1">
									XP
								</span>
							</div>
						</div>
					</div>

					{quest.reward_badge_id && (
						<div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
							<div className="p-2 rounded-full bg-blue-500/10">
								<Award className="w-6 h-6 text-blue-500" />
							</div>
							<div>
								<div className="font-medium">バッジ</div>
								<div className="text-sm text-muted-foreground">
									新しいバッジを獲得できます
								</div>
							</div>
							<Sparkles className="w-4 h-4 text-yellow-500 ml-auto" />
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
