"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Shuffle } from "lucide-react";

import { CategoryRail, type ActiveCategory } from "@/components/site/CategoryRail";
import { SpotCard } from "@/components/site/SpotCard";
import { SpotDetailsModal } from "@/components/site/SpotDetailsModal";
import { getCategoryCounts } from "@/lib/site";
import type { Spot } from "@/types/spot";

export function SpotsDirectory({ spots }: { spots: Spot[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("All");
  const [detailSpot, setDetailSpot] = useState<Spot | null>(null);
  const counts = useMemo(() => getCategoryCounts(spots), [spots]);

  useEffect(() => {
    if (activeCategory !== "All" && (counts[activeCategory] ?? 0) === 0) {
      setActiveCategory("All");
    }
  }, [activeCategory, counts]);

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

  function showRandomSpot() {
    const pool = filteredSpots.length ? filteredSpots : spots;
    const randomSpot = pool[Math.floor(Math.random() * pool.length)];

    if (randomSpot) {
      setDetailSpot(randomSpot);
    }
  }

  function resetFilters() {
    setQuery("");
    setActiveCategory("All");
  }

  return (
    <main id="main-content" className="page-shell min-h-screen overflow-x-hidden bg-[#F5EFE6] text-[#151515]">
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
        <Link href="/" className="secondary-button w-fit bg-white/60 px-4 text-[#5d5143]">
          <ArrowLeft className="h-4 w-4" />
          Back to map
        </Link>

        <div className="mt-6 rounded-[30px] bg-[#FFFDF8] p-5 shadow-[0_20px_70px_rgba(75,55,29,0.09)] ring-1 ring-[#eadcc8] sm:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="inline-flex rounded-full bg-[#EFE5D5] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#9E3F2F]">
                All field notes
              </p>
              <h1 className="mt-3 max-w-3xl text-balance font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                {spots.length} quiet places around Daman
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5d5143] sm:text-base">
                Search the full public guide, filter by mood, and open directions when a place feels right.
              </p>
            </div>

            <button type="button" onClick={showRandomSpot} className="primary-button w-full sm:w-fit">
              <Shuffle className="h-4 w-4" />
              Surprise Me
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="relative block">
              <span className="sr-only">Search all hidden places</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5f5345]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search beaches, sunrise, fort walls..."
                className="min-h-14 w-full rounded-full border border-[#eadcc8] bg-white/78 px-12 text-[15px] font-medium text-[#151515] outline-none transition placeholder:text-[#8b7c68] focus:border-[#1E4E8C] focus:bg-white focus:ring-4 focus:ring-[#1E4E8C]/10"
              />
            </label>
            <CategoryRail activeCategory={activeCategory} counts={counts} onChange={setActiveCategory} />
          </div>
        </div>

        {filteredSpots.length ? (
          <div className="spot-grid mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSpots.map((spot, index) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                priority={index < 3}
                onSelect={setDetailSpot}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel mt-6 rounded-[30px] p-8 text-center">
            <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#151515]">
              No exact match.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5d5143]">
              Try another search, clear the filters, or let Surprise Me choose from the full guide.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" onClick={showRandomSpot} className="primary-button">
                <Shuffle className="h-4 w-4" />
                Surprise Me
              </button>
              <button type="button" onClick={resetFilters} className="secondary-button">
                Show all spots
              </button>
            </div>
          </div>
        )}
      </section>
      <SpotDetailsModal spot={detailSpot} onClose={() => setDetailSpot(null)} />
    </main>
  );
}
