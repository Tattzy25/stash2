"use client";

import { useState } from "react";

export function useHoverLift() {
	const [isHovered, setIsHovered] = useState(false);

	const liftProps = {
		onMouseEnter: () => setIsHovered(true),
		onMouseLeave: () => setIsHovered(false),
		whileHover: { y: -2, transition: { duration: 0.1 } },
		whileTap: { y: 0, transition: { duration: 0.1 } },
	};

	return liftProps;
}
