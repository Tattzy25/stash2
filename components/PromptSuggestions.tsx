"use client";

import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Suggestion } from "@/lib/suggestions";

interface PromptSuggestionsProps {
	suggestions: Suggestion[];
	onSelect: (prompt: string) => void;
	disabled?: boolean;
}

export function PromptSuggestions({
	suggestions,
	onSelect,
	disabled = false,
}: PromptSuggestionsProps) {
	return (
		<div className="relative flex-grow overflow-hidden">
			<ScrollArea className="w-full whitespace-nowrap rounded-md">
				<div className="flex items-center gap-2">
					<div className="flex gap-2 py-1">
						{suggestions.map((suggestion) => (
							<Button
								className="h-8 shrink-0 gap-1.5"
								disabled={disabled}
								key={suggestion.text}
								onClick={() => onSelect(suggestion.prompt)}
								size="sm"
								variant="secondary"
							>
								<Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />
								{suggestion.text}
							</Button>
						))}
					</div>
				</div>
				<ScrollBar className="h-2.5" orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
