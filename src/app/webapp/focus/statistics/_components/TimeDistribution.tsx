import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sun, Sunset, Moon } from "lucide-react";

interface TimeDistributionProps {
	morning: number | null;
	afternoon: number | null;
	evening: number | null;
	night: number | null;
}

export function TimeDistribution({
	morning = 0,
	afternoon = 0,
	evening = 0,
	night = 0,
}: TimeDistributionProps) {
	const total =
		(morning || 0) + (afternoon || 0) + (evening || 0) + (night || 0);

	const calculatePercentage = (value: number | null) => {
		if (!value || total === 0) return 0;
		return Math.round((value / total) * 100);
	};

	const timeSlots = [
		{
			label: "朝（5-11時）",
			value: morning || 0,
			percentage: calculatePercentage(morning),
			icon: Sun,
			color: "text-yellow-500",
		},
		{
			label: "昼（11-17時）",
			value: afternoon || 0,
			percentage: calculatePercentage(afternoon),
			icon: Sun,
			color: "text-orange-500",
		},
		{
			label: "夕方（17-23時）",
			value: evening || 0,
			percentage: calculatePercentage(evening),
			icon: Sunset,
			color: "text-blue-500",
		},
		{
			label: "夜（23-5時）",
			value: night || 0,
			percentage: calculatePercentage(night),
			icon: Moon,
			color: "text-indigo-500",
		},
	];

	return (
		<Card className="p-6">
			<h2 className="text-xl font-semibold mb-4">時間帯別の集中</h2>
			<div className="space-y-4">
				{timeSlots.map((slot) => (
					<div key={slot.label} className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<slot.icon className={`h-4 w-4 ${slot.color}`} />
								<span className="text-sm">{slot.label}</span>
							</div>
							<span className="text-sm font-medium">
								{slot.value}回 ({slot.percentage}%)
							</span>
						</div>
						<Progress value={slot.percentage} className="h-2" />
					</div>
				))}
			</div>
		</Card>
	);
}
