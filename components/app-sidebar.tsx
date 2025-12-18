"use client";

import {
	IconAlertCircle,
	IconBrain,
	IconChartBar,
	IconDashboard,
	IconHelp,
	IconHelpCircle,
	IconInnerShadowTop,
	IconLayout,
	IconListDetails,
	IconNetwork,
	IconPalette,
	IconSearch,
	IconSettings,
	IconTypography,
} from "@tabler/icons-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Tattty AI",
			url: "/tattty",
			icon: IconDashboard,
		},
		{
			title: "Claude",
			url: "/tattty/claude",
			icon: IconBrain,
		},
		{
			title: "Agents",
			url: "/tattty/agents",
			icon: IconNetwork,
		},
		{
			title: "Are All",
			url: "/tattty/are-all",
			icon: IconLayout,
		},
		{
			title: "Fucking",
			url: "/tattty/fucking",
			icon: IconAlertCircle,
		},
		{
			title: "Morons",
			url: "/tattty/morons",
			icon: IconHelpCircle,
		},
		{
			title: "Gallery",
			url: "/tattty/gallery",
			icon: IconListDetails,
		},
		{
			title: "My TaTTTz",
			url: "/my-tatttz",
			icon: IconChartBar,
		},
		{
			title: "Fonts",
			url: "/tattty/fonts",
			icon: IconTypography,
		},
		{
			title: "Customize",
			url: "/tattty/customize",
			icon: IconPalette,
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "/tattty/settings",
			icon: IconSettings,
		},
		{
			title: "Get Help",
			url: "/tattty/get-help",
			icon: IconHelp,
		},
		{
			title: "Search",
			url: "/tattty/search",
			icon: IconSearch,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="/dashboard">
								<IconInnerShadowTop className="!size-5" />
								<span className="font-semibold text-base">Tattty AI</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary className="mt-auto" items={data.navSecondary} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
