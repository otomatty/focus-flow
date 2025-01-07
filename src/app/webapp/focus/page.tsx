import { Suspense } from "react";
import { FocusHeader } from "./_components/FocusHeader";
import { MainTimer } from "./_components/MainTimer";
import { TaskConnection } from "./timer/_components/TaskConnection";
import { SessionSummary } from "./timer/_components/SessionSummary";
import { Card } from "@/components/ui/card";
import { getStreakInfo } from "@/app/_actions/focus/statistics";
import { getFocusSessionHistory } from "@/app/_actions/focus/sessions";
import { createClient } from "@/lib/supabase/server";

export default async function FocusPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	// 連続記録の情報を取得
	const streakInfo = await getStreakInfo(user.id);

	// 今日のセッション履歴を取得
	const endDate = new Date();
	const startDate = new Date();
	startDate.setHours(0, 0, 0, 0);
	const todaysSessions = await getFocusSessionHistory(
		user.id,
		startDate,
		endDate,
		5,
	);

	return (
		<div className="space-y-6">
			<Suspense fallback={<div>Loading...</div>}>
				<FocusHeader streakInfo={streakInfo} />
			</Suspense>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<MainTimer />

					{/* タスク連携カード */}
					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-4">タスク連携</h2>
						<TaskConnection />
					</Card>
				</div>

				<div className="space-y-6">
					{/* セッションサマリーカード */}
					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-4">今日のセッション</h2>
						<Suspense fallback={<div>Loading...</div>}>
							<SessionSummary sessions={todaysSessions} />
						</Suspense>
					</Card>
				</div>
			</div>
		</div>
	);
}
