"use client";

import { cn } from "@/lib/utils";
import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import type { ElementType } from "react";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
	children: React.ReactNode;
	as?: ElementType;
	delay?: number;
}

const fadeInUp: Variants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

export function AnimatedSection({
	children,
	as = "div",
	className,
	delay = 0,
	...props
}: AnimatedSectionProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={fadeInUp}
			transition={{ delay }}
			className={cn(className)}
			{...props}
		>
			{children}
		</motion.div>
	);
}
