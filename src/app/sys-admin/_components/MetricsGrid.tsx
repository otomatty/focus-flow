"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { SystemMetrics } from "@/app/_actions/admin/metrics";

interface MetricCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon: React.ReactNode;
	chart?: React.ReactNode;
}

function MetricCard({
	title,
	value,
	description,
	icon,
	chart,
}: MetricCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4">
					<div>
						<div className="text-2xl font-bold">{value}</div>
						{description && (
							<p className="text-xs text-muted-foreground">{description}</p>
						)}
					</div>
					{chart && <div className="flex-1">{chart}</div>}
				</div>
			</CardContent>
		</Card>
	);
}

function DonutChart({
	data,
}: { data: { name: string; value: number; color: string }[] }) {
	return (
		<div className="h-[60px]">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={20}
						outerRadius={25}
						paddingAngle={2}
						dataKey="value"
					>
						{data.map((entry) => (
							<Cell key={entry.name} fill={entry.color} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}

interface MetricsGridProps {
	metrics: SystemMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
	const userActivityData = [
		{ name: "アクティブ", value: metrics.activeUsers.today, color: "#0ea5e9" },
		{
			name: "非アクティブ",
			value: metrics.activeUsers.total - metrics.activeUsers.today,
			color: "#6b7280",
		},
	];

	const taskData = [
		{ name: "完了", value: metrics.tasks.completed, color: "#10b981" },
		{ name: "未完了", value: metrics.tasks.pending, color: "#6b7280" },
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<MetricCard
				title="アクティブユーザー"
				value={metrics.activeUsers.total.toLocaleString()}
				description="過去30日間"
				icon={<Users className="h-4 w-4 text-muted-foreground" />}
			/>
			<MetricCard
				title="本日のアクティブユーザー"
				value={metrics.activeUsers.today.toLocaleString()}
				description={`新規: ${metrics.activeUsers.newUsers}人`}
				icon={<Activity className="h-4 w-4 text-muted-foreground" />}
				chart={<DonutChart data={userActivityData} />}
			/>
			<MetricCard
				title="完了済みタスク"
				value={metrics.tasks.completed.toLocaleString()}
				description="過去30日間"
				icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
				chart={<DonutChart data={taskData} />}
			/>
			<MetricCard
				title="未完了タスク"
				value={metrics.tasks.pending.toLocaleString()}
				description={`期限切れ: ${metrics.tasks.overdue}件`}
				icon={<Clock className="h-4 w-4 text-muted-foreground" />}
			/>
		</div>
	);
}
