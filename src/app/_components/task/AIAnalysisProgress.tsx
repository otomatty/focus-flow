import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Brain,
	Link,
	Wrench,
} from "lucide-react";
import type { AIAnalysis } from "@/types/task";

interface AIAnalysisProgressProps {
	analysis: AIAnalysis | null;
	isAnalyzing: boolean;
}

export function AIAnalysisProgress({
	analysis,
	isAnalyzing,
}: AIAnalysisProgressProps) {
	const evaluationCategories = [
		{
			key: "specificity" as const,
			label: "具体性",
			icon: AlertCircle,
			description: "タスクの目的と成果物の明確さ",
		},
		{
			key: "timeConstraints" as const,
			label: "時間的制約",
			icon: Clock,
			description: "完了までの時間見積もりと期限",
		},
		{
			key: "skillRequirements" as const,
			label: "スキル要件",
			icon: Brain,
			description: "必要なスキルとレベル",
		},
		{
			key: "dependencies" as const,
			label: "依存関係",
			icon: Link,
			description: "前提条件と他のタスクへの影響",
		},
		{
			key: "resources" as const,
			label: "リソース",
			icon: Wrench,
			description: "必要なリソースと利用可能性",
		},
	] as const;

	if (isAnalyzing) {
		return (
			<Card className="p-6 space-y-4">
				<h3 className="text-lg font-semibold">AI分析中...</h3>
				<Progress value={undefined} className="w-full" />
			</Card>
		);
	}

	if (!analysis) return null;

	const { feasibilityAnalysis } = analysis;
	const isExecutable = feasibilityAnalysis.isExecutable;

	return (
		<Card className="p-6 space-y-6">
			<div className="flex items-center gap-2">
				{isExecutable ? (
					<CheckCircle2 className="h-6 w-6 text-green-500" />
				) : (
					<AlertCircle className="h-6 w-6 text-yellow-500" />
				)}
				<h3 className="text-lg font-semibold">
					{isExecutable ? "実行可能なタスクです" : "改善が必要なタスクです"}
				</h3>
			</div>

			<div className="space-y-4">
				{evaluationCategories.map(({ key, label, icon: Icon, description }) => {
					const score = feasibilityAnalysis.evaluationDetails[key].score;
					const comments = feasibilityAnalysis.evaluationDetails[key].comments;

					return (
						<div key={key} className="space-y-2">
							<div className="flex items-center gap-2">
								<Icon className="h-5 w-5 text-muted-foreground" />
								<div className="flex-1">
									<div className="flex justify-between items-center">
										<span className="font-medium">{label}</span>
										<span className="text-sm text-muted-foreground">
											{score}/100
										</span>
									</div>
									<Progress value={score} className="h-2" />
								</div>
							</div>
							<p className="text-sm text-muted-foreground">{description}</p>
							{comments.length > 0 && (
								<ul className="text-sm space-y-1 ml-6 list-disc">
									{comments.map((comment) => (
										<li key={comment}>{comment}</li>
									))}
								</ul>
							)}
						</div>
					);
				})}
			</div>

			{!isExecutable && (
				<div className="space-y-2">
					<h4 className="font-medium">改善が必要な点：</h4>
					<ul className="space-y-1 ml-6 list-disc">
						{feasibilityAnalysis.reasonsIfNotExecutable.map((reason) => (
							<li key={reason} className="text-yellow-600">
								{reason}
							</li>
						))}
					</ul>
					<h4 className="font-medium mt-4">改善提案：</h4>
					<ul className="space-y-1 ml-6 list-disc">
						{feasibilityAnalysis.suggestedImprovements.map((suggestion) => (
							<li key={suggestion} className="text-blue-600">
								{suggestion}
							</li>
						))}
					</ul>
				</div>
			)}
		</Card>
	);
}
