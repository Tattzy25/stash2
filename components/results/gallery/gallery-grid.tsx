"use client";

import { Loader2Icon } from "lucide-react";
import type { RefObject } from "react";
import { Preview } from "@/components/preview";
import { PRIORITY_COUNT } from "../constants";
import type { LightboxItem } from "../types";

type GalleryGridProps = {
	items: LightboxItem[];
	selectedIndex: number | null;
	onItemClick: (index: number) => void;
	isShowingSearchResults: boolean;
	loadMoreRef: RefObject<HTMLDivElement | null>;
	isLoadingMore: boolean;
	hasMore: boolean;
};

export const GalleryGrid = ({
	items,
	selectedIndex,
	onItemClick,
	isShowingSearchResults,
	loadMoreRef,
	isLoadingMore,
	hasMore,
}: GalleryGridProps) => {
	return (
		<>
			<div className="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-2">
				{items.map((item: LightboxItem, index: number) => (
					<Preview
						key={`${item.url}-${index}`}
						onClick={(): void => onItemClick(index)}
						priority={index < PRIORITY_COUNT}
						selected={selectedIndex === index}
						url={item.url}
					/>
				))}
			</div>
			{/* Infinite scroll trigger */}
			{!isShowingSearchResults && (
				<div ref={loadMoreRef} className="flex justify-center py-8">
					{isLoadingMore && (
						<Loader2Icon className="size-6 animate-spin text-muted-foreground" />
					)}
					{!hasMore && items.length > 0 && (
						<p className="text-sm text-muted-foreground">
							No more images to load
						</p>
					)}
				</div>
			)}
		</>
	);
};
