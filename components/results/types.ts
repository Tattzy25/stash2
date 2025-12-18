import type { ListBlobResult } from "@vercel/blob";

export type ResultsClientProps = {
	defaultData: ListBlobResult["blobs"];
	initialCursor?: string;
	initialHasMore?: boolean;
};

export type LightboxItem = {
	url: string;
	name?: string;
	description?: string;
	size?: number;
	prompt?: string;
};
