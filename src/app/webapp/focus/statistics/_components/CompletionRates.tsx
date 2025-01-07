import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface CompletionRatesProps {
	perfect: number | null;
	completed: number | null;
	partial: number | null;
	abandoned: number | null;
	perfectRate: number | null;
	completionRate: number | null;
}

export function CompletionRates({
	perfect = 0,
	completed = 0,
	partial = 0,
	abandoned = 0,
	perfectRate = 0,
	completionRate = 0,
}: CompletionRatesProps) {
	const total =
		(perfect || 0) + (completed || 0) + (partial || 0) + (abandoned || 0);

	const calculatePercentage = (value: number | null) => {
		if (!value || total === 0) return 0;
		return Math.round((value / total) * 100);
	};

	const statuses = [
		{
			label: "完璧",
			value: perfect || 0,
			percentage: calculatePercentage(perfect),
			icon: CheckCircle2,
			color: "text-green-500",
		},
		{
			label: "完了",
			value: completed || 0,
			percentage: calculatePercentage(completed),
			icon: CheckCircle,
			color: "text-blue-500",
		},
		{
			label: "部分的",
			value: partial || 0,
			percentage: calculatePercentage(partial),
			icon: AlertCircle,
			color: "text-yellow-500",
		},
		{
			label: "中断",
			value: abandoned || 0,
			percentage: calculatePercentage(abandoned),
			icon: XCircle,
			color: "text-red-500",
		},
	];

	return (
		<Card className="p-6">
			<h2 className="text-xl font-semibold mb-4">完了状態の分布</h2>

			{/* 達成率の表示 */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div>
					<p className="text-sm text-muted-foreground">完璧達成率</p>
					<p className="text-2xl font-bold">{perfectRate?.toFixed(1)}%</p>
				</div>
				<div>
					<p className="text-sm text-muted-foreground">完了率</p>
					<p className="text-2xl font-bold">{completionRate?.toFixed(1)}%</p>
				</div>
			</div>

			{/* 状態別の分布 */}
			<div className="space-y-4">
				{statuses.map((status) => (
					<div key={status.label} className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<status.icon className={`h-4 w-4 ${status.color}`} />
								<span className="text-sm">{status.label}</span>
							</div>
							<span className="text-sm font-medium">
								{status.value}回 ({status.percentage}%)
							</span>
						</div>
						<Progress value={status.percentage} className="h-2" />
					</div>
				))}
			</div>
		</Card>
	);
}
