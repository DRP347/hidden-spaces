"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { MapHero } from "@/components/map/MapHero";
import type { ActiveCategory } from "@/components/site/CategoryRail";
import { FieldNotesSection } from "@/components/site/FieldNotesSection";
import { PlanningSection } from "@/components/site/PlanningSection";
import { RouteSection } from "@/components/site/RouteSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SpotDetailsModal } from "@/components/site/SpotDetailsModal";
import { getCategoryCounts } from "@/lib/site";
import type { Spot } from "@/types/spot";

export function HomeExperience({
  spots,
}: {
  spots: Spot[];
  dataStatus: unknown;
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
