"use client";

import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { GenerateButton } from "@/components/generate-button";
import { GenerationInputContainer } from "@/components/generation-input-container";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptTextarea } from "@/components/prompt-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { useToast } from "@/hooks/use-toast";
import {
	CUSTOMIZE_MODEL,
	initializeProviderRecord,
	PROVIDER_ORDER,
	type ProviderKey,
} from "@/lib/provider-config";

interface ImageUpload {
	id: number;
	file: File | null;
	preview: string | null;
}

export default function CustomizePage() {
	const [prompt, setPrompt] = useState("");
	const [uploads, setUploads] = useState<ImageUpload[]>([
		{ id: 0, file: null, preview: null },
		{ id: 1, file: null, preview: null },
	]);
	const [enabledProviders, setEnabledProviders] = useState(
		initializeProviderRecord(true),
	);

	const {
		images,
		timings,
		failedProviders,
		isLoading: isGenerating,
		startGeneration,
	} = useImageGeneration();

	const { toast } = useToast();

	const addUploadSlot = useCallback(() => {
		if (uploads.length < 8) {
			setUploads((prev) => [
				...prev,
				{ id: prev.length, file: null, preview: null },
			]);
		}
	}, [uploads.length]);

	const handleFileChange = useCallback(
		(index: number, file: File | null) => {
			if (file && !file.type.startsWith("image/")) {
				toast({
					title: "Invalid File",
					description: "Please upload an image file.",
					variant: "destructive",
				});
				return;
			}

			setUploads((prev) => {
				const newUploads = [...prev];
				if (file) {
					const reader = new FileReader();
					reader.onloadend = () => {
						setUploads((current) => {
							const updated = [...current];
							updated[index] = {
								id: index,
								file,
								preview: reader.result as string,
							};
							return updated;
						});
					};
					reader.readAsDataURL(file);
				} else {
					newUploads[index] = { id: index, file: null, preview: null };
				}
				return newUploads;
			});
		},
		[toast],
	);

	const handleDrop = useCallback(
		(index: number, e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file) {
				handleFileChange(index, file);
			}
		},
		[handleFileChange],
	);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	}, []);

	const removeUpload = useCallback((index: number) => {
		setUploads((prev) => {
			const newUploads = [...prev];
			newUploads[index] = { id: index, file: null, preview: null };
			return newUploads;
		});
	}, []);

	const handleGenerate = async () => {
		if (!prompt.trim()) {
			toast({
				title: "Prompt Required",
				description: "Please enter a prompt to generate an image.",
				variant: "destructive",
			});
			return;
		}

		const uploadedFiles = uploads.filter((u) => u.file !== null);
		if (uploadedFiles.length === 0) {
			toast({
				title: "Upload Required",
				description: "Please upload at least one image.",
				variant: "destructive",
			});
			return;
		}

		const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
		if (activeProviders.length > 0) {
			const providerToModel = {
				replicate: CUSTOMIZE_MODEL,
			};
			startGeneration(prompt, activeProviders, providerToModel);
		}
	};

	return (
		<div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
			<div className="h-full overflow-y-auto">
				<div className="px-4 py-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						{/* Header */}
						<h1 className="mb-8 pt-4 text-center font-[family-name:var(--font-rock-salt)] font-bold text-3xl sm:mb-12 sm:pt-[30px] sm:text-5xl md:text-6xl lg:text-7xl">
							CUSTOMIZE
						</h1>

						{/* Prompt Input */}
						<div className="mx-auto mb-8 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
							<GenerationInputContainer>
								<PromptTextarea
									value={prompt}
									onChange={setPrompt}
									label="Prompt"
									placeholder="Describe how you want to combine these images..."
									rows={3}
								/>
							</GenerationInputContainer>
						</div>

						{/* Upload Grid */}
						<div className="mx-auto mb-8 max-w-full px-4 sm:px-6">
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
								{uploads.map((upload, index) => (
									<Card
										className="relative aspect-square cursor-pointer rounded-lg border-2 transition-all hover:border-primary hover:shadow-lg"
										key={upload.id}
										onDragOver={handleDragOver}
										onDrop={(e) => handleDrop(index, e)}
									>
										<CardContent className="h-full p-0">
											{upload.preview ? (
												<div className="relative h-full w-full">
													<Image
														alt={`Upload ${index + 1}`}
														className="rounded-lg object-cover"
														fill
														src={upload.preview}
													/>
													<Button
														className="absolute top-2 right-2 h-8 w-8 rounded-full"
														onClick={() => removeUpload(index)}
														size="icon"
														variant="destructive"
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											) : (
												<label
													className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg transition-all hover:bg-muted/50"
													htmlFor={`file-${index}`}
												>
													<input
														accept="image/*"
														className="hidden"
														id={`file-${index}`}
														onChange={(e) => {
															const file = e.target.files?.[0] || null;
															handleFileChange(index, file);
														}}
														type="file"
													/>
													<Upload className="mb-2 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
													<span className="px-2 text-center text-muted-foreground text-xs sm:text-sm">
														Drop or click
													</span>
												</label>
											)}
										</CardContent>
									</Card>
								))}
							</div>

							{/* Add More Button */}
							{uploads.length < 8 && (
								<div className="mt-4 flex justify-center">
									<Button
										className="gap-2 rounded-full"
										onClick={addUploadSlot}
										variant="outline"
										size="lg"
									>
										<Upload className="h-4 w-4" />
										Add Upload Slot ({uploads.length}/8)
									</Button>
								</div>
							)}
						</div>

						{/* Generate Button */}
						<div className="mx-auto mb-8 max-w-full px-4 sm:max-w-xl sm:px-0 md:max-w-2xl lg:max-w-3xl">
							<GenerateButton
								onClick={handleGenerate}
								isLoading={isGenerating}
								disabled={isGenerating}
							>
								Generate Custom Design
							</GenerateButton>
						</div>

						{/* Generated Image Display */}
						{images.length > 0 && (
							<div className="mx-auto mb-8 max-w-full px-4 sm:max-w-xl sm:px-0 md:max-w-2xl lg:max-w-3xl">
								<div className="flex justify-center">
									{images.slice(0, 1).map((imageItem) => (
										<div
											className="w-full max-w-[600px]"
											key={imageItem.provider}
										>
											<div className="relative h-[400px] sm:h-[500px] w-full rounded-lg bg-zinc-50 shadow-lg">
												<ImageDisplay
													failed={failedProviders.includes(
														imageItem.provider as ProviderKey,
													)}
													image={imageItem.image}
													modelId={imageItem.modelId ?? "N/A"}
													provider={imageItem.provider}
													timing={timings[imageItem.provider as ProviderKey]}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Empty State */}
						{!(isGenerating || images.length > 0) && (
							<div className="mx-auto max-w-full py-12 text-center text-muted-foreground sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
								<ImageIcon className="mx-auto mb-4 h-16 w-16 opacity-50" />
								<p>
									Upload images and enter a prompt to create your custom design.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
