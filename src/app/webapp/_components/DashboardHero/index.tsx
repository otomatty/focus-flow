"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { UserProfile } from "./UserProfile";
import { WeeklyStats } from "./WeeklyStats";
import { SeasonInfo } from "./SeasonInfo";
import { motion } from "framer-motion";
import type {
	DashboardUserProfile,
	WeeklyStatsData,
	SeasonData,
} from "./types";

interface DashboardHeroProps {
	profile: DashboardUserProfile;
	weeklyStats: WeeklyStatsData;
	season: SeasonData;
	className?: string;
}

export function DashboardHero({
	profile,
	weeklyStats,
	season,
	className,
}: DashboardHeroProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
			className={cn("col-span-2", className)}
		>
			<Card className="relative overflow-hidden">
				<motion.div
					className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50"
					animate={{
						backgroundPosition: ["0% 0%", "100% 100%"],
					}}
					transition={{
						duration: 10,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
					}}
				/>
				<motion.div
					className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/50"
					style={{
						backgroundSize: "32px 32px",
						maskImage:
							"radial-gradient(circle at center, black, transparent 80%)",
					}}
					animate={{
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 4,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
					}}
				/>
				<div className="relative p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="md:col-span-2 space-y-6">
							<UserProfile profile={profile} />
							<WeeklyStats stats={weeklyStats} />
						</div>
						<div className="md:col-span-1">
							<SeasonInfo season={season} />
						</div>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
