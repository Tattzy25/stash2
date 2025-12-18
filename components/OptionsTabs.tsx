"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OptionsTabs() {
	return (
		<div className="flex justify-center">
			<Tabs className="w-[1000px]" defaultValue="style">
				<TabsList className="mb-6 flex h-auto w-full justify-center gap-8 bg-transparent p-2">
					<TabsTrigger
						className="rounded-full border-2 border-[#39FF14] bg-transparent px-6 py-3 text-[#39FF14] text-lg ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50"
						value="style"
					>
						Style
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full border-2 border-[#39FF14] bg-transparent px-6 py-3 text-[#39FF14] text-lg ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50"
						value="color"
					>
						Color
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full border-2 border-[#39FF14] bg-transparent px-6 py-3 text-[#39FF14] text-lg ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50"
						value="mood"
					>
						Mood
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full border-2 border-[#39FF14] bg-transparent px-6 py-3 text-[#39FF14] text-lg ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50"
						value="placement"
					>
						Placement
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full border-2 border-[#39FF14] bg-transparent px-6 py-3 text-[#39FF14] text-lg ring-2 ring-[#39FF14]/30 ring-offset-2 ring-offset-zinc-900 hover:bg-[#39FF14]/10 data-[state=active]:bg-[#39FF14] data-[state=active]:text-black data-[state=active]:ring-[#39FF14]/50"
						value="aspect"
					>
						Aspect Ratio
					</TabsTrigger>
				</TabsList>

				<TabsContent value="style">
					<Card className="mx-auto h-[400px] w-[1000px] border-zinc-700 bg-zinc-900/80">
						<CardContent className="flex h-full items-center justify-center p-8"></CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="color">
					<Card className="mx-auto h-[400px] w-[1000px] border-zinc-700 bg-zinc-900/80">
						<CardContent className="flex h-full items-center justify-center p-8"></CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="mood">
					<Card className="mx-auto h-[400px] w-[1000px] border-zinc-700 bg-zinc-900/80">
						<CardContent className="flex h-full items-center justify-center p-8"></CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="placement">
					<Card className="mx-auto h-[400px] w-[1000px] border-zinc-700 bg-zinc-900/80">
						<CardContent className="flex h-full items-center justify-center p-8"></CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="aspect">
					<Card className="mx-auto h-[400px] w-[1000px] border-zinc-700 bg-zinc-900/80">
						<CardContent className="flex h-full items-center justify-center p-8"></CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
