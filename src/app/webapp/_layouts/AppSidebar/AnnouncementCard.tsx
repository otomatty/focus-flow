"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
	Gift,
	Users,
	ChevronLeft,
	ChevronRight,
	CircleDot,
} from "lucide-react";

interface Announcement {
	id: string;
	type: "contributor" | "promotion";
	title: string;
	description: string;
	action: {
		label: string;
		href: string;
	};
}

interface AnnouncementCardProps {
	announcements: Announcement[];
}

export function AnnouncementCard({ announcements }: AnnouncementCardProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setDirection(1);
			setCurrentIndex((prev) => (prev + 1) % announcements.length);
		}, 5000);

		return () => clearInterval(timer);
	}, [announcements.length]);

	const handlePrevious = () => {
		setDirection(-1);
		setCurrentIndex(
			(prev) => (prev - 1 + announcements.length) % announcements.length,
		);
	};

	const handleNext = () => {
		setDirection(1);
		setCurrentIndex((prev) => (prev + 1) % announcements.length);
	};

	const variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 200 : -200,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? 200 : -200,
			opacity: 0,
		}),
	};

	const getColors = (type: Announcement["type"]) => {
		switch (type) {
			case "contributor":
				return {
					border: "border-blue-200/50 dark:border-blue-700/50",
					button:
						"bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-100 dark:border-blue-500/20",
					icon: "from-blue-400/10 to-blue-500/10 dark:from-blue-500/10 dark:to-blue-600/10",
					iconColor: "text-blue-500/10 dark:text-blue-400/10",
				};
			case "promotion":
				return {
					border: "border-purple-200/50 dark:border-purple-700/50",
					button:
						"bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-100 dark:border-purple-500/20",
					icon: "from-purple-400/10 to-purple-500/10 dark:from-purple-500/10 dark:to-purple-600/10",
					iconColor: "text-purple-500/10 dark:text-purple-400/10",
				};
		}
	};

	const getIcon = (type: Announcement["type"]) => {
		const colors = getColors(type);
		switch (type) {
			case "contributor":
				return (
					<div
						className={`w-48 h-48 rounded-full bg-gradient-to-br ${colors.icon} flex items-center justify-center`}
					>
						<Users className={`w-32 h-32 ${colors.iconColor}`} />
					</div>
				);
			case "promotion":
				return (
					<div
						className={`w-48 h-48 rounded-full bg-gradient-to-br ${colors.icon} flex items-center justify-center`}
					>
						<Gift className={`w-32 h-32 ${colors.iconColor}`} />
					</div>
				);
		}
	};

	const announcement = announcements[currentIndex];
	const colors = getColors(announcement.type);

	return (
		<div className="relative">
			<Card
				className={`m-2 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 border ${colors.border} overflow-hidden`}
			>
				<CardContent className="p-6">
					<div className="relative min-h-[180px]">
						{/* 背景アイコン */}
						<div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-[0.03] dark:opacity-[0.02]">
							{getIcon(announcement.type)}
						</div>

						<AnimatePresence initial={false} custom={direction} mode="wait">
							<motion.div
								key={announcement.id}
								custom={direction}
								variants={variants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									x: { type: "spring", stiffness: 300, damping: 30 },
									opacity: { duration: 0.2 },
								}}
								className="absolute inset-0 space-y-4"
							>
								{/* ヘッダー */}
								<div className="space-y-2">
									<h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
										{announcement.title}
									</h3>
									{/* 説明文 */}
									<p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
										{announcement.description}
									</p>
								</div>

								{/* アクション */}
								<div className="pt-4 w-full">
									<Button
										variant="secondary"
										size="sm"
										className={`w-full ${colors.button}`}
										onClick={() =>
											window.open(announcement.action.href, "_blank")
										}
									>
										{announcement.action.label}
									</Button>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</CardContent>
			</Card>

			{/* ページネーション */}
			<div className="absolute left-0 right-0 bottom-4 flex items-center justify-between px-6">
				<Button
					variant="ghost"
					size="icon"
					className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50"
					onClick={handlePrevious}
				>
					<ChevronLeft className="w-4 h-4" />
				</Button>
				<div className="flex items-center gap-1.5">
					{announcements.map((announcement) => (
						<CircleDot
							key={announcement.id}
							className={`w-2 h-2 transition-colors ${
								announcements[currentIndex].id === announcement.id
									? `text-${announcement.type === "contributor" ? "blue" : "purple"}-500 dark:text-${announcement.type === "contributor" ? "blue" : "purple"}-400`
									: "text-slate-300 dark:text-slate-600"
							}`}
						/>
					))}
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50"
					onClick={handleNext}
				>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
