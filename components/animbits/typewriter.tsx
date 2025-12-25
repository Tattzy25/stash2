"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface TypewriterProps {
	children: ReactNode;
	speed?: number;
	className?: string;
	style?: React.CSSProperties;
}

export function Typewriter({
	children,
	speed = 50,
	className,
	style,
}: TypewriterProps) {
	const text = typeof children === "string" ? children : "";

	return (
		<motion.span
			className={className}
			style={style}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			{text}
		</motion.span>
	);
}

// Export as 'l' for convenience
export const l = Typewriter;
