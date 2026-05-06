"use client";

import { ExternalLink, MapPin } from "lucide-react";
import type { CSSProperties } from "react";

import { SpotVisual } from "@/components/site/SpotVisual";
import { getSpotAccent } from "@/lib/map";
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
    <article className="spot-card group" style={{ "--spot-accent": getSpotAccent(spot) } as CSSProperties}>
      <div className="spot-card-image">
        <SpotVisual spot={spot} priority={priority} className="h-full" showBadge={false} />
      </div>
      <div className="spot-card-body">
        <div className="spot-card-meta">
          <span className="inline-flex items-center rounded-full bg-[#FFF7EA] px-2.5 py-1 text-[#9E3F2F] ring-1 ring-[#D99A3D]/20">
            {spot.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[var(--spot-accent)]" />
            {spot.area}
          </span>
        </div>
        <h3 className="text-balance font-display text-[1.55rem] font-semibold leading-[1.04] tracking-[-0.035em] text-[#151515] sm:text-3xl">
          {spot.name}
        </h3>
        <p className="mt-3 text-[15px] leading-6 text-[#5f5345]">{spot.description}</p>
        <p className="mt-3 rounded-2xl bg-[#F7EFE1] px-3 py-2 text-xs font-semibold leading-5 text-[#8a6845] ring-1 ring-[#EADDC8]/70">
          Best time: {spot.bestTime}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {spot.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-[#EFF4EF] px-3 py-1 text-xs font-semibold text-[#4d6d62]">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={() => onSelect(spot)}
            className="primary-button"
          >
            View field note
          </button>
          <a
            href={getGoogleMapsUrl(spot)}
            target="_blank"
            rel="noreferrer"
            className="secondary-button"
          >
            <span className="sm:hidden">Open in Maps</span>
            <span className="hidden sm:inline">Maps</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
