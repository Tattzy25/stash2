"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Heart, Clock, Download, Share2, Upload, ZoomIn, ChevronLeft, ChevronRight, Sparkles, Skull } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  getGeneratedImages, 
  getLikedImages, 
  toggleLikeImage, 
  StoredImage 
} from "@/lib/image-storage";
import Link from "next/link";
import ImageAccordion, { AccordionItem } from "@/components/imageAccordion";

// Validate if a URL is usable for images
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  // Allow data URLs, http/https URLs, and local paths starting with /
  return url.startsWith('data:image/') || 
         url.startsWith('http://') || 
         url.startsWith('https://') || 
         url.startsWith('/');
}

// Helper to convert StoredImage to AccordionItem (with validation)
function toAccordionItems(images: StoredImage[]): AccordionItem[] {
  return images
    .filter(img => isValidImageUrl(img.url))
    .map(img => ({
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
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 border-border/50 rounded-[2rem]">
      <div className="relative aspect-square overflow-hidden bg-muted rounded-[2rem]">
        {/* Actual image */}
        <Image
          src={image.url}
          alt={image.prompt}
          fill
          className="object-cover rounded-[2rem]"
          unoptimized={image.url.startsWith("data:") || image.url.startsWith("http")}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Action buttons - always visible at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 ${image.liked ? "text-red-500" : "text-white/80 hover:text-white"}`}
                    onClick={() => onToggleLike(image.id)}
                  >
                    <Heart className={`h-4 w-4 ${image.liked ? "fill-current" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{image.liked ? "Unlike" : "Like"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white/80 hover:text-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Share</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white/80 hover:text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white/80 hover:text-white">
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
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-white/80 hover:text-white">
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Image Preview</DialogTitle>
                        <DialogDescription>{image.prompt}</DialogDescription>
                      </DialogHeader>
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.prompt}
                          fill
                          className="object-contain"
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
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
          {image.prompt}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {image.provider}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
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
  onToggleLike 
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
    <div className="relative group/carousel">
      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

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

// Empty state component for when no images exist
function EmptyState({ type }: { type: "generated" | "liked" }) {
  const isGenerated = type === "generated";
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative w-32 h-32 mb-6">
        <Image
          src="/tattied.svg"
          alt="No images yet"
          fill
          className="object-contain opacity-50"
        />
      </div>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {isGenerated ? (
          <Sparkles className="h-8 w-8 text-muted-foreground/50" />
        ) : (
          <Heart className="h-8 w-8 text-muted-foreground/50" />
        )}
      </div>
      <h3 className="text-lg font-medium">
        {isGenerated ? "No generated designs yet" : "No liked designs yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
        {isGenerated 
          ? "Head over to Tattty AI to create your first tattoo design!"
          : "Click the heart icon on any generated image to add it to your favorites collection."
        }
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
      <div className="flex flex-col flex-1 p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-[family-name:var(--font-rock-salt)]">
            My TaTTTz
          </h1>
          <p className="text-lg text-muted-foreground font-[family-name:var(--font-orbitron)]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-[family-name:var(--font-rock-salt)]">
          My TaTTTz
        </h1>
        <p className="text-lg text-muted-foreground font-[family-name:var(--font-orbitron)]">
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
