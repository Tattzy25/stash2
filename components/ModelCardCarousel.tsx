"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { ProviderTiming } from "@/lib/image-types";
import type { ProviderKey } from "@/lib/provider-config";
import { cn } from "@/lib/utils";
import { ModelSelect } from "./ModelSelect";

interface ModelCardCarouselProps {
	models: Array<{
		label: string;
		models: string[];
		iconPath: string;
		color: string;
		value: string;
		providerKey: ProviderKey;
		enabled?: boolean;
		onToggle?: (enabled: boolean) => void;
		onChange: (value: string, providerKey: ProviderKey) => void;
		image: string | null | undefined;
		timing?: ProviderTiming;
		failed?: boolean;
		modelId: string;
	}>;
}

export function ModelCardCarousel({ models }: ModelCardCarouselProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [api, setApi] = useState<CarouselApi>();
	const initialized = useRef(false);

	useLayoutEffect(() => {
		if (!api || initialized.current) return;

		// Force scroll in multiple ways
		api.scrollTo(0, false);
		api.scrollPrev(); // Reset any potential offset
		api.scrollTo(0, false);

		initialized.current = true;
		setCurrentSlide(0);
	}, [api]);

	useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			setCurrentSlide(api.selectedScrollSnap());
		};

		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
			return;
		};
	}, [api]);

	return (
		<div className="relative mb-8 w-full">
			<Carousel
				opts={{
					align: "start",
					dragFree: false,
					containScroll: "trimSnaps",
					loop: true,
				}}
				setApi={setApi}
			>
				<CarouselContent>
					{models.map((model, i) => (
						<CarouselItem key={model.label}>
							<ModelSelect
								{...model}
								onChange={(value, providerKey) =>
									model.onChange(value, providerKey)
								}
							/>
							<div className="mt-4 text-center text-muted-foreground text-sm">
								{i + 1} of {models.length}
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious className="left-0 bg-background/80 backdrop-blur-sm" />
				<CarouselNext className="right-0 bg-background/80 backdrop-blur-sm" />
			</Carousel>

			{/* Dot Indicators */}
			<div className="-bottom-6 absolute right-0 left-0">
				<div className="flex justify-center gap-1">
					{models.map((_, index) => (
						<button
							className={cn(
								"h-1.5 rounded-full transition-all",
								index === currentSlide
									? "w-4 bg-primary"
									: "w-1.5 bg-primary/50",
							)}
							key={index}
							onClick={() => api?.scrollTo(index)}
						>
							<span className="sr-only">Go to model {index + 1}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
