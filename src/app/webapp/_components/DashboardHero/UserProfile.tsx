"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "@/stores/userProfileAtom";
import type { DashboardUserProfile } from "./types";

interface UserProfileProps {
	profile: DashboardUserProfile;
}

export function UserProfile({ profile }: UserProfileProps) {
	const userProfile = useAtomValue(userProfileAtom);
	const levelProgress =
		(profile.level.current_exp / profile.level.total_exp) * 100;
	const expPoints = [20, 40, 60, 80, 100];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex items-center space-x-4"
		>
			<div className="relative">
				<motion.div
					animate={{
						scale: [1, 1.05, 1],
						rotate: [0, 5, -5, 0],
					}}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
				/>
				<Avatar className="w-16 h-16 border-2 border-white dark:border-slate-800 relative">
					<AvatarImage src={userProfile?.profileImage || undefined} />
					<AvatarFallback>
						{userProfile?.displayName?.slice(0, 2) || "??"}
					</AvatarFallback>
				</Avatar>
				<div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white dark:border-slate-800">
					Lv.{profile.level.current_level}
				</div>
			</div>
			<div className="flex-1 space-y-2">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-bold text-slate-900 dark:text-white">
						{userProfile?.displayName || "ユーザー"}
					</h2>
					<div className="flex items-center space-x-1 px-3 py-1 bg-orange-500/10 rounded-full">
						<Flame className="w-4 h-4 text-orange-500" />
						<span className="text-sm font-medium text-orange-600 dark:text-orange-400">
							{profile.streak.current}日連続
						</span>
					</div>
				</div>
				<div className="space-y-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-slate-500 dark:text-slate-400">
							レベル進捗
						</span>
						<span className="text-slate-700 dark:text-slate-300">
							{Math.floor(levelProgress)}%
						</span>
					</div>
					<div className="relative">
						<div className="absolute -top-1.5 left-0 w-full flex justify-between px-0.5">
							{expPoints.map((point) => (
								<div
									key={point}
									className={cn(
										"w-1.5 h-1.5 rounded-full border border-white dark:border-slate-800",
										levelProgress >= point
											? "bg-gradient-to-r from-yellow-400 to-yellow-500"
											: "bg-slate-200 dark:bg-slate-700",
									)}
								/>
							))}
						</div>
						<div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-full relative"
								style={{ width: `${levelProgress}%` }}
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
				</div>
				<div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
					<span>最高ストリーク: {profile.streak.best}日</span>
					<span>
						次のレベルまで:{" "}
						{profile.level.total_exp - profile.level.current_exp}exp
					</span>
				</div>
			</div>
		</motion.div>
	);
}
