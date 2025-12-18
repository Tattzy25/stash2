export const getBlobUrl = (blob: { url?: string; downloadUrl?: string }) =>
	blob.downloadUrl ?? blob.url ?? "";

export const getFilenameFromUrl = (url: string): string => {
	try {
		const pathname = new URL(url).pathname;
		const filename = pathname.split("/").pop() || "Untitled";
		// Remove file extension and clean up
		return decodeURIComponent(
			filename.replace(/\.[^/.]+$/, "").replaceAll("-", " "),
		);
	} catch {
		return "Untitled";
	}
};

export const formatFileSize = (bytes?: number): string => {
	if (!bytes) return "Unknown size";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
