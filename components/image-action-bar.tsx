"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteIcon } from "@/components/ui/delete";
import { DownloadIcon } from "@/components/ui/download";
import { HeartIcon } from "@/components/ui/heart";
import { MailCheckIcon } from "@/components/ui/mail-check";
import { PlusIcon } from "@/components/ui/plus";
import { cn } from "@/lib/utils";

export interface ImageActionBarProps {
	onAddToGallery?: () => void;
	onAddToLiked?: () => void;
	onShare?: () => void;
	onDownload?: () => void;
	onDelete?: () => void;
	showAdd?: boolean;
	showHeart?: boolean;
	showShare?: boolean;
	showDownload?: boolean;
	showDelete?: boolean;
	isLiked?: boolean;
	iconSize?: number;
	className?: string;
	variant?: "default" | "overlay" | "minimal";
}

export function ImageActionBar({
	onAddToGallery,
	onAddToLiked,
	onShare,
	onDownload,
	onDelete,
	showAdd = true,
	showHeart = true,
	showShare = true,
	showDownload = true,
	showDelete = true,
	isLiked = false,
	iconSize = 24,
	className,
	variant = "default",
}: ImageActionBarProps) {
	const handleShare = async () => {
		if (onShare) {
			onShare();
		} else if (navigator.share) {
			// Native share fallback
			try {
				await navigator.share({
					title: "Check out this tattoo design",
					text: "Created with TaTTTy AI",
					url: window.location.href,
				});
			} catch (err) {
				console.log("Share cancelled or failed");
			}
		}
	};

	const baseStyles = {
		default:
			"flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-full px-6 py-3",
		overlay:
			"flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-full px-6 py-3",
		minimal: "flex items-center gap-3",
	};

	const buttonStyles = {
		default:
			"text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer",
		overlay:
			"text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer",
		minimal:
			"text-muted-foreground hover:text-foreground hover:scale-110 transition-all cursor-pointer",
	};

	return (
		<div className={cn(baseStyles[variant], className)}>
			{showAdd && (
				<button className={buttonStyles[variant]} onClick={onAddToGallery}>
					<PlusIcon size={iconSize} />
				</button>
			)}

			{showHeart && (
				<button
					className={cn(
						buttonStyles[variant],
						isLiked && "text-red-500 hover:text-red-400",
					)}
					onClick={onAddToLiked}
				>
					<HeartIcon size={iconSize} />
				</button>
			)}

			{showShare && (
				<button className={buttonStyles[variant]} onClick={handleShare}>
					<MailCheckIcon size={iconSize} />
				</button>
			)}

			{showDownload && (
				<button className={buttonStyles[variant]} onClick={onDownload}>
					<DownloadIcon size={iconSize} />
				</button>
			)}

			{showDelete && (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<button className={cn(buttonStyles[variant], "hover:text-red-500")}>
							<DeleteIcon size={iconSize} />
						</button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This will permanently delete this image from your library. This
								action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								className="bg-red-500 hover:bg-red-600"
								onClick={onDelete}
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}

export default ImageActionBar;
