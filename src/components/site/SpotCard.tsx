"use client";

import { Clock3, ExternalLink, MapPin } from "lucide-react";

import { SpotVisual } from "@/components/site/SpotVisual";
import { getGoogleMapsUrl } from "@/lib/site";
import type { Spot } from "@/types/spot";

export function SpotCard({
  spot,
  priority = false,
  onSelect,
}: {
  spot: Spot;
  priority?: boolean;
  onSelect: (spot: Spot) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-[#FFFDF8] shadow-[0_18px_54px_rgba(75,55,29,0.1)] ring-1 ring-[#eadcc8] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(75,55,29,0.16)] sm:rounded-[28px]">
      <SpotVisual spot={spot} priority={priority} className="aspect-[16/11] sm:aspect-[4/3]" />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-[#6d604f]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {spot.area}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D99A3D]" />
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {spot.bestTime}
          </span>
        </div>
        <h3 className="text-balance font-display text-[1.55rem] font-semibold leading-[1.04] tracking-[-0.035em] text-[#151515] sm:text-3xl">
          {spot.name}
        </h3>
        <p className="mt-3 text-[15px] leading-6 text-[#5f5345]">{spot.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {spot.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-[#F5EFE6] px-3 py-1 text-xs font-semibold text-[#6b5b48]">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={() => onSelect(spot)}
            className="min-h-11 rounded-full bg-[#151515] px-4 py-2 text-sm font-bold text-[#FFFDF8] transition hover:bg-[#1E4E8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99A3D] active:scale-[0.98]"
          >
            View field note
          </button>
          <a
            href={getGoogleMapsUrl(spot)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#F5EFE6] px-4 py-2 text-sm font-bold text-[#473b2e] transition hover:bg-[#eadcc8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98]"
          >
            Open in Maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
