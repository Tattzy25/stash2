"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type TabKey = "style" | "color" | "mood" | "placement" | "aspect";

export function OptionsTabs() {
  const [hoveredTab, setHoveredTab] = useState<TabKey | null>(null);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "style", label: "Style" },
    { key: "color", label: "Color" },
    { key: "mood", label: "Mood" },
    { key: "placement", label: "Placement" },
    { key: "aspect", label: "Aspect Ratio" },
  ];

  return (
    <div className="flex justify-center">
      <div className="w-[1000px] relative">
        {/* Buttons */}
        <div className="flex justify-center gap-8 p-2 mb-6 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onMouseEnter={() => setHoveredTab(tab.key)}
              onMouseLeave={() => setHoveredTab(null)}
              className="text-lg px-6 py-3 rounded-full bg-transparent border-2 border-[#39FF14] text-[#39FF14] ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 transition-all duration-200"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hover Content */}
        {hoveredTab && (
          <div 
            className="absolute top-full left-0 right-0 z-50"
            onMouseEnter={() => setHoveredTab(hoveredTab)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <Card className="w-[1000px] bg-zinc-900/95 border-zinc-700 border-[#39FF14]/30 mx-auto backdrop-blur-sm shadow-[0_0_30px_rgba(57,255,20,0.2)]">
              <CardContent className="p-8">
                {hoveredTab === "style" && (
                  <div className="text-[#39FF14]">Style options content</div>
                )}
                {hoveredTab === "color" && (
                  <div className="text-[#39FF14]">Color options content</div>
                )}
                {hoveredTab === "mood" && (
                  <div className="text-[#39FF14]">Mood options content</div>
                )}
                {hoveredTab === "placement" && (
                  <div className="text-[#39FF14]">Placement options content</div>
                )}
                {hoveredTab === "aspect" && (
                  <div className="text-[#39FF14]">Aspect Ratio options content</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
