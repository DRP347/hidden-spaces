import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SubmitSpotForm } from "@/components/submit/SubmitSpotForm";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Submit a Hidden Spot",
  description:
    "Share a quiet beach, old lane, café, sunrise corner, sunset spot, or local place for Hidden Spaces Daman.",
  alternates: {
    canonical: getCanonicalUrl("/submit"),
  },
};

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-[#F5EFE6] px-4 py-5 text-[#151515] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="secondary-button mb-4 w-fit bg-white/60 px-4 text-[#5d5143]">
          <ArrowLeft className="h-4 w-4" />
          Back to map
        </Link>

        <section className="grid overflow-hidden rounded-[34px] bg-[#FFFDF8] shadow-[0_24px_90px_rgba(75,55,29,0.12)] ring-1 ring-[#eadcc8] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative bg-[linear-gradient(145deg,#EAF5F5,#F8F1E7)] p-5 sm:p-8">
            <div className="absolute inset-0 opacity-[0.24] [background-image:linear-gradient(rgba(75,55,29,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(75,55,29,.1)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="relative">
              <p className="inline-flex rounded-full bg-[#FFFDF8]/78 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#9E3F2F]">
                Community note
              </p>
              <h1 className="mt-4 max-w-md text-balance font-display text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                Know a quiet spot? Submit it.
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-[#5d5143]">
                Share a peaceful beach, old lane, café, sunrise point, food stop, or photo walk.
                I’ll check the note before adding it to the map.
              </p>
              <div className="mt-8 grid gap-3 text-sm font-semibold text-[#5d5143]">
                <p className="rounded-2xl bg-white/60 p-4 ring-1 ring-white/70">
                  Contact is optional. Leave it blank if you just want to share the place.
                </p>
                <p className="rounded-2xl bg-white/60 p-4 ring-1 ring-white/70">
                  A Google Maps link helps most, but a clear area name also works.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <SubmitSpotForm />
          </div>
        </section>
      </div>
    </main>
  );
}
