"use client";

import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PAGE_TITLES: Record<string, string> = {
	"/tattty": "Tattty AI",
	"/tattty/gallery": "Gallery",
	"/tattty/fonts": "Font Forge",
	"/tattty/customize": "Customize",
	"/tattty/settings": "Settings",
	"/my-tatttz": "My TaTTTz",
};

export function SiteHeader() {
	const pathname = usePathname();
	const title = PAGE_TITLES[pathname] || "Gallery";

	return (
		<header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1 h-10 w-10 sm:h-9 sm:w-9" />
				<Separator
					className="mx-1 data-[orientation=vertical]:h-5 sm:mx-2 sm:data-[orientation=vertical]:h-4"
					orientation="vertical"
				/>
				<h1 className="font-medium text-sm sm:text-base">{title}</h1>
				<div className="ml-auto flex items-center gap-1 sm:gap-2">
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
