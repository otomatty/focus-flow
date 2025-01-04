"use client";

import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
	getUserLevel,
	getNextLevelExp,
	getLevelSetting,
} from "@/app/_actions/users/level";
import type { UserLevel, LevelSetting } from "@/types/users";

export function UserLevelDisplay() {
	const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
	const [nextLevelExp, setNextLevelExp] = useState<number | null>(null);
	const [levelSetting, setLevelSetting] = useState<LevelSetting | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchLevelData = async () => {
			try {
				const level = await getUserLevel();
				setUserLevel(level);
				const nextExp = await getNextLevelExp(level.current_level);
				setNextLevelExp(nextExp);
				const setting = await getLevelSetting(level.current_level);
				setLevelSetting(setting);
			} catch (error) {
				console.error("レベル情報の取得に失敗しました:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLevelData();
	}, []);

	if (isLoading || !userLevel || !nextLevelExp || !levelSetting) {
		return null;
	}

	const expPercentage = (userLevel.current_exp / nextLevelExp) * 100;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					className={cn(
						"group relative flex items-center gap-3",
						"rounded-xl px-4 py-2",
						"bg-gradient-to-b from-background/80 to-muted/20",
						"transition-all duration-500",
						"hover:from-muted/10 hover:to-muted/30",
						"border border-border/50",
					)}
				>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Star className="h-5 w-5 text-amber-500" fill="currentColor" />
							<span
								className={cn(
									"text-base font-bold tabular-nums tracking-tight",
									"bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-400 bg-clip-text text-transparent",
									"transition-all duration-500",
									"group-hover:from-amber-400 group-hover:via-yellow-300 group-hover:to-orange-300",
								)}
							>
								Lv.{userLevel.current_level}
							</span>
						</div>
						<div className="relative w-28">
							<Progress
								value={expPercentage}
								className={cn(
									"h-2.5 rounded-full",
									"bg-muted/20",
									"overflow-hidden",
									"border border-border/50",
									"transition-all duration-500",
									"[&>div]:bg-gradient-to-r",
									"[&>div]:from-amber-500 [&>div]:via-yellow-400 [&>div]:to-orange-400",
									"[&>div]:group-hover:from-amber-400 [&>div]:group-hover:via-yellow-300 [&>div]:group-hover:to-orange-300",
									"[&>div]:transition-all [&>div]:duration-500",
								)}
							/>
						</div>
					</div>
				</TooltipTrigger>
				<TooltipContent
					side="bottom"
					className={cn(
						"text-sm rounded-xl",
						"bg-gradient-to-b from-popover to-popover/95",
						"border border-border/50",
						"shadow-lg",
					)}
				>
					<div className="flex flex-col gap-2 p-1.5">
						<div className="flex items-center gap-2 border-b border-border/50 pb-2">
							<Star className="h-4 w-4 text-amber-500" fill="currentColor" />
							<p className="font-semibold">{levelSetting.rewards.title}</p>
						</div>
						<div className="space-y-2 px-1">
							<div className="flex items-center justify-between gap-3">
								<span className="text-muted-foreground">経験値:</span>
								<span className="tabular-nums font-medium">
									{userLevel.current_exp.toLocaleString()} /{" "}
									{nextLevelExp.toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between gap-3">
								<span className="text-muted-foreground">次のレベルまで:</span>
								<span className="tabular-nums font-medium text-amber-500">
									{(nextLevelExp - userLevel.current_exp).toLocaleString()}
								</span>
							</div>
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
