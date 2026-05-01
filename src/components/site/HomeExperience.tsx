"use client";

import { Search, Shuffle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CategoryRail, type ActiveCategory } from "@/components/site/CategoryRail";
import { Footer } from "@/components/site/Footer";
import { GoldenHourGuide } from "@/components/site/GoldenHourGuide";
import { LiveDamanBadge } from "@/components/site/LiveDamanBadge";
import { MapPreview } from "@/components/site/MapPreview";
import { SpotCard } from "@/components/site/SpotCard";
import { SpotDetailsModal } from "@/components/site/SpotDetailsModal";
import { getCategoryCounts } from "@/lib/site";
import type { Spot } from "@/types/spot";

export function HomeExperience({ spots }: { spots: Spot[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("All");
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const counts = useMemo(() => getCategoryCounts(spots), [spots]);
  const filteredSpots = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return spots.filter((spot) => {
      const categoryMatch = activeCategory === "All" || spot.category === activeCategory;
      const searchMatch =
        !normalized ||
        [
          spot.name,
          spot.area,
          spot.category,
          spot.description,
          spot.longDescription,
          spot.mood,
          ...spot.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, query, spots]);

  const hasActiveFilter = activeCategory !== "All" || query.trim().length > 0;
  const visibleSpots = filteredSpots.length ? filteredSpots : hasActiveFilter ? [] : spots;

  const surpriseMe = () => {
    const pool = filteredSpots.length ? filteredSpots : spots;
    const randomSpot = pool[Math.floor(Math.random() * pool.length)];

    if (randomSpot) setSelectedSpot(randomSpot);
  };

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden bg-[#F5EFE6] text-[#151515]">
      <Hero
        query={query}
        onQueryChange={setQuery}
        onSurprise={surpriseMe}
      />

      <section id="spots" className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:pb-14" aria-labelledby="spots-title">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9E3F2F]">Curated field notes</p>
            <h2 id="spots-title" className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-none tracking-[-0.045em] text-[#151515] sm:text-5xl">
              Quiet places that make Daman feel personal.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#5d5143]">
            Start with a mood, then let the route stay loose. Every card is designed to be useful before you leave.
          </p>
        </div>

        <CategoryRail activeCategory={activeCategory} counts={counts} onChange={setActiveCategory} />

        {visibleSpots.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSpots.map((spot, index) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                priority={index < 3}
                onSelect={setSelectedSpot}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            query={query}
            onReset={() => {
              setQuery("");
              setActiveCategory("All");
            }}
          />
        )}
      </section>

      <MapPreview
        spots={visibleSpots}
        selectedSpot={selectedSpot}
        onSelect={setSelectedSpot}
      />
      <GoldenHourGuide />
      <Footer />
      <SpotDetailsModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
    </main>
  );
}

function Hero({
  query,
  onQueryChange,
  onSurprise,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSurprise: () => void;
}) {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(255,253,248,0.96),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(217,154,61,0.22),transparent_26%),linear-gradient(135deg,#FFFDF8_0%,#F5EFE6_44%,#EADDC8_100%)]" />
      <div className="absolute right-[-12%] top-20 h-72 w-72 rounded-full bg-[#1E4E8C]/12 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F5EFE6] to-transparent" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(21,21,21,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(21,21,21,.1)_1px,transparent_1px)] [background-size:8px_8px]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:pb-16 lg:pb-20">
        <nav className="flex items-center justify-between gap-4" aria-label="Main navigation">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold">
            Skip to content
          </a>
          <Link href="/" className="group inline-flex items-center gap-3 rounded-full bg-[#FFFDF8]/78 px-3 py-2 shadow-sm ring-1 ring-white/70 backdrop-blur">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#151515] font-display text-lg font-semibold text-[#FFFDF8]">H</span>
            <span>
              <span className="block text-sm font-bold leading-none text-[#151515]">Hidden Spaces</span>
              <span className="mt-1 block text-xs font-semibold text-[#6b5b48]">Daman field guide</span>
            </span>
          </Link>
          <div className="hidden items-center gap-2 text-sm font-bold text-[#5d5143] sm:flex">
            <a className="rounded-full px-3 py-2 transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#spots">Spots</a>
            <a className="rounded-full px-3 py-2 transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#field-map">Map</a>
            <a className="rounded-full px-3 py-2 transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]" href="#plan">Plan</a>
          </div>
        </nav>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <LiveDamanBadge />
            <h1 id="hero-title" className="mt-6 max-w-4xl text-balance font-display text-[56px] font-semibold leading-[0.88] tracking-[-0.055em] text-[#151515] sm:text-[78px] lg:text-[92px]">
              Daman’s quieter side, mapped like a local field note.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#55493c]">
              Discover hidden beaches, Portuguese lanes, peaceful cafés, golden-hour corners, and food stops around Nani Daman and Moti Daman.
            </p>
            <div className="mt-7 rounded-[28px] bg-[#FFFDF8]/82 p-2 shadow-[0_24px_70px_rgba(75,55,29,0.13)] ring-1 ring-white/70 backdrop-blur">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <label className="relative block">
                  <span className="sr-only">Search hidden places in Daman</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9E3F2F]" />
                  <input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search beaches, lanes, cafés, sunset..."
                    className="min-h-14 w-full rounded-[22px] border border-transparent bg-white px-12 text-base font-semibold text-[#151515] outline-none transition placeholder:text-[#8b7c68] focus:border-[#1E4E8C] focus:ring-4 focus:ring-[#1E4E8C]/10"
                  />
                </label>
                <button
                  type="button"
                  onClick={onSurprise}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[22px] bg-[#D99A3D] px-5 text-sm font-bold text-[#151515] shadow-[0_16px_34px_rgba(217,154,61,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e2a64a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98]"
                >
                  <Shuffle className="h-4 w-4" />
                  Surprise Me
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#675844]">
              Independent local-style guide · 10 curated notes · no backend wait on first load
            </p>
          </div>

          <aside className="rounded-[36px] bg-[#151515] p-5 text-[#FFFDF8] shadow-[0_30px_100px_rgba(21,21,21,0.22)]">
            <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(217,154,61,.9),rgba(30,78,140,.52)),url('https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=82')] bg-cover bg-center p-5">
              <div className="min-h-[300px] rounded-[24px] border border-white/22 bg-black/18 p-5 backdrop-blur-[2px]">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/80">Today’s mood</p>
                <h2 className="mt-20 font-display text-5xl font-semibold leading-none tracking-[-0.05em]">
                  Fort walls, chai, then the river light.
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/78">
                  A gentle route for visitors who want Daman without the rush.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function EmptyState({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <div className="mt-6 rounded-[30px] border border-[#eadcc8] bg-[#FFFDF8] p-8 text-center shadow-sm">
      <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#151515]">
        Nothing quiet matched that route.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5d5143]">
        {query.trim()
          ? `No field notes matched “${query.trim()}”. Try “sunset”, “fort”, “food”, or clear the filter.`
          : "Try another category or clear the current filter to see the full Daman guide again."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 min-h-11 rounded-full bg-[#151515] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#1E4E8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99A3D]"
      >
        Show all hidden spaces
      </button>
    </div>
  );
}
