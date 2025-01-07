"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RefreshCw, FastForward } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	startFocusSession,
	completeFocusSession,
} from "@/app/_actions/focus/sessions";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type FocusSession = Database["ff_focus"]["Tables"]["focus_sessions"]["Row"];

interface MainTimerProps {
	activeSession?: FocusSession;
}

export function MainTimer({ activeSession }: MainTimerProps) {
	const [timeLeft, setTimeLeft] = useState(25 * 60);
	const [isRunning, setIsRunning] = useState(false);
	const [isBreak, setIsBreak] = useState(false);
	const [progress, setProgress] = useState(100);
	const [sessionCount, setSessionCount] = useState(1);
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(
		activeSession?.id ?? null,
	);

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
			handleSessionComplete();
		}
		return () => clearInterval(interval);
	}, [isRunning, timeLeft]);

	const startTimer = async () => {
		if (!isRunning && !currentSessionId) {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			const { data } = await startFocusSession(user.id, {
				session_type: "FREE",
				scheduled_start_time: null,
				task_id: null,
				habit_id: null,
				schedule_id: null,
				focus_rating: 0,
				session_number: sessionCount,
				total_sessions: 4,
			});

			if (data) {
				setCurrentSessionId(data.id);
			}
		}
		setIsRunning(true);
	};

	const handleSessionComplete = async () => {
		setIsRunning(false);
		if (currentSessionId) {
			await completeFocusSession(currentSessionId, 25, 5);
			setCurrentSessionId(null);
		}
		if (!isBreak) {
			setIsBreak(true);
			setTimeLeft(5 * 60);
			setProgress(100);
		} else {
			setIsBreak(false);
			setTimeLeft(25 * 60);
			setProgress(100);
			setSessionCount((count) => count + 1);
		}
	};

	const resetTimer = () => {
		setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
		setProgress(100);
		setIsRunning(false);
	};

	const skipBreak = () => {
		if (isBreak) {
			setIsBreak(false);
			setTimeLeft(25 * 60);
			setProgress(100);
			setSessionCount((count) => count + 1);
		}
	};

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	return (
		<div className="flex flex-col items-center gap-8">
			{/* セッション情報 */}
			<div className="flex items-center gap-4">
				<Badge
					variant={isBreak ? "secondary" : "default"}
					className="text-lg px-6 py-2"
				>
					{isBreak ? "休憩中" : `セッション ${sessionCount}/4`}
				</Badge>
			</div>

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
					<p className="text-muted-foreground mt-2">
						{isBreak ? "Break Time" : "Focus Time"}
					</p>
				</div>
			</div>

			{/* コントロールボタン */}
			<div className="flex gap-4">
				<Button
					variant="outline"
					size="lg"
					className="w-24 h-24 rounded-full"
					onClick={() => (isRunning ? setIsRunning(false) : startTimer())}
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
				{isBreak && (
					<Button
						variant="outline"
						size="icon"
						className="w-12 h-12 rounded-full"
						onClick={skipBreak}
					>
						<FastForward className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* プログレスバー */}
			<Progress value={progress} className="w-full h-2" />
		</div>
	);
}
