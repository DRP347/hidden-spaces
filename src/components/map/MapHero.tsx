"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Compass,
  Search,
  Shuffle,
} from "lucide-react";

import { MapFallback } from "@/components/map/MapFallback";
import { SpotPreview } from "@/components/map/SpotPreview";
import type { ActiveCategory } from "@/components/site/CategoryRail";
import { LiveTimeBadge } from "@/components/site/LiveTimeBadge";
import type { Spot } from "@/types/spot";

const HeroMap = dynamic(
  () => import("@/components/map/HeroMap").then((module) => module.HeroMap),
  {
    ssr: false,
    loading: () => <MapFallback />,
  },
);

const HERO_FILTERS: ActiveCategory[] = ["All", "Sunset", "Heritage", "Beaches", "Peaceful"];

type MapHeroProps = {
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
};

export function MapHero({
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
}: MapHeroProps) {
  const heroCategories = HERO_FILTERS.filter(
    (category) => category === "All" || (counts[category] ?? 0) > 0,
  );
  const fieldNoteCount = counts.All ?? spots.length;
  const areaSummary = formatAreaSummary(spots);

  return (
    <section className="map-hero relative h-[100svh] min-h-[660px] sm:min-h-[720px] lg:min-h-[760px]" aria-labelledby="hero-title">
      <HeroMap
        spots={spots}
        selectedSpot={selectedSpot}
        onSelect={onSelectSpot}
        onClearSelection={onClearSelection}
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(188,218,224,0.52)_0%,rgba(255,253,248,0.20)_32%,rgba(255,253,248,0.10)_68%,rgba(255,253,248,0.48)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,253,248,0.42),transparent_22%,transparent_68%,#F6EFE4_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 opacity-70 [background-image:radial-gradient(circle_at_17%_18%,rgba(217,154,61,0.14),transparent_26%),radial-gradient(circle_at_84%_26%,rgba(79,143,168,0.12),transparent_24%)]" />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold">
        Skip to content
      </a>

      <HeroNav />
      <HeroStatusBar fieldNoteCount={fieldNoteCount} areaSummary={areaSummary} />

      <div className="pointer-events-none absolute inset-x-0 top-[160px] z-20 hidden px-5 lg:block xl:top-[176px]">
        <div className="mx-auto flex max-w-7xl items-start">
          <HeroDock
            query={query}
            activeCategory={activeCategory}
            categories={heroCategories}
            onQueryChange={onQueryChange}
            onCategoryChange={onCategoryChange}
            onSurprise={onSurprise}
          />
        </div>
      </div>

      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-5 sm:pb-6 lg:hidden ${selectedSpot ? "hidden md:block lg:hidden" : ""}`}>
        <div className="mx-auto w-full min-w-0 max-w-xl">
          <HeroDock
            query={query}
            activeCategory={activeCategory}
            categories={heroCategories}
            onQueryChange={onQueryChange}
            onCategoryChange={onCategoryChange}
            onSurprise={onSurprise}
          />
        </div>
      </div>

      <SpotPreview
        spot={selectedSpot}
        onClose={onClearSelection}
        onViewDetails={onViewDetails}
      />
    </section>
  );
}

function HeroNav() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-3 pt-3 sm:px-5 sm:pt-5">
      <nav className="hero-nav glass-panel pointer-events-auto mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center justify-between gap-2 rounded-[26px] px-3 py-2 sm:w-full sm:max-w-7xl sm:rounded-full sm:px-4" aria-label="Main navigation">
        <Link href="/" className="group inline-flex min-h-11 min-w-0 items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] sm:gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#151515] font-display text-2xl font-semibold leading-none text-[#FFFDF8] shadow-[0_10px_28px_rgba(21,21,21,0.18)] ring-1 ring-white/20 sm:h-12 sm:w-12 sm:text-3xl">H</span>
          <span className="min-w-0">
            <span className="block truncate font-display text-[1.08rem] font-semibold leading-none tracking-[-0.035em] text-[#151515] sm:text-[1.38rem]">
              Hidden Spaces Daman
            </span>
            <span className="mt-1 hidden truncate text-[9px] font-bold uppercase tracking-[0.18em] text-[#6b5b48] min-[390px]:block sm:text-[11px]">
              Quiet coastal field guide
            </span>
          </span>
        </Link>
        <div className="hero-nav-links hidden items-center gap-1 rounded-full border border-white/70 bg-white/44 p-1 text-sm font-semibold text-[#473b2e] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl sm:flex">
          <a className="hero-nav-link hero-nav-link-active" href="#spots">Spots</a>
          <a className="hero-nav-link" href="#routes">Routes</a>
          <a className="hero-nav-link" href="#plan">Plan</a>
        </div>
      </nav>
    </div>
  );
}

function HeroStatusBar({
  fieldNoteCount,
  areaSummary,
}: {
  fieldNoteCount: number;
  areaSummary: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[76px] z-20 px-3 sm:top-[88px] sm:px-5 lg:top-[104px]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="pointer-events-auto w-fit">
          <LiveTimeBadge />
        </div>
        <FieldNotesBadge count={fieldNoteCount} areaSummary={areaSummary} />
      </div>
    </div>
  );
}

function FieldNotesBadge({ count, areaSummary }: { count: number; areaSummary: string }) {
  return (
    <div className="glass-pill pointer-events-auto hidden min-h-11 items-center px-4 py-2 text-xs font-semibold text-[#5d5143] md:inline-flex">
      <span className="lg:hidden">{count} field notes</span>
      <span className="hidden lg:inline">
        {count} field notes across {areaSummary}
      </span>
    </div>
  );
}

function HeroDock({
  query,
  activeCategory,
  categories,
  onQueryChange,
  onCategoryChange,
  onSurprise,
}: {
  query: string;
  activeCategory: ActiveCategory;
  categories: ActiveCategory[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (category: ActiveCategory) => void;
  onSurprise: () => void;
}) {
  return (
    <aside className="hero-dock glass-dock pointer-events-auto w-full min-w-0 max-w-[360px] overflow-hidden rounded-[24px] px-4 py-4 sm:max-w-[min(100%,560px)] sm:rounded-[28px] sm:px-5 sm:py-5 lg:w-[360px] lg:max-w-[30vw] lg:rounded-[28px] lg:px-5 lg:py-5 xl:w-[380px]" aria-label="Hidden Spaces Daman discovery controls">
      <p className="glass-pill mb-3 inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-[#9E3F2F] sm:text-xs">
        <Compass className="h-3.5 w-3.5" />
        Live field map
      </p>
      <h1 id="hero-title" className="max-w-full font-display text-[clamp(2rem,7.8vw,2.7rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[#151515] sm:text-[clamp(2.65rem,5.8vw,3.55rem)] lg:text-[clamp(2.7rem,3.55vw,4rem)] lg:leading-[1]">
        <span className="block whitespace-nowrap">Find the quiet</span>
        <span className="block whitespace-nowrap">side of Daman.</span>
      </h1>
      <p className="mt-3 hidden max-w-[26rem] text-pretty text-[15px] leading-[1.6] text-[#55493c] min-[390px]:block sm:mt-4 sm:text-base">
        A simple field map for beaches, old lanes, cafés, sunset corners, and photo walks.
      </p>

      <HeroSearch query={query} onQueryChange={onQueryChange} onSurprise={onSurprise} />
      <HeroFilters
        activeCategory={activeCategory}
        categories={categories}
        onCategoryChange={onCategoryChange}
      />
    </aside>
  );
}

function HeroSearch({
  query,
  onQueryChange,
  onSurprise,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSurprise: () => void;
}) {
  return (
    <div className="hero-search mt-4 grid min-w-0 gap-2.5 sm:mt-5">
      <label className="relative block min-w-0">
        <span className="sr-only">Search hidden places in Daman</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#5f5345] sm:left-4 sm:h-5 sm:w-5" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search spots, cafés, beaches..."
          className="min-h-12 w-full rounded-full border border-white/70 bg-white/70 px-11 text-[14px] font-medium text-[#151515] outline-none transition placeholder:text-[#8b7c68] focus:border-[#1E4E8C] focus:bg-white/86 focus:ring-4 focus:ring-[#1E4E8C]/10 sm:min-h-14 sm:px-12 sm:text-[15px]"
        />
      </label>
      <button
        type="button"
        onClick={onSurprise}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D99A3D] px-5 text-sm font-bold text-white shadow-[0_16px_34px_rgba(217,154,61,0.32)] transition hover:-translate-y-0.5 hover:bg-[#E4A346] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98] sm:min-h-14"
      >
        <Shuffle className="h-4 w-4" />
        Surprise Me
      </button>
    </div>
  );
}

function HeroFilters({
  activeCategory,
  categories,
  onCategoryChange,
}: {
  activeCategory: ActiveCategory;
  categories: ActiveCategory[];
  onCategoryChange: (category: ActiveCategory) => void;
}) {
  return (
    <div className="hero-filters mt-3 flex min-w-0 flex-wrap gap-2" aria-label="Filter map spots by category">
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            aria-pressed={isActive}
            className={`glass-chip min-h-10 min-w-0 whitespace-nowrap px-3 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98] sm:min-h-11 sm:px-3.5 sm:text-sm ${
              isActive
                ? "glass-chip-active"
                : "text-[#473b2e] hover:-translate-y-0.5 hover:bg-white/76"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

function formatAreaSummary(spots: Spot[]) {
  const areas = Array.from(new Set(spots.map((spot) => spot.area).filter(Boolean))).slice(0, 4);

  if (!areas.length) {
    return "Daman";
  }

  if (areas.length === 1) {
    return areas[0];
  }

  if (areas.length === 2) {
    return `${areas[0]} and ${areas[1]}`;
  }

  return `${areas.slice(0, -1).join(", ")} and ${areas[areas.length - 1]}`;
}
