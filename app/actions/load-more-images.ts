"use server";

import { list } from "@vercel/blob";

const ITEMS_PER_PAGE = 20;

export async function loadMoreImages(cursor?: string) {
	try {
		const result = await list({
			prefix: "tattty/",
			limit: ITEMS_PER_PAGE,
			cursor,
		});

		return {
			blobs: result.blobs,
			cursor: result.cursor,
			hasMore: result.hasMore,
		};
	} catch (error) {
		console.error("Error loading more images:", error);
		throw new Error("Failed to load more images");
	}
}
