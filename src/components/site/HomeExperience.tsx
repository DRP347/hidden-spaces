"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DamanMapHero } from "@/components/map/DamanMapHero";
import { CategoryRail, type ActiveCategory } from "@/components/site/CategoryRail";
import { Footer } from "@/components/site/Footer";
import { GoldenHourGuide } from "@/components/site/GoldenHourGuide";
import { RouteIdeas } from "@/components/site/RouteIdeas";
import { SpotCard } from "@/components/site/SpotCard";
import { SpotDetailsModal } from "@/components/site/SpotDetailsModal";
import { getCategoryCounts } from "@/lib/site";
import type { Spot } from "@/types/spot";

export function HomeExperience({ spots }: { spots: Spot[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("All");
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [detailSpot, setDetailSpot] = useState<Spot | null>(null);

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
  const visibleSpots = useMemo(
    () => (filteredSpots.length ? filteredSpots : hasActiveFilter ? [] : spots),
    [filteredSpots, hasActiveFilter, spots],
  );
  const mapSpots = useMemo(() => {
    if (!selectedSpot || visibleSpots.some((spot) => spot.id === selectedSpot.id)) {
      return visibleSpots;
    }

    return [...visibleSpots, selectedSpot];
  }, [selectedSpot, visibleSpots]);

  const selectSpot = useCallback((spot: Spot) => {
    setSelectedSpot(spot);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSpot(null);
  }, []);

  const openDetails = useCallback((spot: Spot) => {
    setSelectedSpot(spot);
    setDetailSpot(spot);
  }, []);

  const surpriseMe = useCallback(() => {
    const pool = filteredSpots.length ? filteredSpots : spots;
    const randomSpot = pool[Math.floor(Math.random() * pool.length)];

    if (randomSpot) {
      setSelectedSpot(randomSpot);
    }
  }, [filteredSpots, spots]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (detailSpot) {
        setDetailSpot(null);
        return;
      }

      setSelectedSpot(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailSpot]);

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden bg-[#F5EFE6] text-[#151515]">
      <DamanMapHero
        spots={mapSpots}
        selectedSpot={selectedSpot}
        query={query}
        activeCategory={activeCategory}
        counts={counts}
        onQueryChange={setQuery}
        onCategoryChange={setActiveCategory}
        onSelectSpot={selectSpot}
        onClearSelection={clearSelection}
        onViewDetails={openDetails}
        onSurprise={surpriseMe}
      />

      <section id="spots" className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 md:pt-12 lg:pb-14 lg:pt-14" aria-labelledby="spots-title">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9E3F2F]">
              Choose the kind of Daman you want today
            </p>
            <h2 id="spots-title" className="mt-2 max-w-2xl text-balance font-display text-[2.35rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#151515] sm:text-5xl">
              Quiet places that make Daman feel personal.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#5d5143]">
            Start with a mood, then let the route stay loose. Every card is designed to be useful before you leave.
          </p>
        </div>

        <CategoryRail activeCategory={activeCategory} counts={counts} onChange={setActiveCategory} />

        {visibleSpots.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleSpots.map((spot, index) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                priority={index < 3}
                onSelect={openDetails}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            query={query}
            onSurprise={surpriseMe}
            onReset={() => {
              setQuery("");
              setActiveCategory("All");
            }}
          />
        )}
      </section>

      <RouteIdeas />
      <GoldenHourGuide />
      <Footer />
      <SpotDetailsModal spot={detailSpot} onClose={() => setDetailSpot(null)} />
    </main>
  );
}

function EmptyState({
  query,
  onReset,
  onSurprise,
}: {
  query: string;
  onReset: () => void;
  onSurprise: () => void;
}) {
  return (
    <div className="mt-6 rounded-[30px] border border-[#eadcc8] bg-[#FFFDF8] p-8 text-center shadow-sm">
      <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#151515]">
        No exact match.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5d5143]">
        {query.trim()
          ? `No field notes matched “${query.trim()}”. Try sunset, cafés, beaches, fort walls, or hit Surprise Me.`
          : "Try another category, clear the filter, or hit Surprise Me to let the map choose a place."}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onSurprise}
          className="min-h-11 rounded-full bg-[#D99A3D] px-5 py-2 text-sm font-bold text-[#151515] transition hover:bg-[#e2a64a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]"
        >
          Surprise Me
        </button>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 rounded-full bg-[#151515] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#1E4E8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99A3D]"
        >
          Show all hidden spaces
        </button>
      </div>
    </div>
  );
}
