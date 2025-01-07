"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface NotificationSettingsProps {
	userId: string;
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
	const [desktopNotifications, setDesktopNotifications] = useState(true);
	const [soundNotifications, setSoundNotifications] = useState(true);
	const [notifyBefore, setNotifyBefore] = useState(true);
	const [notificationTiming, setNotificationTiming] = useState("1");

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label>デスクトップ通知</Label>
						<p className="text-sm text-muted-foreground">
							セッションの開始/終了時にデスクトップ通知を表示します
						</p>
					</div>
					<Switch
						checked={desktopNotifications}
						onCheckedChange={setDesktopNotifications}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label>サウンド通知</Label>
						<p className="text-sm text-muted-foreground">
							セッションの開始/終了時にサウンドを再生します
						</p>
					</div>
					<Switch
						checked={soundNotifications}
						onCheckedChange={setSoundNotifications}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label>事前通知</Label>
						<p className="text-sm text-muted-foreground">
							セッション開始前に通知を送信します
						</p>
					</div>
					<Switch checked={notifyBefore} onCheckedChange={setNotifyBefore} />
				</div>
			</div>

			{notifyBefore && (
				<div className="space-y-2">
					<Label>事前通知のタイミング</Label>
					<RadioGroup
						value={notificationTiming}
						onValueChange={setNotificationTiming}
						className="grid grid-cols-2 gap-4"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="1" id="timing-1" />
							<Label htmlFor="timing-1">1分前</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="3" id="timing-3" />
							<Label htmlFor="timing-3">3分前</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="5" id="timing-5" />
							<Label htmlFor="timing-5">5分前</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="10" id="timing-10" />
							<Label htmlFor="timing-10">10分前</Label>
						</div>
					</RadioGroup>
				</div>
			)}
		</div>
	);
}
