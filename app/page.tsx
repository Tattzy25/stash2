import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TaTTTy - Tattoo Image Generator",
  description:
    "AI-powered tattoo image generation and management platform with semantic search capabilities",
};

const Home = () => (
  <main className="flex min-h-screen items-center justify-center bg-background">
    <Link
      className="rounded-xl bg-red-600 px-8 py-4 font-bold text-2xl text-white shadow-lg transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      href="/tattty"
    >
      ENTER
    </Link>
  </main>
);

export default Home;
