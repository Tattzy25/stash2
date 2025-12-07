import { NextRequest, NextResponse } from "next/server";
import { fal } from "@ai-sdk/fal";
import { experimental_generateImage as generateImage } from "ai";

const TIMEOUT_MILLIS = 55 * 1000;

const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMillis: number
): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMillis)
    ),
  ]);

export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;

    if (!prompt || typeof prompt !== "string") {
      console.error(`Prompt is required [requestId=${requestId}]`);
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
      console.error(`At least one image is required [requestId=${requestId}]`);
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    const firstFile = imageFiles[0];
    const arrayBuffer = await firstFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const dataUrl = `data:${firstFile.type};base64,${base64Image}`;

    const startstamp = performance.now();
    
    const generatePromise = generateImage({
      model: fal.image("fal-ai/flux-pro/v1.1"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        fal: {
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          enable_safety_checker: true,
        },
      },
    }).then(({ image, warnings }) => {
      if (warnings?.length > 0) {
        console.warn(
          `Warnings [requestId=${requestId}]: `,
          warnings
        );
      }
      console.log(
        `Completed custom image request [requestId=${requestId}, elapsed=${(
          (performance.now() - startstamp) / 1000
        ).toFixed(1)}s].`
      );

      return {
        image: image.base64,
      };
    });

    const result = await withTimeout(generatePromise, TIMEOUT_MILLIS);
    
    return NextResponse.json(result, {
      status: "image" in result ? 200 : 500,
    });
  } catch (error) {
    console.error(
      `Error generating custom image [requestId=${requestId}]: `,
      error
    );
    return NextResponse.json(
      { error: "Failed to generate custom image. Please try again later." },
      { status: 500 }
    );
  }
}
