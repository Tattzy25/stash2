import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type QualityMode = "performance" | "quality";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  showProviders: boolean;
  onToggleProviders: () => void;
  mode: QualityMode;
  onModeChange: (mode: QualityMode) => void;
}

export function PromptInput({ isLoading, onSubmit }: PromptInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!isLoading && input.trim()) {
      onSubmit(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit(input);
      }
    }
  };

  return (
    <div className="mb-8 w-full">
      <div className="relative rounded-xl border-2 border-[#39FF14] bg-zinc-900/90 p-4 shadow-[0_0_15px_rgba(57,255,20,0.5),inset_0_0_15px_rgba(57,255,20,0.1)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(57,255,20,0.7),inset_0_0_20px_rgba(57,255,20,0.15)]">
        <div className="flex flex-col gap-3">
          <Textarea
            className="resize-none border-none bg-transparent p-0 font-medium text-[#39FF14] text-base tracking-wide placeholder:text-[#39FF14]/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt here"
            rows={3}
            value={input}
          />
          <div className="flex items-center justify-end pt-1">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.8)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(57,255,20,1)] active:scale-95 disabled:opacity-50"
              disabled={isLoading || !input.trim()}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Spinner className="h-4 w-4 text-black" />
              ) : (
                <ArrowUp className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
