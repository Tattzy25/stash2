"use client";

import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ImageUpload {
  id: number;
  file: File | null;
  preview: string | null;
}

export default function CustomizePage() {
  const [prompt, setPrompt] = useState("");
  const [uploads, setUploads] = useState<ImageUpload[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i, file: null, preview: null }))
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = useCallback(
    (index: number, file: File | null) => {
      if (file && !file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      setUploads((prev) => {
        const newUploads = [...prev];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploads((current) => {
              const updated = [...current];
              updated[index] = {
                id: index,
                file,
                preview: reader.result as string,
              };
              return updated;
            });
          };
          reader.readAsDataURL(file);
        } else {
          newUploads[index] = { id: index, file: null, preview: null };
        }
        return newUploads;
      });
    },
    [toast]
  );

  const handleDrop = useCallback(
    (index: number, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileChange(index, file);
      }
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const removeUpload = useCallback((index: number) => {
    setUploads((prev) => {
      const newUploads = [...prev];
      newUploads[index] = { id: index, file: null, preview: null };
      return newUploads;
    });
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive",
      });
      return;
    }

    const uploadedFiles = uploads.filter((u) => u.file !== null);
    if (uploadedFiles.length === 0) {
      toast({
        title: "Upload Required",
        description: "Please upload at least one image.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      uploadedFiles.forEach((upload, idx) => {
        if (upload.file) {
          formData.append(`image_${idx}`, upload.file);
        }
      });

      const response = await fetch("/api/customize-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const imageData = data.image.startsWith("data:") 
        ? data.image 
        : `data:image/webp;base64,${data.image}`;
      setGeneratedImage(imageData);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
      <div className="h-full overflow-y-auto">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <h1 className="mb-8 pt-4 text-center font-[family-name:var(--font-rock-salt)] font-bold text-3xl sm:mb-12 sm:pt-[30px] sm:text-5xl md:text-6xl lg:text-7xl">
              CUSTOMIZE
            </h1>

            {/* Prompt Input */}
            <div className="mx-auto mb-8 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Custom Design</CardTitle>
                  <CardDescription>
                    Upload up to 8 images and describe how you want them
                    combined
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                      id="prompt"
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe how you want to combine these images..."
                      rows={3}
                      value={prompt}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upload Grid */}
            <div className="mx-auto mb-8 max-w-full">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {uploads.map((upload, index) => (
                  <Card
                    className="relative aspect-square cursor-pointer transition-colors hover:border-primary"
                    key={upload.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(index, e)}
                  >
                    <CardContent className="h-full p-0">
                      {upload.preview ? (
                        <div className="relative h-full w-full">
                          <Image
                            alt={`Upload ${index + 1}`}
                            className="rounded-lg object-cover"
                            fill
                            src={upload.preview}
                          />
                          <Button
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => removeUpload(index)}
                            size="icon"
                            variant="destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <label
                          className="flex h-full cursor-pointer flex-col items-center justify-center"
                          htmlFor={`file-${index}`}
                        >
                          <input
                            accept="image/*"
                            className="hidden"
                            id={`file-${index}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleFileChange(index, file);
                            }}
                            type="file"
                          />
                          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                          <span className="px-2 text-center text-muted-foreground text-xs">
                            Drop or click
                          </span>
                        </label>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="mx-auto mb-8 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
              <Button
                className="w-full"
                disabled={isLoading}
                onClick={handleGenerate}
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Custom Design
              </Button>
            </div>

            {/* Generated Image Display */}
            {generatedImage && (
              <div className="mx-auto max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Design</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-square w-full">
                      <Image
                        alt="Generated design"
                        className="rounded-lg object-contain"
                        fill
                        src={generatedImage}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Empty State */}
            {!(isLoading || generatedImage) && (
              <div className="mx-auto max-w-full py-12 text-center text-muted-foreground sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <ImageIcon className="mx-auto mb-4 h-16 w-16 opacity-50" />
                <p>
                  Upload images and enter a prompt to create your custom design.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
