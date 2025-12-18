"use client";

import { Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { GenerateButton } from "@/components/generate-button";
import { GenerationInputContainer } from "@/components/generation-input-container";
import { PromptTextarea } from "@/components/prompt-textarea";
import { StyleSelect } from "@/components/style-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FontVariation {
	style: string;
	text: string;
}

export default function FontsPage() {
	const [text, setText] = useState("");
	const [style, setStyle] = useState("");
	const [generatedFonts, setGeneratedFonts] = useState<FontVariation[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleGenerate = async () => {
		if (!text.trim()) {
			toast({
				title: "Input Required",
				description: "Please enter some text to generate fonts.",
				variant: "destructive",
			});
			return;
		}

		if (text.length > 100) {
			toast({
				title: "Text Too Long",
				description: "Please enter text with 100 characters or less.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch("/api/generate-fonts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text, style }),
			});

			if (!response.ok) {
				throw new Error("Failed to generate fonts");
			}

			const data = await response.json();
			setGeneratedFonts(data.variations || []);

			toast({
				title: "Success",
				description: "Font variations generated successfully!",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to generate fonts. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopy = (fontText: string) => {
		navigator.clipboard.writeText(fontText);
		toast({
			title: "Copied",
			description: "Font text copied to clipboard!",
		});
	};

	return (
		<div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
			<div className="h-full overflow-y-auto">
				<div className="px-4 py-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						{/* Header */}
						<h1 className="mb-8 pt-4 text-center font-[family-name:var(--font-rock-salt)] font-bold text-3xl sm:mb-12 sm:pt-[30px] sm:text-5xl md:text-6xl lg:text-7xl">
							FONT FORGE
						</h1>

						{/* Input Section */}
						<div className="mx-auto mb-8 max-w-full px-4 sm:max-w-xl sm:px-0 md:max-w-2xl lg:max-w-3xl">
							<GenerationInputContainer>
								<div className="space-y-4">
									<PromptTextarea
										value={text}
										onChange={setText}
										label="Text"
										placeholder="Enter the text you want to stylize..."
										rows={3}
									/>
									<StyleSelect
										value={style}
										onValueChange={setStyle}
										options={[
											{ value: "bold", label: "Bold" },
											{ value: "elegant", label: "Elegant" },
											{ value: "gothic", label: "Gothic" },
											{ value: "modern", label: "Modern" },
											{ value: "cursive", label: "Cursive" },
											{ value: "calligraphy", label: "Calligraphy" },
											{ value: "graffiti", label: "Graffiti" },
											{ value: "minimalist", label: "Minimalist" },
										]}
										label="Style"
										placeholder="Select a style..."
									/>
									<GenerateButton
										onClick={handleGenerate}
										isLoading={isLoading}
										disabled={isLoading}
									>
										Generate Font Variations
									</GenerateButton>
								</div>
							</GenerationInputContainer>
						</div>

						{/* Results Section */}
						{generatedFonts.length > 0 && (
							<div className="mx-auto max-w-full space-y-4 px-4 sm:max-w-xl sm:px-0 md:max-w-2xl lg:max-w-3xl">
								<h2 className="mb-6 text-center font-bold text-xl sm:text-2xl">
									Generated Variations
								</h2>
								{generatedFonts.map((font, index) => (
									<Card key={index} className="rounded-lg border-2">
										<CardContent className="p-4 sm:p-6">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<p className="mb-2 text-xs text-muted-foreground">
														{font.style}
													</p>
													<p className="break-words text-base sm:text-lg font-medium">
														{font.text}
													</p>
												</div>
												<Button
													onClick={() => handleCopy(font.text)}
													size="icon"
													variant="ghost"
													className="shrink-0"
												>
													<Copy className="h-4 w-4" />
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}

						{/* Empty State */}
						{!isLoading && generatedFonts.length === 0 && (
							<div className="mx-auto max-w-full px-4 py-12 text-center text-muted-foreground sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
								<p>
									Enter text above and click "Generate Font Variations" to see
									creative text transformations.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
