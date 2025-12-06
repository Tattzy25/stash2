"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "./image-card";
import type { ImageCarouselProps } from "../types";

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
    <div className="relative group/carousel">
      {/* Navigation arrows */}
      <NavButton direction="prev" onClick={scrollPrev} />
      <NavButton direction="next" onClick={scrollNext} />

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {images.map((image) => (
            <div key={image.id} className="flex-none w-[240px] md:w-[280px]">
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
      variant="outline"
      size="icon"
      className={`absolute ${position} top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export default ImageCarousel;
