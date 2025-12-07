"use client";

import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Heart,
  Share2,
  Skull,
  Sparkles,
  Upload,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ImageAccordion, {
  type AccordionItem,
} from "@/components/imageAccordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getGeneratedImages,
  getLikedImages,
  type StoredImage,
  toggleLikeImage,
} from "@/lib/image-storage";

// Validate if a URL is usable for images
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  // Allow data URLs, http/https URLs, and local paths starting with /
  return (
    url.startsWith("data:image/") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  );
}

// Helper to convert StoredImage to AccordionItem (with validation)
function toAccordionItems(images: StoredImage[]): AccordionItem[] {
  return images
    .filter((img) => isValidImageUrl(img.url))
    .map((img) => ({
      id: img.id,
      url: img.url,
      title: img.prompt.slice(0, 40) + (img.prompt.length > 40 ? "..." : ""),
      description: img.prompt,
    }));
}

// Placeholder images for empty state
const placeholderImages = ["/tattied.svg", "/ink-fever.svg"];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ImageCard({
  image,
  onToggleLike,
}: {
  image: StoredImage;
  onToggleLike: (id: string) => void;
}) {
  return (
    <Card className="group overflow-hidden rounded-[2rem] border-border/50 transition-all hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-muted">
        {/* Actual image */}
        <Image
          alt={image.prompt}
          className="rounded-[2rem] object-cover"
          fill
          src={image.url}
          unoptimized={
            image.url.startsWith("data:") || image.url.startsWith("http")
          }
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Action buttons - always visible at bottom */}
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <div className="flex justify-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={`h-8 w-8 ${image.liked ? "text-red-500" : "text-white/80 hover:text-white"}`}
                    onClick={() => onToggleLike(image.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Heart
                      className={`h-4 w-4 ${image.liked ? "fill-current" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {image.liked ? "Unlike" : "Like"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 w-8 text-white/80 hover:text-white"
                    size="icon"
                    variant="ghost"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Share</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 w-8 text-white/80 hover:text-white"
                    size="icon"
                    variant="ghost"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 w-8 text-white/80 hover:text-white"
                    size="icon"
                    variant="ghost"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Upload</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="h-8 w-8 text-white/80 hover:text-white"
                        size="icon"
                        variant="ghost"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Image Preview</DialogTitle>
                        <DialogDescription>{image.prompt}</DialogDescription>
                      </DialogHeader>
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        <Image
                          alt={image.prompt}
                          className="object-contain"
                          fill
                          src={image.url}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent side="top">View Full Size</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="mb-2 line-clamp-1 text-muted-foreground text-sm">
          {image.prompt}
        </p>
        <div className="flex items-center justify-between">
          <Badge className="text-xs" variant="outline">
            {image.provider}
          </Badge>
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            {formatDate(image.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Carousel component with navigation
function ImageCarousel({
  images,
  onToggleLike,
}: {
  images: StoredImage[];
  onToggleLike: (id: string) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="group/carousel relative">
      {/* Navigation arrows */}
      <Button
        className="-translate-y-1/2 absolute top-1/2 left-2 z-10 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100"
        onClick={scrollPrev}
        size="icon"
        variant="outline"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        className="-translate-y-1/2 absolute top-1/2 right-2 z-10 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100"
        onClick={scrollNext}
        size="icon"
        variant="outline"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

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

// Empty state component for when no images exist
function EmptyState({ type }: { type: "generated" | "liked" }) {
  const isGenerated = type === "generated";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6 h-32 w-32">
        <Image
          alt="No images yet"
          className="object-contain opacity-50"
          fill
          src="/tattied.svg"
        />
      </div>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        {isGenerated ? (
          <Sparkles className="h-8 w-8 text-muted-foreground/50" />
        ) : (
          <Heart className="h-8 w-8 text-muted-foreground/50" />
        )}
      </div>
      <h3 className="font-medium text-lg">
        {isGenerated ? "No generated designs yet" : "No liked designs yet"}
      </h3>
      <p className="mt-1 mb-4 max-w-sm text-muted-foreground text-sm">
        {isGenerated
          ? "Head over to Tattty AI to create your first tattoo design!"
          : "Click the heart icon on any generated image to add it to your favorites collection."}
      </p>
      {isGenerated && (
        <Link href="/tattty">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Create Your First Design
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function MyTaTTTzPage() {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [likedImages, setLikedImages] = useState<StoredImage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load images from localStorage on mount
  useEffect(() => {
    setImages(getGeneratedImages());
    setLikedImages(getLikedImages());
    setIsLoaded(true);
  }, []);

  const handleToggleLike = (id: string) => {
    const newLikedState = toggleLikeImage(id);
    // Refresh state from localStorage
    setImages(getGeneratedImages());
    setLikedImages(getLikedImages());
  };

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="flex flex-1 flex-col space-y-8 p-6">
        <div className="space-y-4 text-center">
          <h1 className="font-[family-name:var(--font-rock-salt)] font-bold text-4xl tracking-tight sm:text-5xl">
            My TaTTTz
          </h1>
          <p className="font-[family-name:var(--font-orbitron)] text-lg text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-8 p-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="font-[family-name:var(--font-rock-salt)] font-bold text-4xl tracking-tight sm:text-5xl">
          My TaTTTz
        </h1>
        <p className="font-[family-name:var(--font-orbitron)] text-lg text-muted-foreground">
          your life, your pain, your power, our ink
        </p>
      </div>

      <Separator />

      {/* Raw Creations Section */}
      <section className="space-y-4">
        <Card className="border-border/50">
          <CardHeader className="pb-4 pl-8">
            <CardDescription className="flex items-center gap-2 text-base">
              <Skull className="h-5 w-5" />
              RAW. REAL. YOU.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {images.length > 0 ? (
              <ImageAccordion items={toAccordionItems(images)} />
            ) : (
              <ImageAccordion />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Liked Section */}
      <section className="space-y-4">
        <Card className="border-border/50">
          <CardHeader className="pb-4 pl-8">
            <CardDescription className="flex items-center gap-2 text-base">
              <Skull className="h-5 w-5" />
              RAW. REAL. YOU.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {likedImages.length > 0 ? (
              <ImageAccordion items={toAccordionItems(likedImages)} />
            ) : (
              <ImageAccordion />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
