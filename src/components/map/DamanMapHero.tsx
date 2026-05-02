"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown, Compass, Search, Shuffle } from "lucide-react";

import { MapFallback } from "@/components/map/MapFallback";
import { MapSpotPreview } from "@/components/map/MapSpotPreview";
import { LiveDamanBadge } from "@/components/site/LiveDamanBadge";
import type { ActiveCategory } from "@/components/site/CategoryRail";
import { spotCategories } from "@/types/spot";
import type { Spot } from "@/types/spot";

const SpotLeafletMap = dynamic(
  () => import("@/components/map/SpotLeafletMap").then((module) => module.SpotLeafletMap),
  {
    ssr: false,
    loading: () => <MapFallback />,
  },
);

export function DamanMapHero({
  spots,
  selectedSpot,
  query,
  activeCategory,
  counts,
  onQueryChange,
  onCategoryChange,
  onSelectSpot,
  onClearSelection,
  onViewDetails,
  onSurprise,
}: {
  spots: Spot[];
  selectedSpot: Spot | null;
  query: string;
  activeCategory: ActiveCategory;
  counts: Record<string, number>;
  onQueryChange: (value: string) => void;
  onCategoryChange: (category: ActiveCategory) => void;
  onSelectSpot: (spot: Spot) => void;
  onClearSelection: () => void;
  onViewDetails: (spot: Spot) => void;
  onSurprise: () => void;
}) {
  const categories: ActiveCategory[] = ["All", ...spotCategories];

  return (
    <section className="map-frame relative h-[100svh] min-h-[640px] lg:min-h-[720px]" aria-labelledby="hero-title">
      <SpotLeafletMap
        spots={spots}
        selectedSpot={selectedSpot}
        onSelect={onSelectSpot}
        onClearSelection={onClearSelection}
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,253,248,0.34),transparent_24%,transparent_66%,rgba(245,239,230,0.48))]" />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold">
        Skip to content
      </a>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-3 pt-3 sm:px-5 sm:pt-5">
        <nav className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[24px] border border-white/65 bg-[#FFFDF8]/70 px-3 py-2 shadow-[0_18px_60px_rgba(22,32,42,0.13)] backdrop-blur-2xl sm:rounded-full sm:px-4" aria-label="Main navigation">
          <Link href="/" className="group inline-flex min-h-11 items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#151515] font-display text-xl font-semibold text-[#FFFDF8] shadow-sm">H</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold leading-none tracking-[-0.02em] text-[#151515] sm:text-base">
                Hidden Spaces Daman
              </span>
              <span className="mt-1 block truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b5b48]">
                Quiet coastal field guide
              </span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 text-sm font-bold text-[#5d5143] sm:flex">
            <a className="rounded-full px-3 py-2 transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#spots">Spots</a>
            <a className="rounded-full px-3 py-2 transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#routes">Routes</a>
            <a className="rounded-full px-3 py-2 transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#plan">Plan</a>
          </div>
        </nav>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[88px] z-20 px-3 sm:px-5 lg:top-[104px]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="pointer-events-auto w-fit">
            <LiveDamanBadge />
          </div>
          <div className="pointer-events-auto hidden rounded-full border border-white/65 bg-[#FFFDF8]/68 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-[#5d5143] shadow-[0_18px_54px_rgba(22,32,42,0.12)] backdrop-blur-2xl md:inline-flex">
            10 field notes across Nani Daman, Moti Daman, Devka and Jampore
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-4 sm:px-5 sm:pb-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,720px)_1fr] lg:items-end">
          <div className="pointer-events-auto rounded-[32px] border border-white/70 bg-[#FFFDF8]/70 p-4 shadow-[0_26px_90px_rgba(22,32,42,0.16)] backdrop-blur-2xl sm:p-5 lg:p-6">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#9E3F2F] ring-1 ring-white/70">
              <Compass className="h-3.5 w-3.5" />
              Live field map
            </p>
            <h1 id="hero-title" className="max-w-3xl text-balance font-display text-[44px] font-semibold leading-[0.92] tracking-[-0.055em] text-[#151515] sm:text-[68px] lg:text-[82px]">
              Open the map. Find the quiet side.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#55493c] sm:text-lg sm:leading-8">
              A local field map for quiet beaches, Portuguese lanes, cafés, sunset corners, food stops, and photo walks around Nani Daman and Moti Daman.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
              <label className="relative block">
                <span className="sr-only">Search hidden places in Daman</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9E3F2F]" />
                <input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Search sunset, cafés, fort walls, beaches..."
                  className="min-h-14 w-full rounded-[22px] border border-white/70 bg-white/78 px-12 text-base font-semibold text-[#151515] outline-none transition placeholder:text-[#8b7c68] focus:border-[#1E4E8C] focus:ring-4 focus:ring-[#1E4E8C]/10"
                />
              </label>
              <button
                type="button"
                onClick={onSurprise}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[22px] bg-[#D99A3D] px-5 text-sm font-extrabold text-[#151515] shadow-[0_16px_34px_rgba(217,154,61,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e2a64a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98]"
              >
                <Shuffle className="h-4 w-4" />
                Surprise Me
              </button>
            </div>

            <div className="-mx-1 mt-4 overflow-x-auto px-1 hide-scrollbar" aria-label="Filter map spots by category">
              <div className="flex min-w-max gap-2 py-1">
                {categories.map((category) => {
                  const isActive = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => onCategoryChange(category)}
                      aria-pressed={isActive}
                      className={`min-h-11 rounded-full border px-4 py-2 text-sm font-bold shadow-sm backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98] ${
                        isActive
                          ? "border-[#D99A3D]/70 bg-[#151515] text-[#FFFDF8] shadow-[0_16px_38px_rgba(21,21,21,0.18)]"
                          : "border-white/72 bg-white/54 text-[#473b2e] hover:-translate-y-0.5 hover:bg-white/80"
                      }`}
                    >
                      {category}
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white/14 text-white" : "bg-[#F5EFE6]/86 text-[#756651]"}`}>
                        {counts[category] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <a
              href="#spots"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/65 bg-[#FFFDF8]/68 px-4 py-3 text-sm font-extrabold text-[#25313D] shadow-[0_18px_54px_rgba(22,32,42,0.12)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/82 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]"
            >
              Field notes below
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </a>
          </div>
        </div>
      </div>

      <MapSpotPreview
        spot={selectedSpot}
        onClose={onClearSelection}
        onViewDetails={onViewDetails}
      />
    </section>
  );
}
