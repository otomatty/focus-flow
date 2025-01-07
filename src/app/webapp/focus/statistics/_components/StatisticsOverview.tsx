import { Card } from "@/components/ui/card";
import { Clock, Trophy, Star, Zap } from "lucide-react";

interface StatisticsOverviewProps {
	totalSessions: number | null;
	totalFocusTime: string | null;
	avgFocusRating: number | null;
	totalExp: number | null;
}

export function StatisticsOverview({
	totalSessions = 0,
	totalFocusTime = "0",
	avgFocusRating = 0,
	totalExp = 0,
}: StatisticsOverviewProps) {
	// 時間を時間と分に変換
	const duration = totalFocusTime?.split(":") || ["0", "0", "0"];
	const hours =
		Number.parseInt(duration[0]) + Number.parseInt(duration[1]) / 60;
	const formattedHours = Math.floor(hours * 10) / 10;

	return (
		<Card className="p-6">
			<h2 className="text-xl font-semibold mb-4">統計概要</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				<div className="flex items-center gap-3">
					<Trophy className="h-8 w-8 text-primary" />
					<div>
						<p className="text-sm text-muted-foreground">総セッション</p>
						<p className="text-2xl font-bold">{totalSessions || 0}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Clock className="h-8 w-8 text-primary" />
					<div>
						<p className="text-sm text-muted-foreground">総集中時間</p>
						<p className="text-2xl font-bold">{formattedHours}時間</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Star className="h-8 w-8 text-primary" />
					<div>
						<p className="text-sm text-muted-foreground">平均集中度</p>
						<p className="text-2xl font-bold">
							{(avgFocusRating || 0).toFixed(1)}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Zap className="h-8 w-8 text-primary" />
					<div>
						<p className="text-sm text-muted-foreground">総獲得EXP</p>
						<p className="text-2xl font-bold">{totalExp || 0}</p>
					</div>
				</div>
			</div>
		</Card>
	);
}
