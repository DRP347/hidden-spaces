"use client";

import { Clock3, ExternalLink, MapPin, X } from "lucide-react";

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
    <aside className="pointer-events-auto absolute inset-x-3 bottom-4 z-30 mx-auto max-w-xl rounded-[28px] border border-white/70 bg-[#FFFDF8]/78 p-4 shadow-[0_26px_90px_rgba(22,32,42,0.18)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-8 sm:right-6 sm:w-[430px] sm:p-5 lg:right-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#25313D] ring-1 ring-white/80"
              style={{ boxShadow: `inset 3px 0 0 ${getSpotAccent(spot)}` }}
            >
              {spot.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#675844]">
              <MapPin className="h-3.5 w-3.5" />
              {spot.area}
            </span>
          </div>
          <h2 className="mt-3 max-w-sm font-display text-4xl font-semibold leading-[0.93] tracking-[-0.05em] text-[#151515]">
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

      <p className="mt-3 text-[15px] leading-6 text-[#514638]">{spot.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EFE6]/86 px-3 py-1.5 text-xs font-bold text-[#5f5345]">
          <Clock3 className="h-3.5 w-3.5" />
          {spot.bestTime}
        </span>
        {spot.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-white/66 px-3 py-1.5 text-xs font-bold text-[#675844] ring-1 ring-white/75">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onViewDetails(spot)}
          className="min-h-11 rounded-full bg-[#151515] px-4 py-2 text-sm font-bold text-[#FFFDF8] transition hover:bg-[#1E4E8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99A3D] active:scale-[0.98]"
        >
          View field note
        </button>
        <a
          href={getGoogleMapsUrl(spot)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/72 px-4 py-2 text-sm font-bold text-[#25313D] ring-1 ring-white/80 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98]"
        >
          Open in Maps
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </aside>
  );
}
