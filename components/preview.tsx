import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PreviewProps = {
	url: string;
	priority?: boolean;
	onClick?: () => void;
	selected?: boolean;
	liked?: boolean;
};

export const Preview = ({ url, priority, onClick, selected, liked }: PreviewProps) => (
	<button
		aria-label="Open image preview"
		className={cn(
			"group relative aspect-square w-full overflow-hidden rounded-xl bg-muted text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 active:brightness-90",
			selected && "ring-2 ring-primary ring-offset-2 brightness-110",
		)}
		onClick={onClick}
		type="button"
	>
		<Image
			alt={url}
			className="h-full w-full rounded-xl object-cover transition-transform duration-200 group-hover:scale-105 group-hover:brightness-105"
			fill
			loading={priority ? "eager" : "lazy"}
			priority={priority}
			sizes="(max-width: 768px) 50vw, 25vw"
			src={url}
		/>
		{liked && (
			<div className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
				<HeartIcon className="size-4 fill-current text-icon-heart" />
			</div>
		)}
	</button>
);
