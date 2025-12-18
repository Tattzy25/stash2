"use client";

import { useState } from "react";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptInput } from "@/components/PromptInput";
import { useImageGeneration } from "@/hooks/use-image-generation";
import {
	initializeProviderRecord,
	MODEL_CONFIGS,
	type ModelMode,
	PROVIDER_ORDER,
	type ProviderKey,
} from "@/lib/provider-config";

export default function Page() {
	const {
		images,
		timings,
		failedProviders,
		isLoading,
		startGeneration,
		activePrompt,
	} = useImageGeneration();

	const [selectedModels, setSelectedModels] = useState<
		Record<ProviderKey, string>
	>(MODEL_CONFIGS.performance);
	const [enabledProviders, setEnabledProviders] = useState(
		initializeProviderRecord(true),
	);
	const [mode, setMode] = useState<ModelMode>("performance");

	const handleModeChange = (newMode: ModelMode) => {
		setMode(newMode);
		setSelectedModels(MODEL_CONFIGS[newMode]);
	};

	const providerToModel = {
		replicate: selectedModels.replicate,
	};

	const handlePromptSubmit = (newPrompt: string) => {
		const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
		if (activeProviders.length > 0) {
			startGeneration(newPrompt, activeProviders, providerToModel);
		}
	};

	return (
		<div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
			<div className="h-full overflow-y-auto">
				<div className="px-4 py-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<h1 className="mb-8 pt-4 text-center font-[family-name:var(--font-rock-salt)] font-bold text-3xl sm:mb-12 sm:pt-[30px] sm:text-5xl md:text-6xl lg:text-7xl">
							CLAUDE? 🧠
						</h1>

						<div className="mx-auto max-w-full space-y-6 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
							<PromptInput
								isLoading={isLoading}
								mode={mode}
								onModeChange={handleModeChange}
								onSubmit={handlePromptSubmit}
								onToggleProviders={() => {}}
								showProviders={true}
							/>
						</div>

						<div className="relative mt-12 flex justify-center">
							{images.length > 0 ? (
								<div className="w-full max-w-[1000px] px-4 sm:px-0">
									<div className="relative h-[400px] sm:h-[500px] w-full rounded-lg bg-zinc-50 shadow-lg">
										<ImageDisplay
											failed={failedProviders.includes("replicate")}
											image={images[0]?.image}
											modelId={images[0]?.modelId ?? "N/A"}
											provider={images[0]?.provider || "replicate"}
											timing={timings["replicate"]}
										/>
									</div>
								</div>
							) : null}
						</div>

						{activePrompt && activePrompt.length > 0 && (
							<div className="mt-8 text-center text-muted-foreground">
								<p className="text-sm">Current prompt: {activePrompt}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
