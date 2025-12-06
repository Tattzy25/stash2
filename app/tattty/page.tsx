"use client";

import { useState } from "react";
import { ModelSelect } from "@/components/ModelSelect";
import { PromptInput } from "@/components/PromptInput";
import { ModelCardCarousel } from "@/components/ModelCardCarousel";
import { ImageDisplay } from "@/components/ImageDisplay";
import {
  MODEL_CONFIGS,
  PROVIDERS,
  PROVIDER_ORDER,
  ProviderKey,
  ModelMode,
  initializeProviderRecord,
} from "@/lib/provider-config";
import { getRandomSuggestions } from "@/lib/suggestions";
import { useImageGeneration } from "@/hooks/use-image-generation";

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
    initializeProviderRecord(true),
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
    fireworks: selectedModels.fireworks,
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
      .filter((key) => key !== "fireworks")
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
        onToggle: (enabled: boolean) =>
          handleProviderToggle(key, enabled),
        image: imageData,
        modelId,
        timing,
        failed: failedProviders.includes(key),
      };
    });

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
      <div className="h-full overflow-y-auto">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <h1 className="pt-[30px] mb-[100px] text-5xl sm:text-6xl md:text-7xl font-bold text-center font-[family-name:var(--font-rock-salt)]">
              INK FEVER?
            </h1>
            
            {/* Prompt Input */}
            <PromptInput
              onSubmit={handlePromptSubmit}
              isLoading={isLoading}
              showProviders={showProviders}
              onToggleProviders={toggleView}
              mode={mode}
              onModeChange={handleModeChange}
            />
            
            {/* Mobile: Carousel - Hidden */}
            <div className="hidden">
              <ModelCardCarousel models={getModelProps()} />
            </div>
            
            {/* Single centered image result */}
            <div className="flex justify-center pt-[100px]">
              {getModelProps().slice(0, 1).map((props) => (
                <div key={props.label} className="w-[1000px] max-w-[1000px]">
                  <div className="relative w-full h-[500px] bg-zinc-50 rounded-lg">
                    <ImageDisplay
                      modelId={props.modelId}
                      provider={props.providerKey}
                      image={props.image}
                      timing={props.timing}
                      failed={props.failed}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Active prompt display */}
            {activePrompt && activePrompt.length > 0 && (
              <div className="text-center mt-4 text-muted-foreground">
                {activePrompt}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
