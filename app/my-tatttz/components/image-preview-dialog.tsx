import { ZoomIn } from "lucide-react";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { GalleryImage } from "../hooks/use-images";

interface ImagePreviewDialogProps {
	image: GalleryImage;
}

export function ImagePreviewDialog({ image }: ImagePreviewDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="h-8 w-8 text-white/80 hover:text-white">
					<ZoomIn className="h-4 w-4" />
				</button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl rounded-lg">
				<DialogHeader>
					<DialogTitle>Image Preview</DialogTitle>
					<DialogDescription>{image.prompt}</DialogDescription>
				</DialogHeader>
				<AspectRatio ratio={1} className="w-full">
					<Image
						alt={image.prompt}
						className="object-contain rounded-lg"
						fill
						src={image.url}
					/>
				</AspectRatio>
			</DialogContent>
		</Dialog>
	);
}
