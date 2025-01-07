"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GoalSettingsProps {
	userId: string;
}

export function GoalSettings({ userId }: GoalSettingsProps) {
	const [dailySessions, setDailySessions] = useState("4");
	const [dailyFocusTime, setDailyFocusTime] = useState("100");
	const [weeklyGoal, setWeeklyGoal] = useState("20");

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="daily-sessions">1日の目標セッション数</Label>
					<div className="flex items-center space-x-2">
						<Input
							id="daily-sessions"
							type="number"
							value={dailySessions}
							onChange={(e) => setDailySessions(e.target.value)}
							min="1"
							max="12"
						/>
						<span className="text-sm text-muted-foreground">セッション</span>
					</div>
					<p className="text-sm text-muted-foreground">
						1日に達成したいセッション数を設定します
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="daily-focus-time">1日の目標集中時間</Label>
					<div className="flex items-center space-x-2">
						<Input
							id="daily-focus-time"
							type="number"
							value={dailyFocusTime}
							onChange={(e) => setDailyFocusTime(e.target.value)}
							min="25"
							max="300"
							step="5"
						/>
						<span className="text-sm text-muted-foreground">分</span>
					</div>
					<p className="text-sm text-muted-foreground">
						1日の目標集中時間を設定します
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="weekly-goal">週間目標セッション数</Label>
					<div className="flex items-center space-x-2">
						<Input
							id="weekly-goal"
							type="number"
							value={weeklyGoal}
							onChange={(e) => setWeeklyGoal(e.target.value)}
							min="5"
							max="50"
						/>
						<span className="text-sm text-muted-foreground">セッション</span>
					</div>
					<p className="text-sm text-muted-foreground">
						週間の目標セッション数を設定します
					</p>
				</div>
			</div>

			<div className="flex justify-end">
				<Button>設定を保存</Button>
			</div>
		</div>
	);
}
