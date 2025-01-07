"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
	Wifi,
	Focus,
	Power,
	Target,
	Clock,
	Flame,
	Trophy,
	TrendingUp,
	CheckCircle2,
	Star,
} from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import {
	Table,
	TableHeader,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getWeeklyPartyData } from "@/app/_actions/dashboard/party";
import type { WeeklyPartyData } from "@/types/dashboard";

const statusConfig: Record<
	"online" | "focusing" | "offline",
	{ icon: LucideIcon; color: string; label: string }
> = {
	online: {
		icon: Wifi,
		color: "bg-green-500",
		label: "オンライン",
	},
	focusing: {
		icon: Focus,
		color: "bg-purple-500",
		label: "集中中",
	},
	offline: {
		icon: Power,
		color: "bg-gray-500",
		label: "オフライン",
	},
};

interface WeeklyPartyCardProps {
	members: WeeklyPartyData["members"];
	goal: WeeklyPartyData["goal"];
}

export function WeeklyPartyCard({ members, goal }: WeeklyPartyCardProps) {
	const [partyData, setPartyData] = useState<WeeklyPartyData | null>(null);

	useEffect(() => {
		const fetchPartyData = async () => {
			try {
				const data = await getWeeklyPartyData();
				setPartyData(data);
			} catch (error) {
				console.error("Failed to fetch party data:", error);
			}
		};

		fetchPartyData();
		// 5分ごとに更新
		const interval = setInterval(fetchPartyData, 5 * 60 * 1000);

		return () => clearInterval(interval);
	}, []);

	if (!partyData) {
		return null;
	}

	const progress = (goal.currentSessions / goal.targetSessions) * 100;
	const remainingDays = Math.ceil(
		(goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
	);

	return (
		<Card className="relative overflow-hidden border-none border-l border-r border-b rounded-none rounded-b-lg">
			<div className="absolute inset-0 pointer-events-none">
				<svg
					viewBox="0 0 400 120"
					className="w-full h-32 hidden md:block"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path
						d="M0,0
							L400,0
							L400,120
							L0,120
							Z"
						className="fill-background"
					/>
					<path
						d="M0,0
							L120,0
							Q140,0 140,25
							L140,60
							Q140,90 170,90
							L230,90
							Q260,90 260,60
							L260,25
							Q260,0 280,0
							L400,0
							L400,120
							L0,120
							Z"
						className="fill-white dark:fill-slate-950"
					/>
					<path
						d="M0,0
							L120,0
							Q140,0 140,25
							L140,60
							Q140,90 170,90
							L230,90
							Q260,90 260,60
							L260,25
							Q260,0 280,0
							L400,0"
						className="fill-none stroke-border"
						strokeWidth="1"
					/>
				</svg>
				<svg
					viewBox="0 0 200 100"
					className="w-full h-28 md:hidden"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path
						d="M0,0
							L200,0
							L200,100
							L0,100
							Z"
						className="fill-background"
					/>
					<path
						d="M0,0
							L50,0
							Q65,0 65,25
							L65,45
							Q65,70 85,70
							L115,70
							Q135,70 135,45
							L135,25
							Q135,0 150,0
							L200,0
							L200,100
							L0,100
							Z"
						className="fill-white dark:fill-slate-950"
					/>
					<path
						d="M0,0
							L50,0
							Q65,0 65,25
							L65,45
							Q65,70 85,70
							L115,70
							Q135,70 135,45
							L135,25
							Q135,0 150,0
							L200,0"
						className="fill-none stroke-border"
						strokeWidth="1"
					/>
				</svg>
			</div>
			{/* メンバーアバター */}
			<div className="absolute left-1/2 -translate-x-1/2 top-2 md:top-4 z-20">
				<div className="flex justify-center -space-x-1 md:space-x-2">
					{members.map((member) => {
						const StatusIcon = statusConfig[member.status].icon;
						return (
							<HoverCard key={member.id}>
								<HoverCardTrigger asChild>
									<div className="relative">
										<motion.div
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.95 }}
											className="relative cursor-pointer"
										>
											<Avatar className="h-14 w-14 md:h-16 md:w-16 border-4 border-background ring-2 ring-border">
												<AvatarImage src={member.avatarUrl || undefined} />
												<AvatarFallback>{member.name[0]}</AvatarFallback>
											</Avatar>
											<div
												className={`absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full ${statusConfig[member.status].color} ring-2 ring-background flex items-center justify-center`}
											>
												<StatusIcon className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
											</div>
										</motion.div>
									</div>
								</HoverCardTrigger>
								<HoverCardContent
									align="center"
									side="bottom"
									sideOffset={12}
									className="w-80 z-30"
								>
									<div className="space-y-4 p-4">
										{/* ユーザー情報 */}
										<div className="flex items-center gap-3">
											<Avatar className="h-12 w-12">
												<AvatarImage src={member.avatarUrl || undefined} />
												<AvatarFallback>{member.name[0]}</AvatarFallback>
											</Avatar>
											<div>
												<div className="flex items-center gap-2">
													<h4 className="font-semibold">{member.name}</h4>
													<Badge variant="outline">Lv.{member.level}</Badge>
												</div>
												<Badge
													variant="secondary"
													className={`mt-1 ${statusConfig[member.status].color} text-white`}
												>
													<StatusIcon className="w-3 h-3 mr-1" />
													{statusConfig[member.status].label}
												</Badge>
											</div>
										</div>

										{/* 統計情報 */}
										<div className="grid grid-cols-2 gap-2 text-sm">
											<div className="flex items-center gap-1">
												<Trophy className="w-3 h-3 text-yellow-500" />
												<span className="text-muted-foreground">ポイント:</span>
												<span className="font-medium">
													{member.weeklyStats.points}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<Flame className="w-3 h-3 text-orange-500" />
												<span className="text-muted-foreground">
													ストリーク:
												</span>
												<span className="font-medium">
													{member.weeklyStats.streak}日
												</span>
											</div>
											<div className="flex items-center gap-1">
												<TrendingUp className="w-3 h-3 text-green-500" />
												<span className="text-muted-foreground">成長率:</span>
												<span className="font-medium">
													{member.weeklyStats.growth}%
												</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="w-3 h-3 text-blue-500" />
												<span className="text-muted-foreground">
													最終アクティブ:
												</span>
												<span className="font-medium">
													{formatDistanceToNow(member.weeklyStats.lastActive, {
														addSuffix: true,
														locale: ja,
													})}
												</span>
											</div>
										</div>

										{/* セッション進捗 */}
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">
													セッション進捗
												</span>
												<span>
													{member.weeklyStats.completedSessions} /{" "}
													{member.weeklyStats.plannedSessions}
												</span>
											</div>
											<Progress
												value={
													(member.weeklyStats.completedSessions /
														member.weeklyStats.plannedSessions) *
													100
												}
												className="h-1"
											/>
										</div>
									</div>
								</HoverCardContent>
							</HoverCard>
						);
					})}
				</div>
			</div>
			<CardHeader className="pb-3 relative pt-24 md:pt-28">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg md:text-xl font-bold">
						今週のパーティー
					</CardTitle>
					<Badge variant="secondary" className="font-normal text-xs md:text-sm">
						残り {remainingDays} 日
					</Badge>
				</div>
				<div className="mt-4 space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">パーティー目標達成度</span>
						<span className="font-medium">{Math.round(progress)}%</span>
					</div>
					<div className="relative">
						<div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
								style={{ width: `${progress}%` }}
							>
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
									animate={{
										x: ["0%", "200%"],
									}}
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
										ease: "linear",
									}}
									style={{ opacity: 0.2 }}
								/>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Target className="w-4 h-4" />
						<span>
							目標セッション: {goal.currentSessions} / {goal.targetSessions}
						</span>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-6">
					<div className="rounded-lg border bg-card">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">メンバー</TableHead>
									<TableHead>週間集中時間</TableHead>
									<TableHead>完了タスク</TableHead>
									<TableHead>獲得ポイント</TableHead>
									<TableHead>ストリーク</TableHead>
									<TableHead>目標達成率</TableHead>
									<TableHead>MVP回数</TableHead>
									<TableHead>特別貢献</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{members.map((member) => {
									const achievementRate =
										(member.weeklyStats.completedSessions /
											member.weeklyStats.plannedSessions) *
										100;
									return (
										<TableRow key={member.id}>
											<TableCell>
												<div className="flex items-center gap-2">
													<Avatar className="h-8 w-8">
														<AvatarImage src={member.avatarUrl || undefined} />
														<AvatarFallback>{member.name[0]}</AvatarFallback>
													</Avatar>
													<div className="flex flex-col">
														<span className="text-sm font-medium">
															{member.name}
														</span>
														<span className="text-xs text-muted-foreground">
															Lv.{member.level}
														</span>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Clock className="w-4 h-4 text-blue-500" />
													<span>{member.weeklyStats.focusTime}時間</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<CheckCircle2 className="w-4 h-4 text-green-500" />
													<span>{member.weeklyStats.achievementCount}件</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Trophy className="w-4 h-4 text-yellow-500" />
													<span>{member.weeklyStats.points}pt</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Flame className="w-4 h-4 text-orange-500" />
													<span>{member.weeklyStats.streak}日</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<div className="w-16">
														<Progress value={achievementRate} className="h-2" />
													</div>
													<span className="text-sm">
														{Math.round(achievementRate)}%
													</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Star className="w-4 h-4 text-purple-500" />
													<span>{member.weeklyStats.contribution}回</span>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="secondary" className="font-normal">
													{member.weeklyStats.bestFocusTime}分
												</Badge>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
