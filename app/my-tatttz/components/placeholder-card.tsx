import { Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface PlaceholderCardProps {
	type: "generated" | "liked";
}

export function PlaceholderCard({ type }: PlaceholderCardProps) {
	const isGenerated = type === "generated";

	return (
		<Card className="overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25">
			<div className="relative aspect-square overflow-hidden rounded-lg bg-muted/50">
				<div className="flex h-full flex-col items-center justify-center p-6 text-center">
					<div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						{isGenerated ? (
							<Sparkles className="h-8 w-8 text-muted-foreground/50" />
						) : (
							<Heart className="h-8 w-8 text-muted-foreground/50" />
						)}
					</div>
					<p className="font-medium text-muted-foreground text-sm">
						{isGenerated
							? "Generated designs appear here"
							: "Liked designs appear here"}
					</p>
				</div>
			</div>
		</Card>
	);
}
