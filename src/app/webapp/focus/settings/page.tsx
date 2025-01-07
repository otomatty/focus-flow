import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { TimerSettings } from "./_components/TimerSettings";
import { NotificationSettings } from "./_components/NotificationSettings";
import { GoalSettings } from "./_components/GoalSettings";

export default async function SettingsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">集中の設定</h1>

			{/* タイマー設定 */}
			<Suspense fallback={<Card className="p-6">読み込み中...</Card>}>
				<TimerSettings userId={user.id} />
			</Suspense>

			{/* 通知設定 */}
			<Suspense fallback={<Card className="p-6">読み込み中...</Card>}>
				<NotificationSettings userId={user.id} />
			</Suspense>

			{/* 目標設定 */}
			<Suspense fallback={<Card className="p-6">読み込み中...</Card>}>
				<GoalSettings userId={user.id} />
			</Suspense>
		</div>
	);
}
