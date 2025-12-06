"use client";

import type { ListBlobResult } from "@vercel/blob";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FileIcon,
  ImageIcon,
  ImageUpIcon,
  Loader2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { search } from "@/app/actions/search";
import { Card } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Preview } from "./preview";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { Input } from "./ui/input";
import { UploadButton } from "./upload-button";
import { useUploadedImages } from "./uploaded-images-provider";

type ResultsClientProps = {
  defaultData: ListBlobResult["blobs"];
};

type LightboxItem = { url: string };

const PRIORITY_COUNT = 12;

const getBlobUrl = (blob: { url?: string; downloadUrl?: string }) =>
  blob.downloadUrl ?? blob.url ?? "";

export const ResultsClient = ({ defaultData }: ResultsClientProps) => {
  const { images } = useUploadedImages();
  const [state, formAction, isPending] = useActionState(search, { data: [] });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if ("error" in state) {
      toast.error(state.error);
    }
  }, [state]);

  const reset = () => {
    window.location.reload();
  };

  const isShowingSearchResults =
    "data" in state && Array.isArray(state.data) && state.data.length > 0;

  const remoteBlobs = isShowingSearchResults ? (state.data ?? []) : defaultData;

  const galleryItems = useMemo<LightboxItem[]>(() => {
    const optimistic = images
      .map((image) => image.url)
      .filter(Boolean)
      .map((url) => ({ url }) as LightboxItem);

    const persisted = (remoteBlobs ?? [])
      .map((blob) => getBlobUrl(blob))
      .filter(Boolean)
      .map((url) => ({ url }) as LightboxItem);

    return [...optimistic, ...persisted];
  }, [images, remoteBlobs]);

  const hasImages = galleryItems.length > 0;

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handleLightboxSelect = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <div className="h-[calc(100svh-var(--header-height))] w-full overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
      <ResizablePanelGroup className="h-full w-full" direction="horizontal">
        <ResizablePanel defaultSize={20}>
          <div className="h-full overflow-y-auto p-4">
            <Card className="min-h-full w-full">
              {/* Left panel content */}
            </Card>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          <div className="relative h-full w-full">
            <div className="h-full w-full overflow-y-auto p-4 pb-24">
              {hasImages ? (
                <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-4 2xl:columns-4">
                  {galleryItems.map((item: LightboxItem, index: number) => (
                  <Preview
                    key={`${item.url}-${index}`}
                    onClick={(): void => openLightbox(index)}
                    priority={index < PRIORITY_COUNT}
                    selected={lightboxIndex === index}
                    url={item.url}
                  />
                  ))}
                </div>
              ) : (
                <Empty className="h-full min-h-[50vh] rounded-lg border">
                  <EmptyHeader className="max-w-none">
                    <div className="relative isolate mb-8 flex">
                      <div className="-rotate-12 translate-x-2 translate-y-2 rounded-full border bg-background p-3 shadow-xs">
                        <ImageIcon className="size-5 text-muted-foreground" />
                      </div>
                      <div className="z-10 rounded-full border bg-background p-3 shadow-xs">
                        <UploadIcon className="size-5 text-muted-foreground" />
                      </div>
                      <div className="-translate-x-2 translate-y-2 rotate-12 rounded-full border bg-background p-3 shadow-xs">
                        <FileIcon className="size-5 text-muted-foreground" />
                      </div>
                    </div>
                    <EmptyTitle>No images found</EmptyTitle>
                    <EmptyDescription>
                      Upload some images with the{" "}
                      <ImageUpIcon className="inline size-4" /> button below to
                      get started!
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>

            <form
              action={formAction}
              className="-translate-x-1/2 absolute bottom-8 left-1/2 z-10 flex w-full max-w-sm items-center gap-1 rounded-full bg-background p-1 shadow-xl sm:max-w-lg"
            >
              {isShowingSearchResults && (
                <Button
                  className="shrink-0 rounded-full"
                  disabled={isPending}
                  onClick={reset}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ArrowLeftIcon className="size-4" />
                </Button>
              )}
              <Input
                className="w-full rounded-full border-none bg-secondary shadow-none outline-none"
                disabled={isPending || !hasImages}
                id="search"
                name="search"
                placeholder="Search by description"
                required
              />
              {isPending ? (
                <Button
                  className="shrink-0"
                  disabled
                  size="icon"
                  variant="ghost"
                >
                  <Loader2Icon className="size-4 animate-spin" />
                </Button>
              ) : (
                <UploadButton />
              )}
            </form>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <ImageLightbox
        activeIndex={lightboxIndex}
        items={galleryItems}
        onClose={closeLightbox}
        onSelect={handleLightboxSelect}
      />
    </div>
  );
};

type ImageLightboxProps = {
  items: LightboxItem[];
  activeIndex: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
};

const ImageLightbox = ({
  items,
  activeIndex,
  onClose,
  onSelect,
}: ImageLightboxProps) => {
  const open = activeIndex !== null && items.length > 0;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    loop: items.length > 1,
  });

  useEffect(() => {
    if (!emblaApi || activeIndex === null) {
      return;
    }
    emblaApi.scrollTo(activeIndex, true);
  }, [emblaApi, activeIndex]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const handleSelect = () => {
      const selected = emblaApi.selectedScrollSnap();
      onSelect(selected);
    };

    emblaApi.on("select", handleSelect);
    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (!open) {
    return null;
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && onClose()} open={open}>
      <DialogContent
        className="max-w-full border-none bg-transparent p-0 shadow-none sm:max-w-5xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Image preview</DialogTitle>
        <div className="relative flex h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-background/95 backdrop-blur">
          <Button
            aria-label="Close image viewer"
            className="absolute top-4 right-4 z-20"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
          <div className="flex-1 overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {items.map((item, index) => (
                <div
                  className="relative flex h-full w-full flex-[0_0_100%] items-center justify-center p-4"
                  key={`${item.url}-${index}`}
                >
                  <div className="relative h-full w-full">
                    <Image
                      alt={item.url}
                      className="object-contain"
                      fill
                      priority
                      sizes="100vw"
                      src={item.url}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {items.length > 1 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-4">
              <Button
                aria-label="Previous image"
                className="pointer-events-auto"
                onClick={scrollPrev}
                size="icon"
                variant="ghost"
              >
                <ArrowLeftIcon className="size-5" />
              </Button>
              <Button
                aria-label="Next image"
                className="pointer-events-auto"
                onClick={scrollNext}
                size="icon"
                variant="ghost"
              >
                <ArrowRightIcon className="size-5" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
