"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export function OptionsTabs() {
  return (
    <div className="flex justify-center">
      <Tabs defaultValue="style" className="w-[1000px]">
        <TabsList className="flex justify-center gap-8 bg-transparent h-auto p-2 mb-6 w-full">
          <TabsTrigger value="style" className="text-lg px-6 py-3 rounded-full bg-transparent border-2 border-[#39FF14] text-[#39FF14] ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50">Style</TabsTrigger>
          <TabsTrigger value="color" className="text-lg px-6 py-3 rounded-full bg-transparent border-2 border-[#39FF14] text-[#39FF14] ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50">Color</TabsTrigger>
          <TabsTrigger value="mood" className="text-lg px-6 py-3 rounded-full bg-transparent border-2 border-[#39FF14] text-[#39FF14] ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50">Mood</TabsTrigger>
          <TabsTrigger value="placement" className="text-lg px-6 py-3 rounded-full bg-transparent border-2 border-[#39FF14] text-[#39FF14] ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50">Placement</TabsTrigger>
          <TabsTrigger value="aspect" className="text-lg px-6 py-3 rounded-full bg-transparent border-2 border-[#39FF14] text-[#39FF14] ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50">Aspect Ratio</TabsTrigger>
        </TabsList>

        <TabsContent value="style">
          <Card className="w-[1000px] h-[400px] bg-zinc-900/80 border-zinc-700 mx-auto">
            <CardContent className="p-8 h-full flex items-center justify-center">
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="color">
          <Card className="w-[1000px] h-[400px] bg-zinc-900/80 border-zinc-700 mx-auto">
            <CardContent className="p-8 h-full flex items-center justify-center">
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood">
          <Card className="w-[1000px] h-[400px] bg-zinc-900/80 border-zinc-700 mx-auto">
            <CardContent className="p-8 h-full flex items-center justify-center">
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placement">
          <Card className="w-[1000px] h-[400px] bg-zinc-900/80 border-zinc-700 mx-auto">
            <CardContent className="p-8 h-full flex items-center justify-center">
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aspect">
          <Card className="w-[1000px] h-[400px] bg-zinc-900/80 border-zinc-700 mx-auto">
            <CardContent className="p-8 h-full flex items-center justify-center">
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
