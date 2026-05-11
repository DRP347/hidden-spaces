import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

export function CommunitySubmitSection() {
  return (
    <section className="section-shell mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10" aria-labelledby="submit-spot-title">
      <div className="grid gap-5 rounded-[30px] border border-white/70 bg-[#FFFDF8]/82 p-5 shadow-[0_18px_60px_rgba(75,55,29,0.10)] sm:p-7 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-[#EFE5D5] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#9E3F2F]">
            <MapPinned className="h-3.5 w-3.5" />
            Community map
          </p>
          <h2 id="submit-spot-title" className="mt-3 font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] text-[#151515] sm:text-4xl">
            Know a quiet spot?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d5143]">
            Help this guide grow by sharing a peaceful beach, lane, café, sunrise point, food stop, or local corner.
          </p>
        </div>
        <Link href="/submit" className="primary-button w-fit">
          Submit a hidden spot
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
