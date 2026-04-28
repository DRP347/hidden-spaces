"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { AddPlaceModal } from "@/components/ui/AddPlaceModal";
import { FilterChips } from "@/components/ui/FilterChips";
import { GlassBrandCapsule } from "@/components/ui/GlassBrandCapsule";
import { MoodChip } from "@/components/ui/MoodChip";
import { PlaceBottomSheet } from "@/components/ui/PlaceBottomSheet";
import { PlaceDetailDrawer } from "@/components/ui/PlaceDetailDrawer";
import { PlaceStack } from "@/components/ui/PlaceStack";
import { SearchCapsule } from "@/components/ui/SearchCapsule";
import { debugPlaces, getValidPlaces } from "@/lib/placeValidation";
import { mapsUrl, slugify } from "@/lib/placeUtils";
import type { NewPlaceDraft, Place, PlaceCategory } from "@/types/placeTypes";

const MapView = dynamic(
  () => import("@/components/map/MapView").then((module) => module.MapView),
  {
    ssr: false,
    loading: () => <MapLoadingState />,
  },
);

const uniquePlaces = (items: Place[]) => {
  const seen = new Set<string>();
  return items.filter((place) => {
    if (seen.has(place.id)) {
      return false;
    }

    seen.add(place.id);
    return true;
  });
};

export function HiddenSpacesApp() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | null>(
    null,
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    debugPlaces(places);
  }, [places]);

  useEffect(() => {
    let ignore = false;

    async function loadPlaces() {
      try {
        const response = await fetch("/api/places", { cache: "no-store" });
        const data = (await response.json()) as { data?: Place[]; places?: Place[] };
        const nextPlaces = data.data ?? data.places ?? [];

        if (!ignore && Array.isArray(nextPlaces)) {
          setPlaces(nextPlaces);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Hidden Spaces] Unable to load places:", error);
        }
      }
    }

    loadPlaces();
    return () => {
      ignore = true;
    };
  }, []);

  const validPlaces = useMemo(() => getValidPlaces(places), [places]);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return validPlaces.filter((place) => {
      const categoryMatch = activeCategory
        ? place.category === activeCategory
        : true;
      const queryMatch =
        normalizedQuery.length === 0 ||
        [place.name, place.category, place.description, ...place.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query, validPlaces]);

  useEffect(() => {
    if (
      selectedPlace &&
      !filteredPlaces.some((place) => place.id === selectedPlace.id)
    ) {
      setSelectedPlace(null);
      setIsDetailOpen(false);
    }
  }, [filteredPlaces, selectedPlace]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setSelectedPlace(null);
      setIsDetailOpen(false);
      setIsAddOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const nearbyPlaces = useMemo(() => {
    if (!selectedPlace) {
      return uniquePlaces(filteredPlaces).slice(0, 4);
    }

    const linked = selectedPlace.nearbySlugs
      .map((slug) => validPlaces.find((place) => place.slug === slug))
      .filter((place): place is Place => Boolean(place));
    const excludedIds = new Set([
      selectedPlace.id,
      ...linked.map((place) => place.id),
    ]);

    const fallback = validPlaces
      .filter((place) => !excludedIds.has(place.id))
      .slice(0, 4 - linked.length);

    return uniquePlaces([...linked, ...fallback]).slice(0, 4);
  }, [filteredPlaces, selectedPlace, validPlaces]);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedPlace(null);
    setIsDetailOpen(false);
  };

  const handleSelectNearbyPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailOpen(true);
  };

  const handleToggleSave = (place: Place) => {
    setSavedIds((current) =>
      current.includes(place.id)
        ? current.filter((id) => id !== place.id)
        : [...current, place.id],
    );
  };

  const handleAddPlace = (draft: NewPlaceDraft) => {
    const [lat, lng] = draft.coordinates
      .split(",")
      .map((part) => Number(part.trim()));
    const id = `hsd-${Date.now()}`;
    const placeSlug = slugify(draft.name);
    const safeImageUrl =
      draft.imageUrl.trim() ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=900&q=82";

    const nextPlace: Place = {
      id,
      slug: placeSlug || id,
      name: draft.name.trim(),
      category: draft.category,
      coordinates: { lat, lng },
      description: draft.description.trim(),
      coverImage: {
        url: safeImageUrl,
        publicId: `hidden-spaces-daman/${placeSlug || id}/cover`,
        alt: `${draft.name.trim()} cover view in Daman`,
        width: 1200,
        height: 900,
      },
      image: {
        url: safeImageUrl,
        publicId: `hidden-spaces-daman/${placeSlug || id}`,
        alt: `${draft.name.trim()} in Daman`,
        width: 1200,
        height: 900,
      },
      gallery: [
        {
          url: safeImageUrl,
          publicId: `hidden-spaces-daman/${placeSlug || id}/primary`,
          alt: `${draft.name.trim()} primary view`,
          width: 1200,
          height: 900,
        },
        {
          url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&h=900&q=82",
          publicId: `hidden-spaces-daman/${placeSlug || id}/coastal-context`,
          alt: `${draft.name.trim()} coastal context`,
          width: 1200,
          height: 900,
        },
        {
          url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&h=900&q=82",
          publicId: `hidden-spaces-daman/${placeSlug || id}/local-texture`,
          alt: `${draft.name.trim()} local texture`,
          width: 1200,
          height: 900,
        },
      ],
      tags: [draft.category.toLowerCase(), draft.visibility.toLowerCase()],
      bestTime: draft.bestTime.trim(),
      crowdLevel: draft.crowdLevel,
      safetyLevel: draft.safetyLevel,
      parking: draft.parking ? "Parking is available nearby." : "No reliable parking nearby.",
      visibility: draft.visibility,
      notes: draft.notes.trim(),
      nearbySlugs: [],
    };

    setPlaces((current) => [nextPlace, ...current]);
    setSelectedPlace(nextPlace);
    setActiveCategory(null);
    setQuery("");
    setIsAddOpen(false);
  };

  return (
    <main className="map-frame h-[100dvh] w-full text-ink">
      <MapView
        places={filteredPlaces}
        selectedPlaceId={selectedPlace?.id ?? null}
        onSelectPlace={handleSelectPlace}
        onClearSelection={handleClearSelection}
        onAddPlace={() => setIsAddOpen(true)}
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="mx-auto grid max-w-[1380px] gap-3">
          <div className="grid items-start gap-3 md:grid-cols-[auto_minmax(320px,680px)_auto] md:justify-between">
            <GlassBrandCapsule />
            <div className="md:justify-self-center">
              <SearchCapsule
                query={query}
                places={validPlaces}
                onQueryChange={setQuery}
                onSelectPlace={handleSelectPlace}
              />
            </div>
            <MoodChip />
          </div>

          <FilterChips
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </div>

      <PlaceStack
        places={nearbyPlaces.length ? nearbyPlaces : validPlaces.slice(0, 3)}
        selectedPlaceId={selectedPlace?.id ?? null}
        onSelectPlace={handleSelectPlace}
      />

      {filteredPlaces.length === 0 ? <NoResultsState /> : null}

      {selectedPlace && !isDetailOpen ? (
        <PlaceBottomSheet
          place={selectedPlace}
          isSaved={savedIds.includes(selectedPlace.id)}
          onClose={handleClearSelection}
          onOpenDetails={() => setIsDetailOpen(true)}
          onOpenMaps={() => window.open(mapsUrl(selectedPlace), "_blank", "noopener,noreferrer")}
          onToggleSave={() => handleToggleSave(selectedPlace)}
        />
      ) : null}

      <PlaceDetailDrawer
        place={selectedPlace}
        isOpen={Boolean(selectedPlace) && isDetailOpen}
        nearbyPlaces={nearbyPlaces}
        onClose={() => setIsDetailOpen(false)}
        onOpenMaps={(place) =>
          window.open(mapsUrl(place), "_blank", "noopener,noreferrer")
        }
        onSelectNearby={handleSelectNearbyPlace}
      />

      <AddPlaceModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddPlace}
      />
    </main>
  );
}

function NoResultsState() {
  return (
    <div className="glass-light-quiet pointer-events-none fixed left-1/2 top-[176px] z-20 w-[min(92vw,420px)] -translate-x-1/2 rounded-[24px] px-5 py-4 text-center text-ink">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
        No hidden spaces found
      </p>
      <p className="mt-1 text-sm font-semibold text-charcoal/78">
        Try a wider search or clear the active filter.
      </p>
    </div>
  );
}

function MapLoadingState() {
  return (
    <div className="grid h-[100dvh] w-full place-items-center bg-sand">
      <div className="glass-light-quiet h-2 w-44 overflow-hidden rounded-full">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-teal/45" />
      </div>
    </div>
  );
}
