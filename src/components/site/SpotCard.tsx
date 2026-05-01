"use client";

import { Clock3, MapPin } from "lucide-react";

import { SpotVisual } from "@/components/site/SpotVisual";
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
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-[#FFFDF8] shadow-[0_22px_70px_rgba(75,55,29,0.12)] ring-1 ring-[#eadcc8] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(75,55,29,0.18)]">
      <SpotVisual spot={spot} priority={priority} className="aspect-[4/3]" />
      <div className="flex flex-1 flex-col p-5">
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
        <h3 className="font-display text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-[#151515]">
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
        <button
          type="button"
          onClick={() => onSelect(spot)}
          className="mt-5 min-h-11 rounded-full bg-[#151515] px-4 py-2 text-sm font-bold text-[#FFFDF8] transition hover:bg-[#1E4E8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99A3D] active:scale-[0.98]"
        >
          View field note
        </button>
      </div>
    </article>
  );
}
