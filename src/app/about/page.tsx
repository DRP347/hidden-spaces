import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Hidden Spaces Daman",
  description:
    "A short note on how Hidden Spaces Daman curates quiet beaches, old lanes, cafés, sunrise spots, sunset corners, and local field notes.",
  alternates: {
    canonical: getCanonicalUrl("/about"),
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5EFE6] px-4 py-8 text-[#151515] sm:px-6 sm:py-12">
      <section className="mx-auto max-w-4xl rounded-[32px] bg-[#FFFDF8] p-5 shadow-[0_24px_90px_rgba(75,55,29,0.10)] ring-1 ring-[#eadcc8] sm:p-8">
        <p className="inline-flex rounded-full bg-[#EFE5D5] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#9E3F2F]">
          Local guide note
        </p>
        <h1 className="mt-4 max-w-2xl text-balance font-display text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
          About Hidden Spaces Daman
        </h1>
        <div className="mt-6 grid gap-5 text-[15px] leading-7 text-[#5d5143] sm:text-base">
          <p>
            Hidden Spaces Daman is a calm local field guide built to help people find quieter beaches,
            old lanes, cafés, sunrise corners, sunset points, food stops, and photo walks around Daman.
          </p>
          <p>
            Spots are selected for local usefulness: when to visit, how peaceful or interesting the
            place feels, whether directions are clear, and whether the note helps someone decide faster.
          </p>
          <p>
            This is editorial local guidance, not official tourism advice. Please check weather, tides,
            opening hours, access rules, and local restrictions before you go.
          </p>
          <p>
            Community submissions are reviewed before they appear on the public map.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/#spots" className="primary-button">
            Explore spots
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/submit" className="secondary-button">
            Submit a hidden spot
          </Link>
        </div>
      </section>
    </main>
  );
}
