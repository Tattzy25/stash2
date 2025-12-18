"use client";

import { Clock, Download, Heart, Share2, Upload, ZoomIn } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
		<Card className="group overflow-hidden rounded-[2rem] border-border/50 transition-all hover:shadow-lg hover:shadow-primary/10">
			<div className="relative aspect-square overflow-hidden rounded-[2rem] bg-muted">
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

				{/* Action buttons */}
				<div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-2">
					<div className="flex justify-center gap-1">
						<ActionButton
							className={
								image.liked ? "text-red-500" : "text-white/80 hover:text-white"
							}
							icon={
								<Heart
									className={`h-4 w-4 ${image.liked ? "fill-current" : ""}`}
								/>
							}
							onClick={() => onToggleLike(image.id)}
							tooltip={image.liked ? "Unlike" : "Like"}
						/>
						<ActionButton
							icon={<Share2 className="h-4 w-4" />}
							tooltip="Share"
						/>
						<ActionButton
							icon={<Download className="h-4 w-4" />}
							tooltip="Download"
						/>
						<ActionButton
							icon={<Upload className="h-4 w-4" />}
							tooltip="Upload"
						/>
						<ImagePreviewDialog image={image} />
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

// Sub-components for ImageCard
interface ActionButtonProps {
	icon: React.ReactNode;
	tooltip: string;
	onClick?: () => void;
	className?: string;
}

function ActionButton({
	icon,
	tooltip,
	onClick,
	className = "text-white/80 hover:text-white",
}: ActionButtonProps) {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className={`h-8 w-8 ${className}`}
						onClick={onClick}
						size="icon"
						variant="ghost"
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
	);
}

export default ImageCard;
