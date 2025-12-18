/** biome-ignore-all lint/suspicious/noConsole: "Handy for debugging" */

import { Search } from "@upstash/search";
import type { PutBlobResult } from "@vercel/blob";
import { FatalError, getStepMetadata, RetryableError } from "workflow";
import type { ImageDescriptions } from "./generate-description";

const upstash = Search.fromEnv();

export const indexImage = async (blob: PutBlobResult, descriptions: ImageDescriptions) => {
	"use step";

	const { attempt, stepStartedAt, stepId } = getStepMetadata();

	console.log(
		`[${stepId}] Indexing image (attempt ${attempt})...`,
		{ pathname: blob.pathname, title: descriptions.title },
	);

	try {
		const index = upstash.index("images");

		// Store blob metadata in Upstash along with the description and tattoo-specific metadata
		const tattooMetadata = {
			// Tattoo style classification
			style: "traditional", // traditional, neo-traditional, japanese, realism, watercolor, minimalist, etc.

			// Body placement
			placement: "arm", // arm, leg, back, chest, thigh, calf, forearm, bicep, shoulder, etc.

			// Size classification
			size: "medium", // small, medium, large, sleeve, half-sleeve, full-back, etc.

			// Color information
			colors: ["black"], // Array of colors used: black, red, blue, green, yellow, etc.

			// Theme/subject categories
			themes: ["nature"], // nature, mythology, geometric, floral, portrait, lettering, etc.

			// Technical details
			difficulty: "intermediate", // beginner, intermediate, advanced
			sessionCount: 1, // Number of sessions required

			// Business metadata
			price: 150, // Estimated price in USD
			deposit: 50, // Deposit amount
			completed: true, // Whether tattoo is completed

			// Artist and studio info
			artist: "Tattoo Artist",
			studio: "Studio Name",

			// Client demographics (optional)
			clientAge: null,
			clientGender: null,

			// Healing and aftercare
			healingTime: "2-3 weeks",
			aftercare: "Keep dry for 24 hours, apply ointment 2-3 times daily",

			// Equipment used
			machine: "rotary", // rotary, coil
			needle: "5RL", // Needle configuration

			// Ink information
			ink: ["Intenze Black"], // Array of inks used

			// Custom tags for search
			tags: ["first tattoo", "blackwork"],

			// Quality rating
			rating: 5, // 1-5 star rating

			// Upload context
			uploadedBy: "user",
			uploadDate: new Date().toISOString(),

			// Search optimization
			searchable: true,
			visibility: "public", // public, private
		};

		const result = await index.upsert({
			id: blob.pathname,
			// ALL content fields are indexed and searchable
			// Users search by descriptions - that's how they find images
			content: {
				title: descriptions.title,
				description: descriptions.shortDescription,
				longDescription: descriptions.longDescription,
			},
			metadata: {
				// Blob data (url, downloadUrl, pathname, etc.)
				...blob,
				// Display fields (these match what LightboxItem expects)
				name: descriptions.title, // Used by lightbox for title display
				description: descriptions.shortDescription, // Used by lightbox for description
				// AI-generated descriptions (for future features)
				longDescription: descriptions.longDescription, // For premium download feature
				// Tattoo-specific metadata
				tattooMetadata,
			},
		});

		console.log(
			`[${stepId}] Successfully indexed image at ${stepStartedAt.toISOString()}`,
			{ title: descriptions.title },
		);

		return result;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";

		// Check for rate limiting
		if (
			message.includes("rate limit") ||
			message.includes("429") ||
			message.includes("quota")
		) {
			throw new RetryableError(`Upstash rate limited: ${message}`, {
				retryAfter: "1m",
			});
		}

		// Check for network/connection errors
		if (
			message.includes("timeout") ||
			message.includes("ECONNREFUSED") ||
			message.includes("ETIMEDOUT") ||
			message.includes("network")
		) {
			throw new RetryableError(`Network error: ${message}`, {
				retryAfter: "30s",
			});
		}

		// Check for invalid data (fatal)
		if (message.includes("invalid") || message.includes("400")) {
			throw new FatalError(`[${stepId}] Invalid data for indexing: ${message}`);
		}

		// After 5 attempts for search indexing, give up
		if (attempt >= 5) {
			throw new FatalError(
				`[${stepId}] Failed to index image after ${attempt} attempts as of ${stepStartedAt.toISOString()}: ${message}`,
			);
		}

		// Otherwise, retry
		throw new Error(`Search indexing failed: ${message}`);
	}
};

indexImage.maxRetries = 5;
