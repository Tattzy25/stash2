/**
 * Image Storage Utility
 * Persists generated and liked images to localStorage
 */

export interface StoredImage {
	id: string;
	url: string;
	prompt: string;
	provider: string;
	modelId: string;
	createdAt: string;
	liked: boolean;
}

const GENERATED_IMAGES_KEY = "tattty_generated_images";
const LIKED_IMAGES_KEY = "tattty_liked_images";

/**
 * Get all generated images from localStorage
 */
export function getGeneratedImages(): StoredImage[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(GENERATED_IMAGES_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		console.error("Failed to parse generated images from localStorage");
		return [];
	}
}

/**
 * Get all liked images from localStorage
 */
export function getLikedImages(): StoredImage[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(LIKED_IMAGES_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		console.error("Failed to parse liked images from localStorage");
		return [];
	}
}

/**
 * Save a newly generated image
 */
export function saveGeneratedImage(
	image: Omit<StoredImage, "id" | "createdAt" | "liked">,
): StoredImage {
	const newImage: StoredImage = {
		...image,
		id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		createdAt: new Date().toISOString(),
		liked: false,
	};

	const existing = getGeneratedImages();
	const updated = [newImage, ...existing].slice(0, 100); // Keep max 100 images

	if (typeof window !== "undefined") {
		localStorage.setItem(GENERATED_IMAGES_KEY, JSON.stringify(updated));
	}

	return newImage;
}

/**
 * Save multiple generated images at once
 */
export function saveGeneratedImages(
	images: Array<Omit<StoredImage, "id" | "createdAt" | "liked">>,
): StoredImage[] {
	const newImages: StoredImage[] = images.map((image, index) => ({
		...image,
		id: `gen_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
		createdAt: new Date().toISOString(),
		liked: false,
	}));

	const existing = getGeneratedImages();
	const updated = [...newImages, ...existing].slice(0, 100);

	if (typeof window !== "undefined") {
		localStorage.setItem(GENERATED_IMAGES_KEY, JSON.stringify(updated));
	}

	return newImages;
}

/**
 * Toggle like status for an image
 */
export function toggleLikeImage(imageId: string): boolean {
	const generated = getGeneratedImages();
	const liked = getLikedImages();

	// Find the image in generated images
	const imageIndex = generated.findIndex((img) => img.id === imageId);

	if (imageIndex === -1) return false;

	const image = generated[imageIndex];
	const wasLiked = image.liked;

	// Toggle the liked status
	generated[imageIndex] = { ...image, liked: !wasLiked };

	if (typeof window !== "undefined") {
		localStorage.setItem(GENERATED_IMAGES_KEY, JSON.stringify(generated));

		if (wasLiked) {
			// Remove from liked images
			const updatedLiked = liked.filter((l) => l.id !== imageId);
			localStorage.setItem(LIKED_IMAGES_KEY, JSON.stringify(updatedLiked));
		} else {
			// Add to liked images
			const updatedLiked = [
				generated[imageIndex],
				...liked.filter((l) => l.id !== imageId),
			];
			localStorage.setItem(LIKED_IMAGES_KEY, JSON.stringify(updatedLiked));
		}
	}

	return !wasLiked;
}

/**
 * Delete a generated image
 */
export function deleteGeneratedImage(imageId: string): boolean {
	const generated = getGeneratedImages();
	const liked = getLikedImages();

	const filtered = generated.filter((img) => img.id !== imageId);
	const filteredLiked = liked.filter((img) => img.id !== imageId);

	if (filtered.length === generated.length) return false;

	if (typeof window !== "undefined") {
		localStorage.setItem(GENERATED_IMAGES_KEY, JSON.stringify(filtered));
		localStorage.setItem(LIKED_IMAGES_KEY, JSON.stringify(filteredLiked));
	}

	return true;
}

/**
 * Clear all stored images
 */
export function clearAllImages(): void {
	if (typeof window !== "undefined") {
		localStorage.removeItem(GENERATED_IMAGES_KEY);
		localStorage.removeItem(LIKED_IMAGES_KEY);
	}
}

/**
 * Like/unlike an image by URL (for gallery images from Vercel Blob)
 * Returns true if now liked, false if unliked
 */
export function toggleLikeImageByUrl(
	url: string,
	name?: string,
	prompt?: string,
): boolean {
	if (typeof window === "undefined") return false;

	const liked = getLikedImages();
	const existingIndex = liked.findIndex((img) => img.url === url);

	if (existingIndex !== -1) {
		// Remove from liked
		const updated = liked.filter((img) => img.url !== url);
		localStorage.setItem(LIKED_IMAGES_KEY, JSON.stringify(updated));
		return false;
	}

	// Add to liked
	const newLikedImage: StoredImage = {
		id: `liked_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		url,
		prompt: prompt || name || "Gallery image",
		provider: "gallery",
		modelId: "blob",
		createdAt: new Date().toISOString(),
		liked: true,
	};

	const updated = [newLikedImage, ...liked];
	localStorage.setItem(LIKED_IMAGES_KEY, JSON.stringify(updated));
	return true;
}

/**
 * Check if an image URL is liked
 */
export function isImageLikedByUrl(url: string): boolean {
	const liked = getLikedImages();
	return liked.some((img) => img.url === url);
}

/**
 * Get all liked image URLs as a Set
 */
export function getLikedImageUrls(): Set<string> {
	const liked = getLikedImages();
	return new Set(liked.map((img) => img.url));
}
