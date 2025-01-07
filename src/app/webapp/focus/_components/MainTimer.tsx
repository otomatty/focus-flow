"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function MainTimer() {
	const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分をデフォルト
	const [isRunning, setIsRunning] = useState(false);
	const [progress, setProgress] = useState(100);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isRunning && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((time) => {
					const newTime = time - 1;
					setProgress((newTime / (25 * 60)) * 100);
					return newTime;
				});
			}, 1000);
		} else if (timeLeft === 0) {
			setIsRunning(false);
		}
		return () => clearInterval(interval);
	}, [isRunning, timeLeft]);

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	const resetTimer = () => {
		setTimeLeft(25 * 60);
		setProgress(100);
		setIsRunning(false);
	};

	return (
		<Card className="p-8">
			<div className="flex flex-col items-center gap-8">
				{/* タイマーディスプレイ */}
				<div className="relative w-64 h-64 flex items-center justify-center">
					<div className="absolute inset-0">
						<svg
							className="w-full h-full transform -rotate-90"
							aria-labelledby="timerTitle"
						>
							<title id="timerTitle">フォーカスタイマー</title>
							<circle
								cx="50%"
								cy="50%"
								r="48%"
								className="fill-none stroke-primary/20"
								strokeWidth="4"
							/>
							<circle
								cx="50%"
								cy="50%"
								r="48%"
								className="fill-none stroke-primary"
								strokeWidth="4"
								strokeDasharray={`${progress * 3.14}, 314`}
								strokeLinecap="round"
								style={{ transition: "stroke-dasharray 0.5s ease" }}
							/>
						</svg>
					</div>
					<div className="text-center">
						<span className="text-5xl font-bold tabular-nums">
							{minutes.toString().padStart(2, "0")}:
							{seconds.toString().padStart(2, "0")}
						</span>
						<p className="text-muted-foreground mt-2">Focus Time</p>
					</div>
				</div>

				{/* コントロールボタン */}
				<div className="flex gap-4">
					<Button
						variant="outline"
						size="lg"
						className="w-24 h-24 rounded-full"
						onClick={() => setIsRunning(!isRunning)}
					>
						{isRunning ? (
							<Pause className="h-8 w-8" />
						) : (
							<Play className="h-8 w-8" />
						)}
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="w-12 h-12 rounded-full"
						onClick={resetTimer}
					>
						<RefreshCw className="h-4 w-4" />
					</Button>
				</div>

				{/* プログレスバー */}
				<Progress value={progress} className="w-full h-2" />
			</div>
		</Card>
	);
}
