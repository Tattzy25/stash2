"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Clock, Download, Trash2, ZoomIn } from "lucide-react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

// Mock data for generated images history
const generatedImages = [
  {
    id: "1",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Traditional Japanese dragon tattoo with cherry blossoms",
    provider: "Replicate",
    model: "flux-1.1-pro",
    createdAt: "2024-12-06T10:30:00Z",
    liked: false,
  },
  {
    id: "2",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Minimalist geometric wolf design",
    provider: "Fireworks",
    model: "flux-1-dev-fp8",
    createdAt: "2024-12-06T09:15:00Z",
    liked: true,
  },
  {
    id: "3",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Watercolor style hummingbird with flowers",
    provider: "Replicate",
    model: "stable-diffusion-3.5-large",
    createdAt: "2024-12-05T16:45:00Z",
    liked: true,
  },
  {
    id: "4",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Celtic knot armband design",
    provider: "Fireworks",
    model: "flux-1-schnell-fp8",
    createdAt: "2024-12-05T14:20:00Z",
    liked: false,
  },
  {
    id: "5",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Realistic rose with thorns and dew drops",
    provider: "Replicate",
    model: "ideogram-v2",
    createdAt: "2024-12-04T11:00:00Z",
    liked: true,
  },
  {
    id: "6",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Abstract tribal sun design",
    provider: "Fireworks",
    model: "playground-v2-5",
    createdAt: "2024-12-04T08:30:00Z",
    liked: false,
  },
];

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
  showLikeStatus = true,
}: {
  image: (typeof generatedImages)[0];
  onToggleLike: (id: string) => void;
  showLikeStatus?: boolean;
}) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image.url}
          alt={image.prompt}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Image Preview</DialogTitle>
                        <DialogDescription>{image.prompt}</DialogDescription>
                      </DialogHeader>
                      <div className="relative aspect-square w-full">
                        <Image
                          src={image.url}
                          alt={image.prompt}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>View Full Size</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-1">
            {showLikeStatus && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={image.liked ? "default" : "secondary"}
                      className="h-8 w-8"
                      onClick={() => onToggleLike(image.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${image.liked ? "fill-current" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {image.liked ? "Unlike" : "Like"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
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

export default function MyTaTTTzPage() {
  const [images, setImages] = useState(generatedImages);

  const toggleLike = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, liked: !img.liked } : img
      )
    );
  };

  const likedImages = images.filter((img) => img.liked);

  return (
    <div className="flex flex-col flex-1 p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My TaTTTz
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal collection of AI-generated tattoo designs. Browse your
          history and favorites all in one place.
        </p>
      </div>

      <Separator />

      {/* Generated Image History Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Generation History
                </CardTitle>
                <CardDescription>
                  All your recently generated tattoo designs
                </CardDescription>
              </div>
              <Badge variant="secondary">{images.length} images</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {images.map((image) => (
                  <div key={image.id} className="w-[280px] flex-shrink-0">
                    <ImageCard image={image} onToggleLike={toggleLike} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {/* Liked Images Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Liked Designs
                </CardTitle>
                <CardDescription>
                  Your favorite tattoo designs that you've saved
                </CardDescription>
              </div>
              <Badge variant="secondary">{likedImages.length} liked</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {likedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {likedImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onToggleLike={toggleLike}
                    showLikeStatus={false}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No liked designs yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  Click the heart icon on any generated image to add it to your
                  favorites collection.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
