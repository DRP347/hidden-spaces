"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { MapHero } from "@/components/map/MapHero";
import type { ActiveCategory } from "@/components/site/CategoryRail";
import { FieldNotesSection } from "@/components/site/FieldNotesSection";
import { PlanningSection } from "@/components/site/PlanningSection";
import { RouteSection } from "@/components/site/RouteSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SpotDetailsModal } from "@/components/site/SpotDetailsModal";
import type { DataSource, MongoStatus } from "@/lib/mongodb";
import type { PublicDataNotice } from "@/lib/publicSpots";
import { getCategoryCounts } from "@/lib/site";
import type { Spot } from "@/types/spot";

type HomeDataStatus = {
  source: DataSource;
  count: number;
  dbStatus: MongoStatus;
  notice: PublicDataNotice | null;
};

export function HomeExperience({
  spots,
  dataStatus,
}: {
  spots: Spot[];
  dataStatus: HomeDataStatus;
}) {
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
    <main id="main-content" className="page-shell min-h-screen overflow-x-hidden bg-[#F5EFE6] text-[#151515]">
      <MapHero
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

      <DataSourceNotice dataStatus={dataStatus} />

      <FieldNotesSection
        spots={visibleSpots}
        query={query}
        activeCategory={activeCategory}
        counts={counts}
        onCategoryChange={setActiveCategory}
        onSelectSpot={openDetails}
        onSurprise={surpriseMe}
        onReset={() => {
          setQuery("");
          setActiveCategory("All");
        }}
      />

      <RouteSection />
      <PlanningSection />
      <SiteFooter />
      <SpotDetailsModal spot={detailSpot} onClose={() => setDetailSpot(null)} />
    </main>
  );
}

function DataSourceNotice({ dataStatus }: { dataStatus: HomeDataStatus }) {
  if (!dataStatus.notice) {
    return null;
  }

  const isWarning = dataStatus.notice.tone === "warning";

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div
        className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
          isWarning
            ? "border-amber-200 bg-amber-50 text-amber-900"
            : "border-[#D7E7DF] bg-[#F2F8F4] text-[#2c5f53]"
        }`}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold">{dataStatus.notice.title}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-75">
            {dataStatus.source} · {dataStatus.count} field notes
          </p>
        </div>
        <p className="mt-1 leading-6">{dataStatus.notice.message}</p>
      </div>
    </div>
  );
}
