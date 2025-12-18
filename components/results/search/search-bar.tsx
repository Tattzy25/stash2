"use client";

import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/components/upload-button";

type SearchBarProps = {
	formAction: (payload: FormData) => void;
	isPending: boolean;
	isShowingSearchResults: boolean;
	hasImages: boolean;
	onReset: () => void;
};

export const SearchBar = ({
	formAction,
	isPending,
	isShowingSearchResults,
	hasImages,
	onReset,
}: SearchBarProps) => {
	return (
		<form
			action={formAction}
			className="-translate-x-1/2 absolute bottom-8 left-1/2 z-10 flex w-full max-w-sm items-center gap-1 rounded-full bg-background p-1 shadow-xl sm:max-w-lg"
		>
			{isShowingSearchResults && (
				<Button
					className="shrink-0 rounded-full"
					disabled={isPending}
					onClick={onReset}
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
				<Button className="shrink-0" disabled size="icon" variant="ghost">
					<Loader2Icon className="size-4 animate-spin" />
				</Button>
			) : (
				<UploadButton />
			)}
		</form>
	);
};
