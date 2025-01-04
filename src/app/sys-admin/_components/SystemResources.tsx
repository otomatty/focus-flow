"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, HardDrive, Activity } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import type { ApiRequestData } from "@/app/_actions/admin/metrics";

interface ResourceMetric {
	name: string;
	value: number;
	limit: number;
	unit: string;
	status: "normal" | "warning" | "critical";
	icon: React.ReactNode;
}

interface SystemResourcesProps {
	resourceMetrics: {
		dbSize: number;
		storageSize: number;
		realtimeConnections: number;
	};
	apiRequestData: ApiRequestData[];
}

function getResourceStatus(
	value: number,
	limit: number,
): ResourceMetric["status"] {
	const ratio = value / limit;
	if (ratio >= 0.9) return "critical";
	if (ratio >= 0.7) return "warning";
	return "normal";
}

function getStatusColor(status: ResourceMetric["status"]) {
	switch (status) {
		case "normal":
			return "bg-success text-success-foreground";
		case "warning":
			return "bg-warning text-warning-foreground";
		case "critical":
			return "bg-destructive text-destructive-foreground";
	}
}

function getStatusLabel(status: ResourceMetric["status"]) {
	switch (status) {
		case "normal":
			return "正常";
		case "warning":
			return "警告";
		case "critical":
			return "危険";
	}
}

export function SystemResources({
	resourceMetrics,
	apiRequestData,
}: SystemResourcesProps) {
	const RESOURCE_METRICS: ResourceMetric[] = [
		{
			name: "データベース容量",
			value: Math.round(resourceMetrics.dbSize),
			limit: 500,
			unit: "MB",
			status: getResourceStatus(resourceMetrics.dbSize, 500),
			icon: <Database className="h-4 w-4" />,
		},
		{
			name: "ストレージ使用量",
			value: Math.round(resourceMetrics.storageSize * 10) / 10,
			limit: 20,
			unit: "GB",
			status: getResourceStatus(resourceMetrics.storageSize, 20),
			icon: <HardDrive className="h-4 w-4" />,
		},
		{
			name: "リアルタイム接続",
			value: resourceMetrics.realtimeConnections,
			limit: 1000,
			unit: "接続",
			status: getResourceStatus(resourceMetrics.realtimeConnections, 1000),
			icon: <Activity className="h-4 w-4" />,
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>システムリソース</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* リソースメトリクス */}
				<div className="space-y-4">
					{RESOURCE_METRICS.map((metric) => (
						<div key={metric.name} className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{metric.icon}
									<span className="text-sm font-medium">{metric.name}</span>
								</div>
								<Badge
									variant="secondary"
									className={getStatusColor(metric.status)}
								>
									{getStatusLabel(metric.status)}
								</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Progress
									value={(metric.value / metric.limit) * 100}
									className="h-2"
								/>
								<span className="text-sm text-muted-foreground w-32">
									{metric.value}/{metric.limit} {metric.unit}
								</span>
							</div>
						</div>
					))}
				</div>

				{/* APIリクエストグラフ */}
				<div>
					<h3 className="text-sm font-medium mb-4">APIリクエスト（24時間）</h3>
					<div className="h-[200px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={apiRequestData}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis
									dataKey="time"
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip />
								<Legend />
								<Bar
									dataKey="count"
									name="リクエスト数"
									fill="#0ea5e9"
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey="error"
									name="エラー"
									fill="#ef4444"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
