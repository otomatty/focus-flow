"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface TimerSettingsProps {
	userId: string;
}

export function TimerSettings({ userId }: TimerSettingsProps) {
	const [autoStartBreak, setAutoStartBreak] = useState(false);
	const [autoStartNextSession, setAutoStartNextSession] = useState(false);
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [breakDuration, setBreakDuration] = useState("5");
	const [longBreakDuration, setLongBreakDuration] = useState("15");
	const [volume, setVolume] = useState([50]);

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label>休憩の自動開始</Label>
						<p className="text-sm text-muted-foreground">
							セッション完了時に自動的に休憩を開始します
						</p>
					</div>
					<Switch
						checked={autoStartBreak}
						onCheckedChange={setAutoStartBreak}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label>次のセッションの自動開始</Label>
						<p className="text-sm text-muted-foreground">
							休憩終了時に自動的に次のセッションを開始します
						</p>
					</div>
					<Switch
						checked={autoStartNextSession}
						onCheckedChange={setAutoStartNextSession}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label>サウンド通知</Label>
						<p className="text-sm text-muted-foreground">
							セッション開始/終了時にサウンドを再生します
						</p>
					</div>
					<Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
				</div>
			</div>

			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>通常休憩の長さ</Label>
						<Select value={breakDuration} onValueChange={setBreakDuration}>
							<SelectTrigger>
								<SelectValue placeholder="休憩時間を選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="3">3分</SelectItem>
								<SelectItem value="5">5分</SelectItem>
								<SelectItem value="7">7分</SelectItem>
								<SelectItem value="10">10分</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>長休憩の長さ</Label>
						<Select
							value={longBreakDuration}
							onValueChange={setLongBreakDuration}
						>
							<SelectTrigger>
								<SelectValue placeholder="長休憩時間を選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="15">15分</SelectItem>
								<SelectItem value="20">20分</SelectItem>
								<SelectItem value="25">25分</SelectItem>
								<SelectItem value="30">30分</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-2">
					<Label>通知音量</Label>
					<Slider
						value={volume}
						onValueChange={setVolume}
						max={100}
						step={1}
						className="w-full"
					/>
					<div className="flex justify-between">
						<span className="text-sm text-muted-foreground">0%</span>
						<span className="text-sm text-muted-foreground">100%</span>
					</div>
				</div>
			</div>
		</div>
	);
}
