/** biome-ignore-all lint/suspicious/noConsole: "Handy for debugging" */

import { put } from "@vercel/blob";
import { FatalError, getStepMetadata, RetryableError } from "workflow";

type SerializableFile = {
	buffer: ArrayBuffer;
	name: string;
	type: string;
	size: number;
};

/**
 * Converts a title to a URL-safe slug
 * "Eagle Blossom Majesty" -> "eagle-blossom-majesty"
 */
const slugify = (title: string): string => {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
		.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Gets the file extension from the original filename or mime type
 */
const getExtension = (filename: string, mimeType: string): string => {
	// Try to get from filename first
	const extMatch = filename.match(/\.([a-zA-Z0-9]+)$/);
	if (extMatch) return extMatch[1].toLowerCase();

	// Fallback to mime type
	const mimeExtensions: Record<string, string> = {
		"image/jpeg": "jpg",
		"image/png": "png",
		"image/gif": "gif",
		"image/webp": "webp",
		"image/svg+xml": "svg",
	};
	return mimeExtensions[mimeType] || "png";
};

export const uploadImage = async (fileData: SerializableFile, title: string) => {
	"use step";

	const { attempt, stepStartedAt, stepId } = getStepMetadata();

	// Create a descriptive filename from the title
	const slug = slugify(title);
	const extension = getExtension(fileData.name, fileData.type);
	const filename = `${slug}.${extension}`;

	console.log(
		`[${stepId}] Uploading image (attempt ${attempt})...`,
		{ originalName: fileData.name, newFilename: filename, title },
	);

	try {
		const blob = await put(filename, fileData.buffer, {
			access: "public",
			addRandomSuffix: true, // Still adds random suffix for uniqueness
			contentType: fileData.type,
		});

		console.log(
			`[${stepId}] Successfully uploaded image ${filename} at ${stepStartedAt.toISOString()}`,
			blob.url,
		);

		return blob;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";

		// Check for rate limiting
		if (
			message.includes("rate limit") ||
			message.includes("429") ||
			message.includes("quota")
		) {
			throw new RetryableError(`Blob storage rate limited: ${message}`, {
				retryAfter: "1m",
			});
		}

		// Check for storage quota errors
		if (
			message.includes("quota exceeded") ||
			message.includes("storage full")
		) {
			throw new FatalError(`[${stepId}] Storage quota exceeded: ${message}`);
		}

		// Check for invalid file errors
		if (
			message.includes("invalid file") ||
			message.includes("unsupported") ||
			message.includes("400")
		) {
			throw new FatalError(
				`[${stepId}] Invalid file type or format: ${message}`,
			);
		}

		// After 3 attempts for upload operations, give up
		if (attempt >= 3) {
			throw new FatalError(
				`[${stepId}] Failed to upload image after ${attempt} attempts as of ${stepStartedAt.toISOString()}: ${message}`,
			);
		}

		// Otherwise, retry
		throw new Error(`Image upload failed: ${message}`);
	}
};

uploadImage.maxRetries = 3;
