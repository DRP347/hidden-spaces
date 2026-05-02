"use client";

import { Clock3, ExternalLink, MapPin, X } from "lucide-react";

import { SpotVisual } from "@/components/site/SpotVisual";
import { getSpotAccent } from "@/lib/map";
import { getGoogleMapsUrl } from "@/lib/site";
import type { Spot } from "@/types/spot";

export function MapSpotPreview({
  spot,
  onClose,
  onViewDetails,
}: {
  spot: Spot | null;
  onClose: () => void;
  onViewDetails: (spot: Spot) => void;
}) {
  if (!spot) return null;

  return (
    <aside className="pointer-events-auto absolute inset-x-3 bottom-3 z-30 mx-auto max-h-[54svh] max-w-xl overflow-hidden rounded-[28px] border border-white/72 bg-[#FFFDF8]/82 shadow-[0_28px_96px_rgba(22,32,42,0.2)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-8 sm:right-6 sm:max-h-none sm:w-[460px] lg:right-8">
      <div className="grid max-h-[54svh] grid-cols-[96px_1fr] gap-0 overflow-y-auto overscroll-contain sm:max-h-none sm:grid-cols-[142px_1fr] sm:overflow-visible">
        <SpotVisual spot={spot} className="min-h-full" />
        <div className="p-3.5 sm:p-5">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-[#25313D] ring-1 ring-white/80 sm:px-3 sm:text-xs"
                  style={{ boxShadow: `inset 3px 0 0 ${getSpotAccent(spot)}` }}
                >
                  {spot.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#675844] sm:text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  {spot.area}
                </span>
              </div>
              <h2 className="mt-2 max-w-sm text-balance font-display text-[1.65rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#151515] sm:mt-3 sm:text-4xl">
                {spot.name}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close selected place preview"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/70 text-[#25313D] shadow-sm ring-1 ring-white/80 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-sm leading-5 text-[#514638] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden sm:mt-3 sm:text-[15px] sm:leading-6 sm:[-webkit-line-clamp:unset]">{spot.description}</p>

          <div className="mt-3 hidden rounded-2xl bg-white/54 px-3 py-2 text-xs font-semibold leading-5 text-[#5d5143] ring-1 ring-white/70 min-[430px]:block">
            {spot.travelTip}
          </div>
          <p className="mt-2 hidden text-xs font-semibold leading-5 text-[#756651] sm:block">
            Nearby: {spot.nearbyHint}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EFE6]/86 px-3 py-1.5 text-xs font-bold text-[#5f5345]">
              <Clock3 className="h-3.5 w-3.5" />
              {spot.bestTime}
            </span>
            {spot.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-white/66 px-3 py-1.5 text-xs font-bold text-[#675844] ring-1 ring-white/75">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
            <button
              type="button"
              onClick={() => onViewDetails(spot)}
              className="min-h-11 rounded-full bg-[#151515] px-3 py-2 text-sm font-bold text-[#FFFDF8] transition hover:bg-[#1E4E8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99A3D] active:scale-[0.98] sm:px-4"
            >
              <span className="sm:hidden">Details</span>
              <span className="hidden sm:inline">View field note</span>
            </button>
            <a
              href={getGoogleMapsUrl(spot)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-white/72 px-3 py-2 text-sm font-bold text-[#25313D] ring-1 ring-white/80 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98] sm:gap-2 sm:px-4"
            >
              <span className="sm:hidden">Maps</span>
              <span className="hidden sm:inline">Open in Maps</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
