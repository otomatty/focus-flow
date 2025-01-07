"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Badge {
	id: string;
	badge: {
		id: string;
		name: string;
		description: string;
		imageUrl: string;
	};
	acquired_at: string;
}

interface BadgesListProps {
	badges: Badge[];
}

export function BadgesList({ badges }: BadgesListProps) {
	if (badges.length === 0) {
		return (
			<Card className="bg-card/50 backdrop-blur-sm border-border/50">
				<CardHeader>
					<CardTitle className="text-primary">獲得バッジ</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-center">
						まだバッジを獲得していません
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-card/50 backdrop-blur-sm border-border/50">
			<CardHeader>
				<CardTitle className="text-primary">獲得バッジ</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-3 gap-4">
					{badges.map((badge, index) => (
						<motion.div
							key={badge.id}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								delay: index * 0.1,
								type: "spring",
								stiffness: 100,
							}}
						>
							<HoverCard>
								<HoverCardTrigger>
									<div
										className={cn(
											"relative p-4 rounded-lg text-center transition-all",
											"bg-gradient-to-b from-background/80 to-background/40",
											"hover:shadow-lg hover:shadow-primary/5",
											"hover:scale-105 hover:from-primary/20 hover:to-primary/5",
											"group cursor-pointer",
										)}
									>
										<div className="relative">
											<div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-primary-foreground opacity-0 group-hover:opacity-30 transition-opacity blur" />
											<Image
												src={badge.badge.imageUrl}
												alt={badge.badge.name}
												width={64}
												height={64}
												className="mx-auto relative"
											/>
										</div>
										<p className="text-sm mt-2 font-medium text-primary group-hover:text-primary">
											{badge.badge.name}
										</p>
									</div>
								</HoverCardTrigger>
								<HoverCardContent
									className="w-80 bg-card/95 backdrop-blur-sm border-border/50"
									align="center"
								>
									<div className="space-y-4">
										<div className="flex items-center space-x-4">
											<div className="relative">
												<div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-primary-foreground opacity-30 blur" />
												<Image
													src={badge.badge.imageUrl}
													alt={badge.badge.name}
													width={48}
													height={48}
													className="relative"
												/>
											</div>
											<div>
												<h4 className="text-sm font-semibold text-primary">
													{badge.badge.name}
												</h4>
												<p className="text-xs text-muted-foreground">
													獲得日:{" "}
													{new Date(badge.acquired_at).toLocaleDateString()}
												</p>
											</div>
										</div>
										<p className="text-sm text-muted-foreground">
											{badge.badge.description}
										</p>
									</div>
								</HoverCardContent>
							</HoverCard>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
