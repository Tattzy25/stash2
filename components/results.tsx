import { list } from "@vercel/blob";
import { ResultsClient } from "./results.client";

const PAGE_SIZE = 24;

export const Results = async () => {
	const { blobs, cursor, hasMore } = await list({ limit: PAGE_SIZE });

	return (
		<ResultsClient
			defaultData={blobs}
			initialCursor={cursor}
			initialHasMore={hasMore}
		/>
	);
};
