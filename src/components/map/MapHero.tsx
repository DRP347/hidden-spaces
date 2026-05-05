"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown, Compass, Search, Shuffle } from "lucide-react";

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

const HERO_FILTERS: ActiveCategory[] = ["All", "Sunset", "Peaceful", "Heritage", "Beaches"];

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

  return (
    <section className="map-hero relative h-[100svh] min-h-[620px] sm:min-h-[680px] lg:min-h-[720px]" aria-labelledby="hero-title">
      <HeroMap
        spots={spots}
        selectedSpot={selectedSpot}
        onSelect={onSelectSpot}
        onClearSelection={onClearSelection}
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,253,248,0.34),transparent_24%,transparent_66%,rgba(245,239,230,0.48))]" />
      <div className="pointer-events-none absolute inset-0 z-10 opacity-80 [background-image:radial-gradient(circle_at_18%_18%,rgba(217,154,61,0.18),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(79,143,168,0.16),transparent_26%),radial-gradient(circle_at_72%_84%,rgba(158,63,47,0.12),transparent_24%)]" />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold">
        Skip to content
      </a>

      <HeroNav />
      <HeroStatusBar fieldNoteCount={counts.All ?? spots.length} />

      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-5 sm:pb-6 ${selectedSpot ? "hidden md:block" : ""}`}>
        <div className="mx-auto grid w-full min-w-0 max-w-7xl gap-3 lg:grid-cols-[minmax(380px,40vw)_1fr] lg:items-end xl:grid-cols-[minmax(420px,500px)_1fr]">
          <HeroDock
            query={query}
            activeCategory={activeCategory}
            counts={counts}
            categories={heroCategories}
            onQueryChange={onQueryChange}
            onCategoryChange={onCategoryChange}
            onSurprise={onSurprise}
          />

          <div className="hidden justify-end lg:flex">
            <a
              href="#spots"
              className="glass-button pointer-events-auto inline-flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#25313D] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]"
            >
              Field notes below
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </a>
          </div>
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
      <nav className="hero-nav glass-panel pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-[22px] px-3 py-2 sm:rounded-full sm:px-4" aria-label="Main navigation">
        <Link href="/" className="group inline-flex min-h-11 min-w-0 items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] sm:gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#151515] font-display text-lg font-semibold text-[#FFFDF8] shadow-sm sm:h-10 sm:w-10 sm:text-xl">H</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-none tracking-[-0.01em] text-[#151515] sm:text-base">
              Hidden Spaces Daman
            </span>
            <span className="mt-1 hidden truncate text-[10px] font-semibold uppercase tracking-[0.11em] text-[#6b5b48] min-[390px]:block sm:text-[11px]">
              Quiet coastal field guide
            </span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 text-sm font-semibold text-[#5d5143] sm:flex">
          <a className="rounded-full px-3 py-2 transition hover:bg-white/58 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#spots">Spots</a>
          <a className="rounded-full px-3 py-2 transition hover:bg-white/58 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#routes">Routes</a>
          <a className="rounded-full px-3 py-2 transition hover:bg-white/58 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#plan">Plan</a>
        </div>
      </nav>
    </div>
  );
}

function HeroStatusBar({ fieldNoteCount }: { fieldNoteCount: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[76px] z-20 px-3 sm:top-[88px] sm:px-5 lg:top-[104px]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="pointer-events-auto w-fit">
          <LiveTimeBadge />
        </div>
        <FieldNotesBadge count={fieldNoteCount} />
      </div>
    </div>
  );
}

function FieldNotesBadge({ count }: { count: number }) {
  return (
    <div className="glass-pill pointer-events-auto hidden px-4 py-2 text-xs font-semibold uppercase tracking-[0.11em] text-[#5d5143] md:inline-flex">
      <span className="lg:hidden">{count} field notes</span>
      <span className="hidden lg:inline">
        {count} field notes across Nani Daman, Moti Daman, Devka and Jampore
      </span>
    </div>
  );
}

function HeroDock({
  query,
  activeCategory,
  counts,
  categories,
  onQueryChange,
  onCategoryChange,
  onSurprise,
}: {
  query: string;
  activeCategory: ActiveCategory;
  counts: Record<string, number>;
  categories: ActiveCategory[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (category: ActiveCategory) => void;
  onSurprise: () => void;
}) {
  return (
    <aside className="hero-dock glass-dock pointer-events-auto w-full min-w-0 max-w-[336px] overflow-hidden rounded-[24px] px-3.5 py-4 sm:max-w-[min(100%,560px)] sm:rounded-[30px] sm:px-5 sm:py-5 lg:max-w-none lg:rounded-[32px] lg:px-6 lg:py-6" aria-label="Hidden Spaces Daman discovery controls">
      <p className="glass-pill mb-2 inline-flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#9E3F2F] sm:mb-3 sm:text-xs">
        <Compass className="h-3.5 w-3.5" />
        Live field map
      </p>
      <h1 id="hero-title" className="max-w-full font-display text-[clamp(2.4rem,10vw,3.25rem)] font-semibold leading-[0.98] tracking-[-0.052em] text-[#151515] sm:text-[clamp(3.2rem,7vw,4.6rem)] lg:text-[clamp(4rem,5.8vw,5.8rem)] lg:leading-[0.94] lg:tracking-[-0.055em]">
        <span className="block whitespace-nowrap">Find the quiet</span>
        <span className="block whitespace-nowrap">side of Daman.</span>
      </h1>
      <p className="mt-3 hidden max-w-[32rem] text-pretty text-[0.95rem] leading-[1.6] text-[#55493c] min-[390px]:block sm:mt-4 sm:text-[1.05rem] lg:text-[1.1rem]">
        A live field map for beaches, old lanes, cafés, sunset corners, and photo walks.
      </p>

      <HeroSearch query={query} onQueryChange={onQueryChange} onSurprise={onSurprise} />
      <HeroFilters
        activeCategory={activeCategory}
        categories={categories}
        counts={counts}
        onCategoryChange={onCategoryChange}
      />

      <a
        href="#spots"
        className="glass-button ml-9 mt-3 inline-flex min-h-10 items-center gap-2 px-3.5 text-xs font-bold text-[#25313D] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] sm:ml-0 lg:hidden"
      >
        Field notes below
        <ChevronDown className="h-4 w-4" />
      </a>
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
    <div className="hero-search mt-4 grid min-w-0 gap-2 sm:mt-5 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto]">
      <label className="relative block min-w-0">
        <span className="sr-only">Search hidden places in Daman</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9E3F2F] sm:left-4 sm:h-5 sm:w-5" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search beaches, cafés, lanes..."
          className="min-h-12 w-full rounded-[18px] border border-white/70 bg-white/70 px-11 text-[15px] font-medium text-[#151515] outline-none transition placeholder:text-[#8b7c68] focus:border-[#1E4E8C] focus:bg-white/82 focus:ring-4 focus:ring-[#1E4E8C]/10 sm:min-h-14 sm:rounded-[22px] sm:px-12 sm:text-base"
        />
      </label>
      <button
        type="button"
        onClick={onSurprise}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[#D99A3D] px-5 text-sm font-bold text-[#151515] shadow-[0_14px_30px_rgba(217,154,61,0.26)] transition hover:-translate-y-0.5 hover:bg-[#e2a64a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98] sm:min-h-14 sm:rounded-[22px]"
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
  counts,
  onCategoryChange,
}: {
  activeCategory: ActiveCategory;
  categories: ActiveCategory[];
  counts: Record<string, number>;
  onCategoryChange: (category: ActiveCategory) => void;
}) {
  return (
    <div className="hero-filters mt-3 grid min-w-0 grid-cols-2 gap-2 min-[430px]:grid-cols-4 sm:flex sm:flex-wrap" aria-label="Filter map spots by category">
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
            <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] ${isActive ? "bg-white/14 text-white" : "bg-[#F5EFE6]/72 text-[#756651]"}`}>
              {counts[category] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
