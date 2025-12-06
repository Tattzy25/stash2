"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmptyStateProps } from "../types";

export function EmptyState({ type }: EmptyStateProps) {
  const isGenerated = type === "generated";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PlaceholderImage />
      <IconBadge isGenerated={isGenerated} />
      <EmptyTitle isGenerated={isGenerated} />
      <EmptyDescription isGenerated={isGenerated} />
      {isGenerated && <CreateButton />}
    </div>
  );
}

// Sub-components
function PlaceholderImage() {
  return (
    <div className="relative w-32 h-32 mb-6">
      <Image
        src="/tattied.svg"
        alt="No images yet"
        fill
        className="object-contain opacity-50"
      />
    </div>
  );
}

function IconBadge({ isGenerated }: { isGenerated: boolean }) {
  return (
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      {isGenerated ? (
        <Sparkles className="h-8 w-8 text-muted-foreground/50" />
      ) : (
        <Heart className="h-8 w-8 text-muted-foreground/50" />
      )}
    </div>
  );
}

function EmptyTitle({ isGenerated }: { isGenerated: boolean }) {
  return (
    <h3 className="text-lg font-medium">
      {isGenerated ? "No generated designs yet" : "No liked designs yet"}
    </h3>
  );
}

function EmptyDescription({ isGenerated }: { isGenerated: boolean }) {
  return (
    <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
      {isGenerated
        ? "Head over to Tattty AI to create your first tattoo design!"
        : "Click the heart icon on any generated image to add it to your favorites collection."}
    </p>
  );
}

function CreateButton() {
  return (
    <Link href="/tattty">
      <Button>
        <Sparkles className="mr-2 h-4 w-4" />
        Create Your First Design
      </Button>
    </Link>
  );
}

export default EmptyState;
