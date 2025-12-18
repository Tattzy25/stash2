"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

interface PromptTextareaProps {
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	onSubmit?: () => void;
	isLoading?: boolean;
	placeholder?: string;
	label?: string;
	rows?: number;
	className?: string;
	showButton?: boolean;
}

export function PromptTextarea({
	value,
	onChange,
	onKeyDown,
	onSubmit,
	isLoading = false,
	placeholder = "Enter your prompt here...",
	label = "Prompt",
	rows = 3,
	className = "",
	showButton = false,
}: PromptTextareaProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="prompt" className="font-medium">
				{label}
			</Label>
			<InputGroup className={className}>
				<InputGroupTextarea
					id="prompt"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					rows={rows}
				/>
			</InputGroup>
			{showButton && (
				<div className="pt-2">
					<Button
						onClick={onSubmit}
						disabled={isLoading || !value.trim()}
						size="lg"
						className="w-full rounded-full"
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Create Now
					</Button>
				</div>
			)}
		</div>
	);
}
