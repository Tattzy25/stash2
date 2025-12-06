import Image from "next/image";
import { cn } from "@/lib/utils";

type PreviewProps = {
  url: string;
  priority?: boolean;
  onClick?: () => void;
  selected?: boolean;
};

export const Preview = ({ url, priority, onClick, selected }: PreviewProps) => (
  <button
    aria-label="Open image preview"
    className={cn(
      "group hover:-translate-y-0.5 mb-4 w-full rounded-xl bg-card p-2 text-left shadow-2xl shadow-black/60 transition hover:shadow-black/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      selected && "ring-2 ring-primary/70 ring-offset-2"
    )}
    onClick={onClick}
    type="button"
  >
    <Image
      alt={url}
      className="rounded-md transition group-hover:scale-[1.01]"
      height={630}
      priority={priority}
      sizes="(max-width: 640px) 100vw, 25vw"
      src={url}
      width={630}
    />
  </button>
);
