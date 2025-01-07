import { createClient } from "@/lib/supabase/server";
import {
	getFocusStatistics,
	getFocusStatisticsByPeriod,
} from "@/app/_actions/focus/statistics";
import { StatisticsOverview } from "./_components/StatisticsOverview";
import { TimeDistribution } from "./_components/TimeDistribution";
import { CompletionRates } from "./_components/CompletionRates";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

export default async function StatisticsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	// 全期間の統計情報を取得
	const allTimeStats = await getFocusStatistics(user.id);

	// 今月の統計情報を取得
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	const monthlyStats = await getFocusStatisticsByPeriod(
		user.id,
		startOfMonth,
		endOfMonth,
	);

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">集中の統計</h1>

			{/* 統計概要 */}
			<Suspense fallback={<Card className="p-6">読み込み中...</Card>}>
				<StatisticsOverview
					totalSessions={allTimeStats.total_sessions}
					totalFocusTime={allTimeStats.total_focus_time as string}
					avgFocusRating={allTimeStats.avg_focus_rating}
					totalExp={allTimeStats.total_exp_earned}
				/>
			</Suspense>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* 時間帯別分布 */}
				<Suspense fallback={<Card className="p-6">読み込み中...</Card>}>
					<TimeDistribution
						morning={allTimeStats.morning_sessions}
						afternoon={allTimeStats.afternoon_sessions}
						evening={allTimeStats.evening_sessions}
						night={allTimeStats.night_sessions}
					/>
				</Suspense>

				{/* 完了状態の分布 */}
				<Suspense fallback={<Card className="p-6">読み込み中...</Card>}>
					<CompletionRates
						perfect={allTimeStats.perfect_sessions}
						completed={allTimeStats.completed_sessions}
						partial={allTimeStats.partial_sessions}
						abandoned={allTimeStats.abandoned_sessions}
						perfectRate={allTimeStats.perfect_rate}
						completionRate={allTimeStats.completion_rate}
					/>
				</Suspense>
			</div>

			{/* 月間サマリー */}
			<Card className="p-6">
				<h2 className="text-xl font-semibold mb-4">今月の集計</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<p className="text-sm text-muted-foreground">セッション数</p>
						<p className="text-2xl font-bold">{monthlyStats.totalSessions}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">総集中時間</p>
						<p className="text-2xl font-bold">
							{monthlyStats.totalFocusTime}分
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">平均集中度</p>
						<p className="text-2xl font-bold">
							{monthlyStats.avgFocusRating.toFixed(1)}
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">獲得EXP</p>
						<p className="text-2xl font-bold">{monthlyStats.totalExp}</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
