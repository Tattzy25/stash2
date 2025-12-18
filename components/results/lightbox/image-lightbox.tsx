"use client";

import useEmblaCarousel from "embla-carousel-react";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	ChevronUpIcon,
	CopyIcon,
	DownloadIcon,
	HeartIcon,
	SendIcon,
	XIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ReactionDock } from "@/components/reaction-dock";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { LightboxItem } from "../types";

type ImageLightboxProps = {
	items: LightboxItem[];
	activeIndex: number | null;
	onClose: () => void;
	onSelect: (index: number) => void;
};

export const ImageLightbox = ({
	items,
	activeIndex,
	onClose,
	onSelect,
}: ImageLightboxProps) => {
	const open = activeIndex !== null && items.length > 0;
	const [showInfo, setShowInfo] = useState(false); // Start collapsed on mobile
	const [isFavorited, setIsFavorited] = useState(false);
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		skipSnaps: false,
		loop: items.length > 1,
	});

	const currentItem = activeIndex === null ? null : items[activeIndex];

	useEffect(() => {
		if (!emblaApi || activeIndex === null) {
			return;
		}
		emblaApi.scrollTo(activeIndex, true);
	}, [emblaApi, activeIndex]);

	useEffect(() => {
		if (!emblaApi) {
			return;
		}

		const handleSelect = () => {
			const selected = emblaApi.selectedScrollSnap();
			onSelect(selected);
		};

		emblaApi.on("select", handleSelect);
		return () => {
			emblaApi.off("select", handleSelect);
		};
	}, [emblaApi, onSelect]);

	const scrollPrev = useCallback(() => {
		emblaApi?.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		emblaApi?.scrollNext();
	}, [emblaApi]);

	const handleDownload = useCallback(async () => {
		if (!currentItem?.url) return;
		try {
			// Validate URL before fetching
			const validatedUrl = new URL(currentItem.url);
			if (validatedUrl.protocol !== "https:" && validatedUrl.protocol !== "http:") {
				throw new Error("Invalid URL protocol");
			}
			const response = await fetch(validatedUrl.href);
			const blob = await response.blob();
			const blobUrl = globalThis.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = blobUrl;
			a.download = currentItem.name?.replaceAll(/[^a-zA-Z0-9._-]/g, "_") || "image";
			document.body.appendChild(a);
			a.click();
			globalThis.URL.revokeObjectURL(blobUrl);
			a.remove();
			toast.success("Image downloaded!");
		} catch {
			toast.error("Failed to download image");
		}
	}, [currentItem]);

	const handleLike = useCallback(() => {
		setIsFavorited(!isFavorited);
		if (isFavorited) {
			toast.info("Removed from My Tatttz");
		} else {
			toast.success("Added to My Tatttz!");
		}
	}, [isFavorited]);

	const handleShareToFriend = useCallback(async () => {
		if (!currentItem?.url) return;
		if (navigator.share) {
			try {
				await navigator.share({
					title: currentItem.name || "Check out this tattoo design",
					text:
						currentItem.description || "I found this amazing tattoo design!",
					url: currentItem.url,
				});
			} catch {
				// User cancelled or error
			}
		} else {
			// Fallback: copy link
			try {
				await navigator.clipboard.writeText(currentItem.url);
				toast.success("Link copied to clipboard!");
			} catch {
				toast.error("Failed to share");
			}
		}
	}, [currentItem]);

	const handleToggleInfo = useCallback(() => {
		setShowInfo(!showInfo);
	}, [showInfo]);

	const handleCopyPrompt = useCallback(async () => {
		const prompt = currentItem?.prompt || currentItem?.description;
		if (!prompt) {
			toast.error("No prompt available for this image");
			return;
		}
		try {
			await navigator.clipboard.writeText(prompt);
			toast.success("Prompt copied to clipboard!");
		} catch {
			toast.error("Failed to copy prompt");
		}
	}, [currentItem]);

	// Dock items configuration - Desktop (no info icon)
	const desktopDockItems = useMemo(
		() => [
			{
				icon: <HeartIcon className="size-6" />,
				label: "Like",
				onClick: handleLike,
			},
			{
				icon: <SendIcon className="size-6" />,
				label: "Share",
				onClick: () => void handleShareToFriend(),
			},
			{
				icon: <CopyIcon className="size-6" />,
				label: "Copy Prompt",
				onClick: () => void handleCopyPrompt(),
			},
		],
		[handleLike, handleShareToFriend, handleCopyPrompt],
	);

	// Dock items configuration - Mobile (with info icon)
	const mobileDockItems = useMemo(
		() => [
			{
				icon: <HeartIcon className="size-6" />,
				label: "Like",
				onClick: handleLike,
			},
			{
				icon: <SendIcon className="size-6" />,
				label: "Share",
				onClick: () => void handleShareToFriend(),
			},
			{
				icon: <ChevronUpIcon className="size-6" />,
				label: "Info",
				onClick: handleToggleInfo,
			},
			{
				icon: <CopyIcon className="size-6" />,
				label: "Copy Prompt",
				onClick: () => void handleCopyPrompt(),
			},
		],
		[handleLike, handleShareToFriend, handleToggleInfo, handleCopyPrompt],
	);

	if (!open) {
		return null;
	}

	return (
		<Dialog onOpenChange={(isOpen) => !isOpen && onClose()} open={open}>
			<DialogContent
				className="h-dvh max-h-dvh w-full max-w-full gap-0 border-none bg-background p-0 shadow-none md:h-[90vh] md:max-h-[90vh] md:max-w-6xl md:rounded-lg"
				showCloseButton={false}
			>
				<DialogTitle className="sr-only">Image preview</DialogTitle>
				<div className="relative flex h-full w-full flex-col overflow-hidden md:flex-row">
					{/* Close button - only visible on desktop OR when info panel is closed on mobile */}
					<Button
						aria-label="Close image viewer"
						className={`absolute top-4 right-4 z-30 ${
							showInfo ? "hidden md:flex" : "flex"
						}`}
						onClick={onClose}
						size="icon"
						variant="ghost"
					>
						<XIcon className="size-5" />
					</Button>

					{/* Image carousel area */}
					<div
						className={`relative flex-1 overflow-hidden ${
							showInfo ? "hidden md:flex" : "flex"
						} flex-col`}
					>
						<div className="h-full flex-1" ref={emblaRef}>
							<div className="flex h-full">
								{items.map((item, index) => {
									const isNearActive =
										activeIndex !== null && Math.abs(index - activeIndex) <= 1;
									return (
										<div
											className="relative flex h-full w-full flex-[0_0_100%] items-center justify-center p-4 md:p-8"
											key={`${item.url}-${index}`}
										>
											<div className="relative h-full w-full">
												<Image
													alt={item.name || "Image"}
													className="object-contain"
													fill
													loading={isNearActive ? "eager" : "lazy"}
													priority={index === activeIndex}
													sizes="(max-width: 768px) 100vw, 70vw"
													src={item.url}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Navigation arrows */}
						{items.length > 1 && (
							<div className="pointer-events-none absolute inset-0 flex items-center justify-between p-4">
								<Button
									aria-label="Previous image"
									className="pointer-events-auto rounded-full bg-background/80 backdrop-blur-sm"
									onClick={scrollPrev}
									size="icon"
									variant="ghost"
								>
									<ArrowLeftIcon className="size-5" />
								</Button>
								<Button
									aria-label="Next image"
									className="pointer-events-auto rounded-full bg-background/80 backdrop-blur-sm"
									onClick={scrollNext}
									size="icon"
									variant="ghost"
								>
									<ArrowRightIcon className="size-5" />
								</Button>
							</div>
						)}

						{/* Reaction Dock - Mobile version with Info icon */}
						<div className="absolute inset-x-0 bottom-4 z-30 flex justify-center md:hidden">
							<ReactionDock items={mobileDockItems} />
						</div>
						{/* Reaction Dock - Desktop version without Info icon */}
						<div className="absolute inset-x-0 bottom-4 z-30 hidden justify-center md:flex">
							<ReactionDock items={desktopDockItems} />
						</div>
					</div>

					{/* Info panel - Full screen on mobile, side panel on desktop */}
					<div
						className={`${
							showInfo ? "flex" : "hidden md:flex"
						} absolute inset-0 z-10 flex-col bg-background md:static md:inset-auto md:w-80 md:border-l`}
					>
						{/* Mobile header with back button */}
						<div className="flex items-center gap-3 border-b px-4 py-3 md:hidden">
							<Button
								aria-label="Back to image"
								onClick={() => setShowInfo(false)}
								size="icon"
								variant="ghost"
							>
								<ArrowLeftIcon className="size-5" />
							</Button>
							<span className="flex-1 text-sm font-medium">Image Details</span>
							<Button
								aria-label="Close"
								onClick={onClose}
								size="icon"
								variant="ghost"
							>
								<XIcon className="size-5" />
							</Button>
						</div>

						<div className="flex flex-1 flex-col overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
							{/* Title */}
							<h3 className="mb-2 line-clamp-2 text-lg font-semibold capitalize">
								{currentItem?.name || "Untitled"}
							</h3>

							{/* Description/Prompt */}
							<p className="mb-4 text-sm text-muted-foreground">
								{currentItem?.prompt ||
									currentItem?.description ||
									"No description available"}
							</p>

							<Separator className="my-4" />

							{/* Metadata */}
							<div className="mb-4 space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Aspect Ratio</span>
									<span className="font-medium">1:1</span>
								</div>
							</div>

							<Separator className="my-4" />

							{/* Download Action - above dock on mobile */}
							<div className="mt-auto">
								<Button
									className="w-full gap-2"
									onClick={handleDownload}
									variant="default"
								>
									<DownloadIcon className="size-4" />
									Download Image
								</Button>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
