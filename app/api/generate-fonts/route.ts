import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, style } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const stylePrompt = style
      ? `in a ${style} style`
      : "in various creative and artistic styles";

    const prompt = `Generate 5 creative font variations of the following text ${stylePrompt}. 
Each variation should use different Unicode characters, symbols, or styling to create visually distinct versions.
Return only the styled text variations, one per line, without numbering or additional explanation.

Original text: "${text}"`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 500,
    });

    const fonts = result.text
      .split("\n")
      .filter((line) => line.trim())
      .slice(0, 5);

    if (fonts.length === 0) {
      return NextResponse.json(
        { fonts: [text] },
        { status: 200 }
      );
    }

    return NextResponse.json({ fonts });
  } catch (error) {
    console.error("Error generating fonts:", error);
    return NextResponse.json(
      { error: "Failed to generate fonts" },
      { status: 500 }
    );
  }
}
