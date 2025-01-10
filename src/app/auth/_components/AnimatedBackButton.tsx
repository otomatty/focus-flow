"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function AnimatedBackButton() {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="absolute left-4 top-4 md:left-8 md:top-8"
		>
			<Button
				variant="ghost"
				className="group transition-colors duration-200 hover:bg-background/80"
				asChild
			>
				<Link href="/">
					<ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
					トップページ
				</Link>
			</Button>
		</motion.div>
	);
}
