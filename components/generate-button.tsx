import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
	onClick: () => void;
	isLoading?: boolean;
	disabled?: boolean;
	children: React.ReactNode;
	size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	className?: string;
}

export function GenerateButton({
	onClick,
	isLoading = false,
	disabled = false,
	children,
	size = "lg",
	variant = "default",
	className = "w-full rounded-full",
}: GenerateButtonProps) {
	return (
		<Button
			onClick={onClick}
			disabled={disabled || isLoading}
			size={size}
			variant={variant}
			className={className}
		>
			{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{children}
		</Button>
	);
}
