"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { ImageCarouselProps } from "../types";
import { ImageCard } from "./image-card";

export function ImageCarousel({ images, onToggleLike }: ImageCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "start",
		dragFree: true,
	});

	const scrollPrev = useCallback(() => {
		emblaApi?.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		emblaApi?.scrollNext();
	}, [emblaApi]);

	return (
		<div className="group/carousel relative">
			{/* Navigation arrows */}
			<NavButton direction="prev" onClick={scrollPrev} />
			<NavButton direction="next" onClick={scrollNext} />

			{/* Carousel */}
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex gap-4">
					{images.map((image) => (
						<div className="w-[240px] flex-none md:w-[280px]" key={image.id}>
							<ImageCard image={image} onToggleLike={onToggleLike} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// Navigation button sub-component
interface NavButtonProps {
	direction: "prev" | "next";
	onClick: () => void;
}

function NavButton({ direction, onClick }: NavButtonProps) {
	const isPrev = direction === "prev";
	const Icon = isPrev ? ChevronLeft : ChevronRight;
	const position = isPrev ? "left-2" : "right-2";

	return (
		<Button
			className={`absolute ${position} -translate-y-1/2 top-1/2 z-10 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100`}
			onClick={onClick}
			size="icon"
			variant="outline"
		>
			<Icon className="h-4 w-4" />
		</Button>
	);
}

export default ImageCarousel;
