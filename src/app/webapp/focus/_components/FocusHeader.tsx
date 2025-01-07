import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Flame, Trophy, Clock } from "lucide-react";

type StreakInfo = {
	currentStreak: number | null;
	longestStreak: number | null;
	lastSessionDate: string | null;
};

interface FocusHeaderProps {
	streakInfo: StreakInfo;
}

export function FocusHeader({ streakInfo }: FocusHeaderProps) {
	return (
		<Card className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5">
			<div className="flex items-center gap-6">
				{/* 連続記録 */}
				<div className="flex items-center gap-2">
					<div className="p-2 rounded-full bg-orange-500/10">
						<Flame className="h-6 w-6 text-orange-500" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">連続記録</span>
						<span className="text-2xl font-bold">
							{streakInfo.currentStreak}日
						</span>
					</div>
				</div>

				{/* 最長記録 */}
				<div className="flex items-center gap-2">
					<div className="p-2 rounded-full bg-yellow-500/10">
						<Trophy className="h-6 w-6 text-yellow-500" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">最長記録</span>
						<span className="text-2xl font-bold">
							{streakInfo.longestStreak}日
						</span>
					</div>
				</div>

				{/* 最終セッション */}
				<div className="flex items-center gap-2">
					<div className="p-2 rounded-full bg-blue-500/10">
						<Clock className="h-6 w-6 text-blue-500" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							最終セッション
						</span>
						<span className="text-lg">
							{streakInfo.lastSessionDate
								? new Date(streakInfo.lastSessionDate).toLocaleDateString()
								: "未実施"}
						</span>
					</div>
				</div>
			</div>

			<Badge variant="secondary" className="text-lg px-4 py-2">
				Level 1
			</Badge>
		</Card>
	);
}
