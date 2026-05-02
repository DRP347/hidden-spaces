"use client";

import { MapPin } from "lucide-react";

import type { Spot } from "@/types/spot";

const bounds = {
  minLat: 20.36,
  maxLat: 20.45,
  minLng: 72.82,
  maxLng: 72.84,
};

export function MapPreview({
  spots,
  selectedSpot,
  onSelect,
}: {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelect: (spot: Spot) => void;
}) {
  const callout = selectedSpot ?? spots[0] ?? null;

  return (
    <section id="field-map" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16" aria-labelledby="field-map-title">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9E3F2F]">Field map preview</p>
          <h2 id="field-map-title" className="mt-2 font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-[#151515] sm:text-5xl">
            See Daman as a set of gentle routes.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#5d5143]">
          Use this field map to build a loose route across beaches, forts, lanes, cafés, and food stops.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[34px] bg-[#EADDC8] shadow-[0_28px_90px_rgba(75,55,29,0.14)] ring-1 ring-white/70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,253,248,0.9),transparent_24%),radial-gradient(circle_at_80%_72%,rgba(30,78,140,0.2),transparent_26%),linear-gradient(135deg,#F5EFE6,#EADDC8)]" />
          <div className="absolute inset-x-8 top-1/2 h-20 -translate-y-1/2 rounded-full border-y border-[#1E4E8C]/18" />
          <div className="absolute left-[12%] top-[18%] h-[68%] w-[64%] rounded-[50%] border border-[#395B45]/18" />
          <div className="absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(21,21,21,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(21,21,21,.1)_1px,transparent_1px)] [background-size:26px_26px]" />

          {spots.length ? (
            spots.map((spot) => {
              const position = getPosition(spot);
              const isSelected = callout?.id === spot.id;

              return (
                <button
                  key={spot.id}
                  type="button"
                  aria-label={`Select ${spot.name}`}
                  onClick={() => onSelect(spot)}
                  className={`absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-[#FFFDF8] text-[#1E4E8C] shadow-[0_14px_32px_rgba(30,78,140,0.18)] transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99A3D] ${
                    isSelected ? "scale-110 ring-4 ring-[#D99A3D]/30" : ""
                  }`}
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  <MapPin className="h-5 w-5 fill-[#1E4E8C]/10" />
                </button>
              );
            })
          ) : (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div className="rounded-3xl bg-white/72 p-6 shadow-sm backdrop-blur">
                <p className="font-display text-3xl font-semibold text-[#151515]">No pins on this route yet.</p>
                <p className="mt-2 text-sm text-[#5d5143]">Clear the search or pick another category.</p>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-[30px] bg-[#FFFDF8] p-5 shadow-[0_22px_70px_rgba(75,55,29,0.11)] ring-1 ring-[#eadcc8]">
          {callout ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9E3F2F]">Selected field note</p>
              <h3 className="mt-3 font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-[#151515]">{callout.name}</h3>
              <p className="mt-3 text-sm font-bold text-[#1E4E8C]">{callout.area} · {callout.category}</p>
              <p className="mt-4 text-sm leading-6 text-[#5d5143]">{callout.description}</p>
              <button
                type="button"
                onClick={() => onSelect(callout)}
                className="mt-5 min-h-11 rounded-full bg-[#151515] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1E4E8C]"
              >
                Open field note
              </button>
            </>
          ) : (
            <p className="text-sm text-[#5d5143]">Search results will appear as pins here.</p>
          )}
        </aside>
      </div>
    </section>
  );
}

function getPosition(spot: Spot) {
  const x = ((spot.coordinates.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 72 + 14;
  const y = (1 - (spot.coordinates.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 72 + 14;

  return {
    x: Math.max(9, Math.min(91, x)),
    y: Math.max(10, Math.min(90, y)),
  };
}
