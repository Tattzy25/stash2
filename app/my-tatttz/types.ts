// Types for my-tatttz page components
import type { StoredImage } from "@/lib/image-storage";

export type { StoredImage };

export interface ImageCardProps {
	image: StoredImage;
	onToggleLike: (id: string) => void;
}

export interface ImageCarouselProps {
	images: StoredImage[];
	onToggleLike: (id: string) => void;
}

export interface EmptyStateProps {
	type: "generated" | "liked";
}

export interface AccordionItemData {
	id: string;
	url: string;
	title: string;
	description: string;
}
