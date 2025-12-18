"use client";

import { Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { EmptyStateProps } from "../types";

export function EmptyState({ type }: EmptyStateProps) {
	const isGenerated = type === "generated";

	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<PlaceholderImage />
			<IconBadge isGenerated={isGenerated} />
			<EmptyTitle isGenerated={isGenerated} />
			<EmptyDescription isGenerated={isGenerated} />
			{isGenerated && <CreateButton />}
		</div>
	);
}

// Sub-components
function PlaceholderImage() {
	return (
		<div className="relative mb-6 h-32 w-32">
			<Image
				alt="No images yet"
				className="object-contain opacity-50"
				fill
				src="/tattied.svg"
			/>
		</div>
	);
}

function IconBadge({ isGenerated }: { isGenerated: boolean }) {
	return (
		<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
			{isGenerated ? (
				<Sparkles className="h-8 w-8 text-muted-foreground/50" />
			) : (
				<Heart className="h-8 w-8 text-muted-foreground/50" />
			)}
		</div>
	);
}

function EmptyTitle({ isGenerated }: { isGenerated: boolean }) {
	return (
		<h3 className="font-medium text-lg">
			{isGenerated ? "No generated designs yet" : "No liked designs yet"}
		</h3>
	);
}

function EmptyDescription({ isGenerated }: { isGenerated: boolean }) {
	return (
		<p className="mt-1 mb-4 max-w-sm text-muted-foreground text-sm">
			{isGenerated
				? "Head over to Tattty AI to create your first tattoo design!"
				: "Click the heart icon on any generated image to add it to your favorites collection."}
		</p>
	);
}

function CreateButton() {
	return (
		<Link href="/tattty">
			<Button>
				<Sparkles className="mr-2 h-4 w-4" />
				Create Your First Design
			</Button>
		</Link>
	);
}

export default EmptyState;
