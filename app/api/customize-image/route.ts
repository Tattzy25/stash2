import { NextRequest, NextResponse } from "next/server";
import * as fal from "@fal-ai/client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image_") && value instanceof File) {
        imageFiles.push(value);
      }
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await fal.storage.upload(buffer, {
        contentType: file.type,
      });
      
      uploadedUrls.push(uploadResult);
    }

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
      input: {
        prompt,
        image_url: uploadedUrls[0],
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Image generation in progress...");
        }
      },
    });

    if (!result || !result.data || !result.data.images || result.data.images.length === 0) {
      throw new Error("No image generated");
    }

    const imageUrl = result.data.images[0].url;

    return NextResponse.json({ image: imageUrl });
  } catch (error) {
    console.error("Error generating custom image:", error);
    return NextResponse.json(
      { error: "Failed to generate custom image" },
      { status: 500 }
    );
  }
}
