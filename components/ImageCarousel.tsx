"use client";

import { useEffect, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { GeneratedImage, ProviderTiming } from "@/lib/image-types";
import type { ProviderKey } from "@/lib/provider-config";
import { cn } from "@/lib/utils";
import { ImageDisplay } from "./ImageDisplay";

interface ImageCarouselProps {
	providers: ProviderKey[];
	images: GeneratedImage[];
	timings: Record<ProviderKey, ProviderTiming>;
	failedProviders: ProviderKey[];
	enabledProviders: Record<ProviderKey, boolean>;
	providerToModel: Record<ProviderKey, string>;
}

export function ImageCarousel({
	providers,
	images,
	timings,
	failedProviders,
	enabledProviders,
	providerToModel,
}: ImageCarouselProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) return;

		api.on("select", () => {
			setCurrentSlide(api.selectedScrollSnap());
		});
	}, [api]);

	return (
		<div className="relative w-full">
			<Carousel opts={{ align: "start", loop: true }} setApi={setApi}>
				<CarouselContent>
					{providers.map((provider, i) => {
						const imageData = images?.find(
							(img) => img.provider === provider,
						)?.image;
						const timing = timings[provider];

						return (
							<CarouselItem key={provider}>
								<ImageDisplay
									enabled={enabledProviders[provider]}
									failed={failedProviders.includes(provider)}
									image={imageData}
									modelId={
										images?.find((img) => img.provider === provider)?.modelId ||
										providerToModel[provider]
									}
									provider={provider}
									timing={timing}
								/>
								<div className="mt-4 text-center text-muted-foreground text-sm">
									{i + 1} of {providers.length}
								</div>
							</CarouselItem>
						);
					})}
				</CarouselContent>

				<CarouselPrevious className="left-0 bg-background/80 backdrop-blur-sm" />
				<CarouselNext className="right-0 bg-background/80 backdrop-blur-sm" />
			</Carousel>

			{/* Dot Indicators */}
			<div className="-bottom-6 absolute right-0 left-0">
				<div className="flex justify-center gap-1">
					{providers.map((_, index) => (
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
							<span className="sr-only">Go to image {index + 1}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
