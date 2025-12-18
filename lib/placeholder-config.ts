// Placeholder images configuration for ImageAccordion
// Add or remove images here - the accordion will automatically use them

export const PLACEHOLDER_IMAGES = [
	"/bhjtdhgf.jpg",
	"/dvfwvd.jpg",
	"/dwvdvwd.jpg",
	"/fef.jpg",
	"/fgeweg.jpg",
	"/fqwfwfws.jpg",
	"/grgr.jpg",
	"/gvgwbvg.jpg",
	"/v.jpg",
	"/vdavf.jpg",
	"/vdfv.jpg",
	"/vwev.jpg",
] as const;

export type PlaceholderImage = (typeof PLACEHOLDER_IMAGES)[number];
