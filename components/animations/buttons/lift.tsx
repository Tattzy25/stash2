"use client";

import { motion } from "motion/react";
import { useHoverLift } from "@/lib/hooks/use-hover-lift";

export function LiftButton({ children }: { children: React.ReactNode }) {
	const liftProps = useHoverLift();

	return (
		<motion.button
			{...liftProps}
			className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
		>
			{children}
		</motion.button>
	);
}
