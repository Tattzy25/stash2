/** biome-ignore-all lint/suspicious/noConsole: "Handy for debugging" */

import { generateText, type ImagePart } from "ai";
import { FatalError, getStepMetadata, RetryableError } from "workflow";

type SerializableFile = {
	buffer: ArrayBuffer;
	name: string;
	type: string;
	size: number;
};

export type ImageDescriptions = {
	title: string; // 2-3 words max
	shortDescription: string; // 1 sentence for UI
	longDescription: string; // Full detailed description (prompt-style)
};

export const generateDescription = async (fileData: SerializableFile): Promise<ImageDescriptions> => {
	"use step";

	const { attempt, stepStartedAt, stepId } = getStepMetadata();

	console.log(
		`[${stepId}] Generating description (attempt ${attempt})...`,
		fileData.name,
	);

	try {
		// Convert ArrayBuffer to base64 for Grok
		const base64 = Buffer.from(fileData.buffer).toString("base64");
		const dataUrl = `data:${fileData.type};base64,${base64}`;

		const imagePart: ImagePart = {
			type: "image",
			image: dataUrl,
		};

		const { text } = await generateText({
			model: "xai/grok-2-vision",
			system: `You are an image analyzer. Analyze the image and return ONLY a valid JSON object with these exact fields:

{
  "title": "2-3 word title, powerful and descriptive",
  "shortDescription": "One sentence, punchy product description for UI display",
  "longDescription": "Detailed prompt-style description of everything in the image. Be thorough, describe colors, subjects, composition, mood, style."
}

Rules:
- title: MAX 3 words. Make it memorable. Examples: "Eagle Blossom Majesty", "Tattooed Rebel", "Dark Phoenix"
- shortDescription: ONE sentence only. Think product listing. Examples: "A fierce eagle surrounded by cherry blossoms in flight.", "Woman with sleeve tattoos holding a beer against graffiti wall."
- longDescription: Full detailed description, 2-4 sentences. Describe what you see exactly. No fluff.

Return ONLY the JSON object, no markdown, no code blocks, no extra text.`,
			messages: [
				{
					role: "user",
					content: [imagePart],
				},
			],
		});

		// Parse the JSON response
		// Clean up potential markdown code blocks
		const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
		const descriptions: ImageDescriptions = JSON.parse(cleanedText);

		console.log(
			`[${stepId}] Successfully generated descriptions at ${stepStartedAt.toISOString()}`,
			{ title: descriptions.title },
		);

		return descriptions;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";

		// Check for rate limiting or temporary errors
		if (
			message.includes("rate limit") ||
			message.includes("429") ||
			message.includes("quota")
		) {
			throw new RetryableError(`Rate limited: ${message}`, {
				retryAfter: "5m",
			});
		}

		// Check for invalid image or permanent errors
		if (
			message.includes("invalid image") ||
			message.includes("unsupported") ||
			message.includes("400")
		) {
			throw new FatalError(
				`[${stepId}] Invalid image or unsupported format: ${message}`,
			);
		}

		// After 5 attempts, give up
		if (attempt >= 5) {
			throw new FatalError(
				`[${stepId}] Failed to generate description after ${attempt} attempts as of ${stepStartedAt.toISOString()}: ${message}`,
			);
		}

		// Otherwise, retry with exponential backoff
		throw new Error(`AI generation failed: ${message}`);
	}
};

generateDescription.maxRetries = 5;
