import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const result = await list({
			prefix: "tattty/",
		});

		// Filter for generated images (you might want to adjust this prefix/filter logic)
		const generatedBlobs = result.blobs.filter(blob =>
			blob.pathname.includes('generated') || blob.pathname.includes('tattoo')
		);

		// Convert blob data to GalleryImage format
		const images = generatedBlobs.map((blob) => ({
			id: blob.pathname.split('/').pop()?.replace(/\.[^/.]+$/, '') || blob.pathname,
			url: blob.url,
			prompt: blob.pathname.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Generated tattoo',
			provider: 'AI',
			createdAt: blob.uploadedAt.toISOString(),
			liked: false,
		}));

		return NextResponse.json(images);
	} catch (error) {
		console.error("Error fetching generated images:", error);
		return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
	}
}
