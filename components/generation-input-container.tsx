import type React from "react";

interface GenerationInputContainerProps {
	children: React.ReactNode;
}

export function GenerationInputContainer({
	children,
}: GenerationInputContainerProps) {
	return (
		<div className="relative rounded-lg border-2 border-[#39FF14] bg-zinc-900/90 p-4 shadow-[0_0_15px_rgba(57,255,20,0.5),inset_0_0_15px_rgba(57,255,20,0.1)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(57,255,20,0.7),inset_0_0_20px_rgba(57,255,20,0.15)]">
			{children}
		</div>
	);
}
