"use client";

import { useEffect, useState } from "react";

export interface GalleryImage {
	id: string;
	url: string;
	prompt: string;
	provider: string;
	createdAt: string;
	liked: boolean;
}

export function useImages() {
	const [images, setImages] = useState<GalleryImage[]>([]);
	const [likedImages, setLikedImages] = useState<GalleryImage[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		async function fetchImages() {
			try {
				// Fetch images from localStorage where liked status is stored
				const storedLiked = JSON.parse(localStorage.getItem("likedImages") || "[]");

				// Fetch generated images from Vercel Blob
				const generatedResponse = await fetch('/api/generated-images');
				const generatedImages: GalleryImage[] = generatedResponse.ok ? await generatedResponse.json() : [];

				// Fetch all images from Vercel Blob for liked images
				const allResponse = await fetch('/api/all-images');
				const allImages: GalleryImage[] = allResponse.ok ? await allResponse.json() : [];

				// Mark liked images based on localStorage
				const imagesWithLikes = allImages.map(img => ({
					...img,
					liked: storedLiked.includes(img.id)
				}));

				setImages(generatedImages);
				setLikedImages(imagesWithLikes.filter((img) => img.liked));
				setIsLoaded(true);
			} catch (error) {
				console.error('Failed to fetch images:', error);
				setIsLoaded(true);
			}
		}

		fetchImages();
	}, []);

	const handleToggleLike = (id: string) => {
		// Toggle like status in the array and localStorage
		setImages((prev) =>
			prev.map((img) => (img.id === id ? { ...img, liked: !img.liked } : img)),
		);

		// Update localStorage
		const currentLiked = JSON.parse(
			localStorage.getItem("likedImages") || "[]",
		);
		const newLiked = currentLiked.includes(id)
			? currentLiked.filter((imgId: string) => imgId !== id)
			: [...currentLiked, id];
		localStorage.setItem("likedImages", JSON.stringify(newLiked));

		// Update liked images list
		setLikedImages((prev) => prev.filter((img) => img.liked));
	};

	return {
		images,
		likedImages,
		isLoaded,
		handleToggleLike,
	};
}
