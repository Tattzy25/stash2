"use client";

import { useState } from "react";
import { ModelSelect } from "@/components/ModelSelect";
import { PromptInput } from "@/components/PromptInput";
import { ModelCardCarousel } from "@/components/ModelCardCarousel";
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
    (Object.keys(PROVIDERS) as ProviderKey[]).map((key) => {
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
            {/* Prompt Input */}
            <PromptInput
              onSubmit={handlePromptSubmit}
              isLoading={isLoading}
              showProviders={showProviders}
              onToggleProviders={toggleView}
              mode={mode}
              onModeChange={handleModeChange}
              suggestions={suggestions}
            />
            
            {/* Mobile: Carousel */}
            <div className="md:hidden">
              <ModelCardCarousel models={getModelProps()} />
            </div>
            
            {/* Desktop: Grid of 4 provider cards */}
            <div className="hidden md:grid md:grid-cols-2 2xl:grid-cols-4 gap-8">
              {getModelProps().map((props) => (
                <ModelSelect key={props.label} {...props} />
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
