"use client";

import { Shuffle } from "lucide-react";

import { CategoryRail, type ActiveCategory } from "@/components/site/CategoryRail";
import { SpotCard } from "@/components/site/SpotCard";
import type { Spot } from "@/types/spot";

export function FieldNotesSection({
  spots,
  query,
  activeCategory,
  counts,
  onCategoryChange,
  onSelectSpot,
  onReset,
  onSurprise,
}: {
  spots: Spot[];
  query: string;
  activeCategory: ActiveCategory;
  counts: Record<string, number>;
  onCategoryChange: (category: ActiveCategory) => void;
  onSelectSpot: (spot: Spot) => void;
  onReset: () => void;
  onSurprise: () => void;
}) {
  return (
    <section
      id="spots"
      className="section-shell mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 md:pt-12 lg:pb-14 lg:pt-14"
      aria-labelledby="spots-title"
    >
      <div className="section-header mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#9E3F2F]">
            Choose the kind of Daman you want today
          </p>
          <h2
            id="spots-title"
            className="mt-2 max-w-2xl text-balance font-display text-[2.35rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#151515] sm:text-5xl"
          >
            Quiet places that make Daman feel personal.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#5d5143]">
          Start with a mood, then let the route stay loose. Every card is
          designed to be useful before you leave.
        </p>
      </div>

      <CategoryRail
        activeCategory={activeCategory}
        counts={counts}
        onChange={onCategoryChange}
      />

      {spots.length ? (
        <SpotGrid spots={spots} onSelectSpot={onSelectSpot} />
      ) : (
        <EmptyState query={query} onSurprise={onSurprise} onReset={onReset} />
      )}
    </section>
  );
}

function SpotGrid({
  spots,
  onSelectSpot,
}: {
  spots: Spot[];
  onSelectSpot: (spot: Spot) => void;
}) {
  return (
    <div className="spot-grid mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {spots.map((spot, index) => (
        <SpotCard
          key={spot.id}
          spot={spot}
          priority={index < 3}
          onSelect={onSelectSpot}
        />
      ))}
    </div>
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
    <div className="glass-panel mt-6 rounded-[30px] p-8 text-center">
      <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#151515]">
        No exact match.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5d5143]">
        {query.trim()
          ? `No field notes matched "${query.trim()}". Try sunset, cafes, beaches, fort walls, or hit Surprise Me.`
          : "Try another category, clear the filter, or hit Surprise Me to let the map choose a place."}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <button type="button" onClick={onSurprise} className="primary-button">
          <Shuffle className="h-4 w-4" />
          Surprise Me
        </button>
        <button type="button" onClick={onReset} className="secondary-button">
          Show all hidden spaces
        </button>
      </div>
    </div>
  );
}
