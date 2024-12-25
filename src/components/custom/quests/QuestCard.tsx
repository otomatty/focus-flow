"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Trophy } from "lucide-react";
import { QuestStepAction } from "./QuestStepAction";

interface QuestStep {
	id: string;
	title: string;
	description: string;
	action_type: "notification" | "focus_session" | "task";
}

interface QuestCardProps {
	id: string;
	title: string;
	description: string;
	steps: QuestStep[];
	currentStep: string;
	completedSteps: string[];
	endDate: string;
	rewardExp: number;
	status: "not_started" | "in_progress" | "completed";
	onUpdate?: () => void;
}

export function QuestCard({
	id,
	title,
	description,
	steps,
	currentStep,
	completedSteps,
	endDate,
	rewardExp,
	status,
	onUpdate,
}: QuestCardProps) {
	const progress = (completedSteps.length / steps.length) * 100;
	const endDateTime = new Date(endDate);
	const remainingDays = Math.ceil(
		(endDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
	);

	// 現在のステップのインデックスを取得
	const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
	// 次のステップのIDを取得（最後のステップの場合はnull）
	const nextStepId =
		currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1].id : null;

	return (
		<Card className="w-full">
			<CardHeader className="space-y-1">
				<div className="flex items-center justify-between">
					<CardTitle className="text-2xl">{title}</CardTitle>
					<Badge
						variant={
							status === "completed"
								? "default"
								: status === "in_progress"
									? "secondary"
									: "outline"
						}
					>
						{status === "completed"
							? "完了"
							: status === "in_progress"
								? "進行中"
								: "未開始"}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground">{description}</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>進行状況</span>
						<span>{Math.round(progress)}%</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				<div className="space-y-4">
					{steps.map((step) => (
						<div
							key={step.id}
							className={`flex items-start space-x-2 ${
								completedSteps.includes(step.id)
									? "text-muted-foreground"
									: currentStep === step.id
										? "text-primary"
										: ""
							}`}
						>
							<div
								className={`mt-1 h-2 w-2 rounded-full ${
									completedSteps.includes(step.id)
										? "bg-primary"
										: currentStep === step.id
											? "bg-primary animate-pulse"
											: "bg-muted"
								}`}
							/>
							<div className="flex-1">
								<div className="font-medium">{step.title}</div>
								<p className="text-sm text-muted-foreground">
									{step.description}
								</p>
								{currentStep === step.id && status !== "completed" && (
									<QuestStepAction
										questId={id}
										stepId={step.id}
										nextStepId={nextStepId}
										actionType={step.action_type}
										onComplete={onUpdate}
									/>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="flex items-center justify-between pt-4 text-sm text-muted-foreground border-t">
					<div className="flex items-center">
						<CalendarDays className="w-4 h-4 mr-1" />
						残り{remainingDays}日
					</div>
					<div className="flex items-center">
						<Trophy className="w-4 h-4 mr-1" />
						{rewardExp} EXP
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
