"use client";

import {
	Clock,
	Download,
	Heart,
	Share2,
	Sparkles,
	Upload,
	ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
		<Card className="group overflow-hidden rounded-lg border-border/50 transition-all hover:shadow-lg hover:shadow-primary/10">
			<div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
				<Image
					alt={image.prompt}
					className="rounded-lg object-cover"
					fill
					src={image.url}
					unoptimized={
						image.url.startsWith("data:") || image.url.startsWith("http")
					}
				/>

				<div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />

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
										<DialogContent className="max-w-3xl rounded-lg">
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
					<Badge className="text-xs rounded-full" variant="outline">
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

function PlaceholderCard({ type }: { type: "generated" | "liked" }) {
	const isGenerated = type === "generated";

	return (
		<Card className="overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25">
			<div className="relative aspect-square overflow-hidden rounded-lg bg-muted/50">
				<div className="flex h-full flex-col items-center justify-center p-6 text-center">
					<div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						{isGenerated ? (
							<Sparkles className="h-8 w-8 text-muted-foreground/50" />
						) : (
							<Heart className="h-8 w-8 text-muted-foreground/50" />
						)}
					</div>
					<p className="font-medium text-muted-foreground text-sm">
						{isGenerated
							? "Generated designs appear here"
							: "Liked designs appear here"}
					</p>
				</div>
			</div>
		</Card>
	);
}

function EmptyState({ type }: { type: "generated" | "liked" }) {
	const isGenerated = type === "generated";

	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="relative mb-6 h-24 w-24 sm:h-32 sm:w-32">
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
			<h3 className="font-medium text-base sm:text-lg">
				{isGenerated ? "No generated designs yet" : "No liked designs yet"}
			</h3>
			<p className="mt-1 mb-4 max-w-sm px-4 text-muted-foreground text-sm">
				{isGenerated
					? "Head over to Tattty AI to create your first tattoo design!"
					: "Click the heart icon on any generated image to add it to your favorites collection."}
			</p>
			{isGenerated && (
				<Link href="/tattty">
					<Button className="rounded-full">
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

	useEffect(() => {
		setImages(getGeneratedImages());
		setLikedImages(getLikedImages());
		setIsLoaded(true);
	}, []);

	const handleToggleLike = (id: string) => {
		toggleLikeImage(id);
		setImages(getGeneratedImages());
		setLikedImages(getLikedImages());
	};

	if (!isLoaded) {
		return (
			<div className="flex flex-1 flex-col space-y-6 p-4 sm:space-y-8 sm:p-6">
				<div className="space-y-2 sm:space-y-4 text-center">
					<h1 className="font-[family-name:var(--font-rock-salt)] font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
						My TaTTTz
					</h1>
					<p className="font-[family-name:var(--font-orbitron)] text-base text-muted-foreground sm:text-lg">
						Loading...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col space-y-6 p-4 sm:space-y-8 sm:p-6">
			<div className="space-y-2 sm:space-y-4 text-center">
				<h1 className="font-[family-name:var(--font-rock-salt)] font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
					My TaTTTz
				</h1>
				<p className="font-[family-name:var(--font-orbitron)] text-base text-muted-foreground sm:text-lg">
					your life, your pain, your power, our ink
				</p>
			</div>

			<Separator />

			<section className="space-y-4">
				<Card className="border-border/50 rounded-lg">
					<CardHeader className="pb-4 pl-4 sm:pl-8">
						<CardDescription className="flex items-center gap-2 text-sm sm:text-base">
							<Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
							GENERATED DESIGNS
						</CardDescription>
					</CardHeader>
					<CardContent className="px-4 sm:px-6">
						{images.length > 0 ? (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{images.map((image) => (
									<ImageCard
										key={image.id}
										image={image}
										onToggleLike={handleToggleLike}
									/>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<PlaceholderCard type="generated" />
								<PlaceholderCard type="generated" />
							</div>
						)}
					</CardContent>
				</Card>
			</section>

			<section className="space-y-4">
				<Card className="border-border/50 rounded-lg">
					<CardHeader className="pb-4 pl-4 sm:pl-8">
						<CardDescription className="flex items-center gap-2 text-sm sm:text-base">
							<Heart className="h-4 w-4 sm:h-5 sm:w-5" />
							LIKED DESIGNS
						</CardDescription>
					</CardHeader>
					<CardContent className="px-4 sm:px-6">
						{likedImages.length > 0 ? (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{likedImages.map((image) => (
									<ImageCard
										key={image.id}
										image={image}
										onToggleLike={handleToggleLike}
									/>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<PlaceholderCard type="liked" />
								<PlaceholderCard type="liked" />
							</div>
						)}
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
