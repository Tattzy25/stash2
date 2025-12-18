// Utility functions for my-tatttz page
import type { AccordionItemData, StoredImage } from "./types";

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Convert StoredImage array to AccordionItem format
 */
export function toAccordionItems(images: StoredImage[]): AccordionItemData[] {
	return images.map((img) => ({
		id: img.id,
		url: img.url,
		title: img.prompt.slice(0, 40) + (img.prompt.length > 40 ? "..." : ""),
		description: img.prompt,
	}));
}

/**
 * Placeholder images for empty states
 */
export const PLACEHOLDER_IMAGES = ["/tattied.svg", "/ink-fever.svg"] as const;
