import { useState } from "react";
import { ArrowUp } from "lucide-react";
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

export function PromptInput({
  isLoading,
  onSubmit,
}: PromptInputProps) {
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
    <div className="w-full mb-8">
      <div className="relative bg-zinc-900/90 rounded-xl p-4 border-2 border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.5),inset_0_0_15px_rgba(57,255,20,0.1)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(57,255,20,0.7),inset_0_0_20px_rgba(57,255,20,0.15)]">
        <div className="flex flex-col gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt here"
            rows={3}
            className="text-base bg-transparent border-none p-0 resize-none placeholder:text-[#39FF14]/50 text-[#39FF14] focus-visible:ring-0 focus-visible:ring-offset-0 font-medium tracking-wide"
          />
          <div className="flex items-center justify-end pt-1">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 rounded-full bg-[#39FF14] flex items-center justify-center disabled:opacity-50 shadow-[0_0_20px_rgba(57,255,20,0.8)] hover:shadow-[0_0_30px_rgba(57,255,20,1)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Spinner className="w-4 h-4 text-black" />
              ) : (
                <ArrowUp className="w-5 h-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
