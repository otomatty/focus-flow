"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	AreaChart,
	Area,
	Legend,
} from "recharts";
import type {
	UserActivityData,
	TaskCompletionData,
} from "@/app/_actions/admin/metrics";

interface PerformanceChartsProps {
	userActivityData: UserActivityData[];
	taskCompletionData: TaskCompletionData[];
}

export function PerformanceCharts({
	userActivityData,
	taskCompletionData,
}: PerformanceChartsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>パフォーマンス分析</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="users" className="space-y-4">
					<TabsList>
						<TabsTrigger value="users">ユーザーアクティビティ</TabsTrigger>
						<TabsTrigger value="tasks">タスク完了率</TabsTrigger>
					</TabsList>

					<TabsContent value="users">
						<div className="h-[400px]">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={userActivityData}>
									<defs>
										<linearGradient
											id="userActivity"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
										</linearGradient>
										<linearGradient id="newUsers" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis
										dataKey="date"
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
										tickFormatter={(value) => `${value}人`}
									/>
									<Tooltip />
									<Legend />
									<Area
										type="monotone"
										dataKey="users"
										name="アクティブユーザー"
										stroke="#0ea5e9"
										fillOpacity={1}
										fill="url(#userActivity)"
									/>
									<Area
										type="monotone"
										dataKey="newUsers"
										name="新規ユーザー"
										stroke="#10b981"
										fillOpacity={1}
										fill="url(#newUsers)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</TabsContent>

					<TabsContent value="tasks">
						<div className="h-[400px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={taskCompletionData}>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis
										dataKey="date"
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
										tickFormatter={(value) => `${value}%`}
									/>
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="completed"
										name="完了率"
										stroke="#10b981"
										strokeWidth={2}
										dot={{ fill: "#10b981" }}
									/>
									<Line
										type="monotone"
										dataKey="overdue"
										name="期限切れ率"
										stroke="#ef4444"
										strokeWidth={2}
										dot={{ fill: "#ef4444" }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
