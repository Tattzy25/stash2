"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";

type QualityMode = "performance" | "quality";

interface Suggestion {
	text: string;
}

interface PromptInputProps {
	onSubmit: (prompt: string) => void;
	isLoading?: boolean;
	showProviders: boolean;
	onToggleProviders: () => void;
	mode: QualityMode;
	onModeChange: (mode: QualityMode) => void;
	suggestions?: Suggestion[];
}

export function PromptInput({ isLoading, onSubmit }: PromptInputProps) {
	const [input, setInput] = useState("");

	const handleSubmit = () => {
		if (!isLoading && input.trim()) {
			onSubmit(input);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (!isLoading && input.trim()) {
				onSubmit(input);
			}
		}
	};

	return (
		<div className="w-full space-y-4">
			<InputGroup>
				<InputGroupTextarea
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Enter your prompt here"
					rows={3}
					value={input}
					className="min-h-[80px] max-h-[200px] resize-y overflow-y-auto"
				/>
			</InputGroup>
			<Button
				onClick={handleSubmit}
				disabled={isLoading || !input.trim()}
				size="lg"
				className="w-full rounded-full"
			>
				{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				Create Now
			</Button>
		</div>
	);
}
