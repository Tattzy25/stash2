import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Rock_Salt } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";

const sans = Geist({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: "variable",
	display: "swap",
});

const mono = Geist_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: "variable",
	display: "swap",
});

const rockSalt = Rock_Salt({
	variable: "--font-rock-salt",
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});

const orbitron = Orbitron({
	variable: "--font-orbitron",
	subsets: ["latin"],
	weight: ["400", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "OPS.TaTTTy",
	description: "AI-powered image management platform with semantic search",
};

type RootLayoutProps = {
	children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
	<html lang="en" suppressHydrationWarning>
		<body
			className={cn(
				sans.variable,
				mono.variable,
				rockSalt.variable,
				orbitron.variable,
				"antialiased",
			)}
		>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				disableTransitionOnChange
				enableSystem
			>
				{children}
				<Analytics />
				<Toaster />
			</ThemeProvider>
		</body>
	</html>
);

export default RootLayout;
