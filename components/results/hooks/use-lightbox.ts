"use client";

import { useCallback, useState } from "react";

export const useLightbox = () => {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const openLightbox = useCallback((index: number) => {
		setLightboxIndex(index);
		setSelectedIndex(index);
	}, []);

	const closeLightbox = useCallback(() => {
		setLightboxIndex(null);
		// Keep selectedIndex so highlight persists in gallery
	}, []);

	const handleLightboxSelect = useCallback((index: number) => {
		setLightboxIndex(index);
		setSelectedIndex(index);
	}, []);

	return {
		lightboxIndex,
		selectedIndex,
		openLightbox,
		closeLightbox,
		handleLightboxSelect,
	};
};
