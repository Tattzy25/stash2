// @ts-nocheck
"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageActionBar } from "@/components/image-action-bar";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-config";

export type AccordionItem = {
	id: string | number;
	url: string;
	title: string;
	description: string;
	tags?: string[];
};

// Generate placeholder items dynamically from config
export const placeholderItems: AccordionItem[] = PLACEHOLDER_IMAGES.map(
	(url, i) => ({
		id: i + 1,
		url,
		title: "Tattoo Design",
		description: "Your generated tattoo designs will appear here.",
		tags: [],
	}),
);

function Gallery({
	items,
	setIndex,
	setOpen,
	index,
}: {
	items: AccordionItem[];
	setIndex: (index: number) => void;
	setOpen: (open: boolean) => void;
	index: number;
}) {
	return (
		<div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-1 rounded-md pt-10 pb-20 md:gap-2">
			{items.map((item, i) => (
				<motion.img
					className={`rounded-2xl ${
						index === i
							? "w-[500px]"
							: "w-[14px] sm:w-[20px] md:w-[30px] xl:w-[50px]"
					} h-[500px] shrink-0 cursor-pointer object-cover transition-[width] duration-300 ease-in-out`}
					key={item.id}
					onClick={() => {
						setIndex(i);
						setOpen(true);
					}}
					onMouseEnter={() => {
						setIndex(i);
					}}
					onMouseLeave={() => {
						setIndex(i);
					}}
					src={item?.url}
					whileTap={{ scale: 0.95 }}
				/>
			))}
		</div>
	);
}

export interface ImageAccordionProps {
	items?: AccordionItem[];
	onAddToGallery?: (item: AccordionItem) => void;
	onAddToLiked?: (item: AccordionItem) => void;
	onShare?: (item: AccordionItem) => void;
	onDownload?: (item: AccordionItem) => void;
	onDelete?: (item: AccordionItem) => void;
}

export default function ImageAccordion({
	items = placeholderItems,
	onAddToGallery,
	onAddToLiked,
	onShare,
	onDownload,
	onDelete,
}: ImageAccordionProps) {
	const [index, setIndex] = useState(Math.min(5, Math.floor(items.length / 2)));
	const [open, setOpen] = useState(false);

	const displayItems = items.length > 0 ? items : placeholderItems;

	useEffect(() => {
		if (open) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	return (
		<div className="relative">
			<Gallery
				index={index}
				items={displayItems}
				setIndex={setIndex}
				setOpen={setOpen}
			/>
			<AnimatePresence>
				{open !== false && displayItems[index] && (
					<motion.div
						animate={{ opacity: 1 }}
						className="fixed inset-0 top-0 right-0 bottom-0 left-0 z-50 grid h-full w-full place-content-center bg-white/40 backdrop-blur-lg dark:bg-black/40"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						key="overlay"
						onClick={() => {
							setOpen(false);
						}}
					>
						<div
							className="max-h-[90vh] max-w-[90vw]"
							onClick={(e) => e.stopPropagation()}
						>
							<motion.div className="relative cursor-default overflow-hidden rounded-2xl">
								<Image
									alt="single-image"
									className="h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-2xl object-contain"
									height={1200}
									src={displayItems[index].url}
									unoptimized={
										displayItems[index].url.startsWith("data:") ||
										displayItems[index].url.startsWith("http")
									}
									width={1200}
								/>
								<ImageActionBar
									className="-translate-x-1/2 absolute bottom-4 left-1/2"
									onAddToGallery={() => onAddToGallery?.(displayItems[index])}
									onAddToLiked={() => onAddToLiked?.(displayItems[index])}
									onDelete={() => onDelete?.(displayItems[index])}
									onDownload={() => onDownload?.(displayItems[index])}
									onShare={() => onShare?.(displayItems[index])}
									variant="overlay"
								/>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
