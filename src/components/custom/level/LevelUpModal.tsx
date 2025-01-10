"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface LevelUpModalProps {
	prevLevel: number;
	newLevel: number;
	currentExp: number;
	nextLevelExp: number;
	onClose: () => void;
}

export function LevelUpModal({
	prevLevel,
	newLevel,
	currentExp,
	nextLevelExp,
	onClose,
}: LevelUpModalProps) {
	const { width, height } = useWindowSize();
	const [showConfetti, setShowConfetti] = useState(true);
	const [count, setCount] = useState(prevLevel);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (count < newLevel) {
				setCount(count + 1);
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, [count, newLevel]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowConfetti(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center">
				{showConfetti && (
					<Confetti width={width} height={height} recycle={false} />
				)}
				<motion.div
					className="fixed inset-0 bg-background/80 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				/>
				<motion.div
					className="z-50 w-full max-w-lg p-4"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ type: "spring", duration: 0.5 }}
				>
					<Card className="relative overflow-hidden p-6">
						<motion.div
							className="absolute inset-0 -z-10"
							initial={{ scale: 0 }}
							animate={{ scale: 2 }}
							transition={{ duration: 0.5 }}
						>
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-30" />
						</motion.div>

						<div className="space-y-6 text-center">
							<motion.div
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="flex items-center justify-center gap-2"
							>
								<Sparkles className="h-6 w-6 text-yellow-500" />
								<h2 className="text-2xl font-bold">Level Up!</h2>
								<Sparkles className="h-6 w-6 text-yellow-500" />
							</motion.div>

							<motion.div
								className="flex items-center justify-center gap-4 text-4xl font-bold"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.4 }}
							>
								<span className="text-muted-foreground">{prevLevel}</span>
								<span className="text-2xl text-muted-foreground">→</span>
								<motion.span
									className="text-6xl text-primary"
									initial={{ scale: 1 }}
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 0.3, delay: 0.6 }}
								>
									{count}
								</motion.span>
							</motion.div>

							<motion.div
								className="space-y-2"
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.8 }}
							>
								<p className="text-muted-foreground">次のレベルまで</p>
								<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
									<motion.div
										className="h-full bg-primary"
										initial={{ width: "0%" }}
										animate={{ width: `${(currentExp / nextLevelExp) * 100}%` }}
										transition={{ delay: 1, duration: 0.5 }}
									/>
								</div>
								<p className="text-sm text-muted-foreground">
									{currentExp} / {nextLevelExp} EXP
								</p>
							</motion.div>

							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 1.2 }}
							>
								<Button className="w-full" size="lg" onClick={onClose}>
									閉じる
								</Button>
							</motion.div>
						</div>
					</Card>
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
