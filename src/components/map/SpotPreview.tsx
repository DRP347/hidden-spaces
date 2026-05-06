"use client";

import { Clock3, ExternalLink, MapPin, X } from "lucide-react";

import { SpotVisual } from "@/components/site/SpotVisual";
import { getSpotAccent } from "@/lib/map";
import { getGoogleMapsUrl } from "@/lib/site";
import type { Spot } from "@/types/spot";

export function SpotPreview({
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
    <aside className="spot-preview glass-panel pointer-events-auto absolute inset-x-3 bottom-3 z-30 mx-auto max-h-[70svh] max-w-xl overflow-hidden rounded-[28px] sm:inset-x-auto sm:bottom-8 sm:right-6 sm:max-h-[calc(100svh-150px)] sm:w-[360px] sm:rounded-[30px] lg:right-10 lg:top-[188px] lg:bottom-auto">
      <button
        type="button"
        aria-label="Close selected place preview"
        onClick={onClose}
        className="absolute left-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/72 text-[#25313D] shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="max-h-[70svh] overflow-y-auto overscroll-contain p-3 sm:max-h-[calc(100svh-150px)]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] bg-[#EADDC8]">
          <SpotVisual spot={spot} className="h-full" showBadge={false} />
        </div>

        <div className="px-1 pb-2 pt-4 sm:px-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-2 rounded-full bg-[#FFF7EA] px-3 py-1.5 text-[11px] font-bold text-[#9E3F2F] ring-1 ring-[#D99A3D]/18"
              style={{ boxShadow: `inset 3px 0 0 ${getSpotAccent(spot)}` }}
            >
              {spot.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6b5b48]">
              <MapPin className="h-3.5 w-3.5" />
              {spot.area}
            </span>
          </div>

          <h2 className="mt-3 max-w-sm text-balance font-display text-[2rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#151515] sm:text-[2.35rem]">
            {spot.name}
          </h2>

          <p className="mt-3 text-[14px] leading-6 text-[#514638]">{spot.description}</p>

          <div className="mt-4 rounded-2xl border border-[#EADDC8]/80 bg-[#F7EFE1]/76 px-3.5 py-3 text-xs font-semibold leading-5 text-[#8a6845]">
            <span className="inline-flex items-center gap-1.5 text-[#D0802F]">
              <Clock3 className="h-3.5 w-3.5" />
              Best time:
            </span>{" "}
            {spot.bestTime}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {spot.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-[#EDE8DE]/92 px-3 py-1.5 text-xs font-semibold text-[#675844] ring-1 ring-white/65">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(spot)}
              className="primary-button px-4"
            >
              View field note
            </button>
            <a
              href={getGoogleMapsUrl(spot)}
              target="_blank"
              rel="noreferrer"
              className="secondary-button px-4"
            >
              <span className="hidden min-[390px]:inline">Open in Maps</span>
              <span className="min-[390px]:hidden">Maps</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
