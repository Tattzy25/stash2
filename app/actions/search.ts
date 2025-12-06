/** biome-ignore-all lint/suspicious/noConsole: "Handy for debugging" */

"use server";

import { Search } from "@upstash/search";
import type { PutBlobResult } from "@vercel/blob";

const upstash = Search.fromEnv();
const index = upstash.index("images");

type SearchResponse =
  | {
      data: PutBlobResult[];
    }
  | {
      error: string;
    };

type SearchParams = {
  query: string;
  visibility?: "public" | "private";
  userId?: string;
};

export const search = async (
  _prevState: SearchResponse | undefined,
  formData: FormData
): Promise<SearchResponse> => {
  const query = formData.get("search");
  const visibilityFilter = formData.get("visibility") as "public" | "private";
  const userIdFilter = formData.get("userId") as string;

  // Extract tattoo metadata filters
  const styleFilter = formData.get("style") as string;
  const placementFilter = formData.get("placement") as string;
  const minPrice = formData.get("minPrice") as string;
  const maxPrice = formData.get("maxPrice") as string;
  const colorsFilter = formData.get("colors") as string;

  if (!query || typeof query !== "string") {
    return { error: "Please enter a search query" };
  }

  try {
    console.log(
      "Searching index for query:",
      query
    );

    // Build filter string from tattoo metadata
    const filters: string[] = [];

    if (styleFilter) filters.push(`tattooMetadata.style = '${styleFilter}'`);
    if (placementFilter) filters.push(`tattooMetadata.placement = '${placementFilter}'`);
    if (minPrice) filters.push(`tattooMetadata.price >= ${minPrice}`);
    if (maxPrice) filters.push(`tattooMetadata.price <= ${maxPrice}`);
    if (colorsFilter) filters.push(`tattooMetadata.colors CONTAINS '${colorsFilter}'`);

    const filterString = filters.length > 0 ? filters.join(" AND ") : undefined;

    const results = await index.search({
      query,
      filter: filterString,
    });

    console.log("Results:", results);
    const data = results
      .sort((a, b) => b.score - a.score)
      .map((result) => result.metadata)
      .filter(Boolean) as unknown as PutBlobResult[];

    console.log("Images found:", data);
    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return { error: message };
  }
};
