"use client";

import { Clock3, Compass, ExternalLink, MapPin, X } from "lucide-react";
import { useEffect } from "react";

import { ShareButtons } from "@/components/share/ShareButtons";
import { SpotVisual } from "@/components/site/SpotVisual";
import { useScrollLock } from "@/hooks/useScrollLock";
import { getSpotUrl } from "@/lib/seo";
import { getGoogleMapsUrl } from "@/lib/site";
import type { Spot } from "@/types/spot";

export function SpotDetailsModal({
  spot,
  onClose,
}: {
  spot: Spot | null;
  onClose: () => void;
}) {
  const isOpen = Boolean(spot);
  useScrollLock(isOpen);

  useEffect(() => {
    if (!spot) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, spot]);

  if (!spot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#151515]/24 p-0 backdrop-blur-[1px] sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="Close field note"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="spot-dialog-title"
        className="relative max-h-[92dvh] w-full max-w-[52rem] overflow-y-auto rounded-t-[28px] bg-[#FFFDF8] pb-[env(safe-area-inset-bottom)] shadow-[0_24px_86px_rgba(21,21,21,0.22)] ring-1 ring-white/70 sm:rounded-[32px] sm:pb-0"
      >
        <div className="relative">
          <SpotVisual spot={spot} priority className="aspect-[16/10] max-h-[40svh] rounded-t-[28px] sm:aspect-[16/7] sm:rounded-t-[32px]" />
          <button
            type="button"
            aria-label="Close field note"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-[#FFFDF8]/88 text-[#151515] shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 p-4 sm:gap-5 sm:p-6">
          <div>
            <p className="text-sm font-bold text-[#9E3F2F]">{spot.category} · {spot.area}</p>
            <h2 id="spot-dialog-title" className="mt-2 max-w-2xl text-balance font-display text-[2.15rem] font-semibold leading-[0.98] tracking-[-0.04em] text-[#151515] sm:text-[3rem]">
              {spot.name}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#5b4f42] sm:text-base">{spot.longDescription}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <InfoPill icon={<Clock3 className="h-4 w-4" />} label="Best time" value={spot.bestTime} />
            <InfoPill icon={<Compass className="h-4 w-4" />} label="Mood" value={spot.mood} />
            <InfoPill icon={<MapPin className="h-4 w-4" />} label="Map pin" value={`${spot.coordinates.lat.toFixed(3)}, ${spot.coordinates.lng.toFixed(3)}`} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Note title="Travel tip" text={spot.travelTip} />
            <Note title="Nearby hint" text={spot.nearbyHint} />
          </div>

          <div className="flex flex-wrap gap-2">
            {spot.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#F5EFE6] px-3 py-1.5 text-sm font-semibold text-[#675844]">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ShareButtons title={spot.name} url={getSpotUrl(spot)} />
            <a
              href={getGoogleMapsUrl(spot)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1E4E8C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#153c6d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99A3D]"
            >
              Open in Google Maps
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F5EFE6] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8a785e]">
        {icon}
        {label}
      </div>
      <p className="text-sm font-bold text-[#151515]">{value}</p>
    </div>
  );
}

function Note({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#eadcc8] bg-white p-4">
      <h3 className="text-sm font-bold text-[#151515]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5d5143]">{text}</p>
    </div>
  );
}
