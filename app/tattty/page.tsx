"use client";

import { useState } from "react";
import { ImageDisplay } from "@/components/ImageDisplay";
import { ModelCardCarousel } from "@/components/ModelCardCarousel";
import { OptionsTabs } from "@/components/OptionsTabs";
import { PromptInput } from "@/components/PromptInput";
import { useImageGeneration } from "@/hooks/use-image-generation";
import {
  initializeProviderRecord,
  MODEL_CONFIGS,
  type ModelMode,
  PROVIDER_ORDER,
  PROVIDERS,
  type ProviderKey,
} from "@/lib/provider-config";
import { getRandomSuggestions } from "@/lib/suggestions";

export default function Page() {
  const suggestions = getRandomSuggestions();

  const {
    images,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    activePrompt,
  } = useImageGeneration();

  const [showProviders, setShowProviders] = useState(true);
  const [selectedModels, setSelectedModels] = useState<
    Record<ProviderKey, string>
  >(MODEL_CONFIGS.performance);
  const [enabledProviders, setEnabledProviders] = useState(
    initializeProviderRecord(true)
  );
  const [mode, setMode] = useState<ModelMode>("performance");

  const toggleView = () => {
    setShowProviders((prev) => !prev);
  };

  const handleModeChange = (newMode: ModelMode) => {
    setMode(newMode);
    setSelectedModels(MODEL_CONFIGS[newMode]);
    setShowProviders(true);
  };

  const handleModelChange = (providerKey: ProviderKey, model: string) => {
    setSelectedModels((prev) => ({ ...prev, [providerKey]: model }));
  };

  const handleProviderToggle = (provider: string, enabled: boolean) => {
    setEnabledProviders((prev) => ({
      ...prev,
      [provider]: enabled,
    }));
  };

  const providerToModel = {
    replicate: selectedModels.replicate,
  };

  const handlePromptSubmit = (newPrompt: string) => {
    const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
    if (activeProviders.length > 0) {
      startGeneration(newPrompt, activeProviders, providerToModel);
    }
    setShowProviders(false);
  };

  const getModelProps = () =>
    (Object.keys(PROVIDERS) as ProviderKey[])
      .map((key) => {
        const provider = PROVIDERS[key];
        const imageItem = images.find((img) => img.provider === key);
        const imageData = imageItem?.image;
        const modelId = imageItem?.modelId ?? "N/A";
        const timing = timings[key];

        return {
          label: provider.displayName,
          models: provider.models,
          value: selectedModels[key],
          providerKey: key,
          onChange: (model: string, providerKey: ProviderKey) =>
            handleModelChange(providerKey, model),
          iconPath: provider.iconPath,
          color: provider.color,
          enabled: enabledProviders[key],
          onToggle: (enabled: boolean) => handleProviderToggle(key, enabled),
          image: imageData,
          modelId,
          timing,
          failed: failedProviders.includes(key),
        };
      });

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
      <div className="h-full overflow-y-auto">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <h1 className="mb-8 pt-4 text-center font-[family-name:var(--font-rock-salt)] font-bold text-3xl sm:mb-12 sm:pt-[30px] sm:text-5xl md:mb-[100px] md:text-6xl lg:text-7xl">
              INK FEVER?
            </h1>

            {/* Prompt Input */}
            <div className="mx-auto max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
              <PromptInput
                isLoading={isLoading}
                mode={mode}
                onModeChange={handleModeChange}
                onSubmit={handlePromptSubmit}
                onToggleProviders={toggleView}
                showProviders={showProviders}
              />
            </div>

            {/* Options Tabs */}
            <OptionsTabs />

            {/* Mobile: Carousel - Hidden */}
            <div className="hidden">
              <ModelCardCarousel models={getModelProps()} />
            </div>

            {/* Single centered image result */}
            <div className="flex justify-center pt-[100px]">
              {getModelProps()
                .slice(0, 1)
                .map((props) => (
                  <div className="w-[1000px] max-w-[1000px]" key={props.label}>
                    <div className="relative h-[500px] w-full rounded-lg bg-zinc-50">
                      <ImageDisplay
                        failed={props.failed}
                        image={props.image}
                        modelId={props.modelId}
                        provider={props.providerKey}
                        timing={props.timing}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {/* Active prompt display */}
            {activePrompt && activePrompt.length > 0 && (
              <div className="mt-4 text-center text-muted-foreground">
                {activePrompt}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
