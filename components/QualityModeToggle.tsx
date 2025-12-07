"use client";

import { Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export type QualityMode = "performance" | "quality";

interface QualityModeToggleProps {
  value: QualityMode;
  onValueChange: (value: QualityMode) => void;
  disabled?: boolean;
}

export function QualityModeToggle({
  onValueChange,
  disabled = false,
}: QualityModeToggleProps) {
  const { toast } = useToast();

  return (
    <div className="flex min-w-[240px] flex-col items-center gap-2">
      <div className="flex gap-2">
        <Button
          disabled={disabled}
          onClick={() => {
            onValueChange("performance");
            toast({
              description: "Switching to faster models for quicker generation",
              duration: 2000,
            });
          }}
          variant="secondary"
        >
          <Zap className="mr-2 h-4 w-4" />
          Performance
        </Button>
        <Button
          disabled={disabled}
          onClick={() => {
            onValueChange("quality");
            toast({
              description:
                "Switching to higher quality models for better results",
              duration: 2000,
            });
          }}
          variant="secondary"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Quality
        </Button>
      </div>
    </div>
  );
}
