"use client";

import { useActionState, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { search } from "@/app/actions/search";
import { GalleryGrid } from "./results/gallery";
import { useGalleryItems, useInfiniteScroll, useLightbox } from "./results/hooks";
import { ImageLightbox } from "./results/lightbox";
import { SearchBar } from "./results/search";
import type { ResultsClientProps } from "./results/types";
import { useUploadedImages } from "./uploaded-images-provider";

export const ResultsClient = ({
	defaultData,
	initialCursor,
	initialHasMore = false,
}: ResultsClientProps) => {
	const { images } = useUploadedImages();
	const [state, formAction, isPending] = useActionState(search, { data: [] });

	const { blobs, hasMore, isLoadingMore, loadMoreRef } = useInfiniteScroll({
		initialData: defaultData,
		initialCursor,
		initialHasMore,
	});

	const {
		lightboxIndex,
		selectedIndex,
		openLightbox,
		closeLightbox,
		handleLightboxSelect,
	} = useLightbox();

	// Likes disabled until auth is ready - UI visible but non-functional
	const [likedUrls] = useState<Set<string>>(new Set());

	// No-op until auth is implemented
	const handleToggleLike = useCallback((_url: string) => {
		toast.info("Likes coming soon with user accounts!");
	}, []);

	useEffect(() => {
		if ("error" in state) {
			toast.error(state.error);
		}
	}, [state]);

	const reset = () => {
		globalThis.location.reload();
	};

	const isShowingSearchResults =
		"data" in state && Array.isArray(state.data) && state.data.length > 0;

	const remoteBlobs = isShowingSearchResults ? (state.data ?? []) : blobs;

	const galleryItems = useGalleryItems(images, remoteBlobs);

	const hasImages = galleryItems.length > 0;

	return (
		<div className="h-[calc(100svh-var(--header-height))] w-full overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
			<div className="relative h-full w-full">
				<div className="h-full w-full overflow-y-auto p-1 pb-24 md:p-2">
					<GalleryGrid
						items={galleryItems}
						selectedIndex={selectedIndex}
						onItemClick={openLightbox}
						isShowingSearchResults={isShowingSearchResults}
						loadMoreRef={loadMoreRef}
						isLoadingMore={isLoadingMore}
						hasMore={hasMore}
						likedUrls={likedUrls}
					/>
				</div>

				<SearchBar
					formAction={formAction}
					isPending={isPending}
					isShowingSearchResults={isShowingSearchResults}
					hasImages={hasImages}
					onReset={reset}
				/>
			</div>

			<ImageLightbox
				activeIndex={lightboxIndex}
				items={galleryItems}
				onClose={closeLightbox}
				onSelect={handleLightboxSelect}
				likedUrls={likedUrls}
				onToggleLike={handleToggleLike}
			/>
		</div>
	);
};

