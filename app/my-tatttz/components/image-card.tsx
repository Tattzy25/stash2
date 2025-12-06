"use client";

import Image from "next/image";
import { Heart, Clock, Download, Share2, Upload, ZoomIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { ImageCardProps } from "../types";
import { formatDate } from "../utils";

export function ImageCard({ image, onToggleLike }: ImageCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 border-border/50 rounded-[2rem]">
      <div className="relative aspect-square overflow-hidden bg-muted rounded-[2rem]">
        <Image
          src={image.url}
          alt={image.prompt}
          fill
          className="object-cover rounded-[2rem]"
          unoptimized={image.url.startsWith("data:") || image.url.startsWith("http")}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Action buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center gap-1">
            <ActionButton
              icon={<Heart className={`h-4 w-4 ${image.liked ? "fill-current" : ""}`} />}
              tooltip={image.liked ? "Unlike" : "Like"}
              onClick={() => onToggleLike(image.id)}
              className={image.liked ? "text-red-500" : "text-white/80 hover:text-white"}
            />
            <ActionButton icon={<Share2 className="h-4 w-4" />} tooltip="Share" />
            <ActionButton icon={<Download className="h-4 w-4" />} tooltip="Download" />
            <ActionButton icon={<Upload className="h-4 w-4" />} tooltip="Upload" />
            <ImagePreviewDialog image={image} />
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

// Sub-components for ImageCard
interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  className?: string;
}

function ActionButton({ icon, tooltip, onClick, className = "text-white/80 hover:text-white" }: ActionButtonProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={`h-8 w-8 ${className}`}
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ImagePreviewDialog({ image }: { image: ImageCardProps["image"] }) {
  return (
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
  );
}

export default ImageCard;
