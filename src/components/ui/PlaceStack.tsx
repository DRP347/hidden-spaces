"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Compass, X } from "lucide-react";
import { useMemo, useState } from "react";

import { CinematicImage } from "@/components/ui/CinematicImage";
import { categoryMeta } from "@/lib/categories";
import type { Place } from "@/types/placeTypes";

type PlaceStackProps = {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place) => void;
};

export function PlaceStack({
  places,
  selectedPlaceId,
  onSelectPlace,
}: PlaceStackProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const visiblePlaces = useMemo(() => uniquePlaces(places).slice(0, 3), [places]);

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.22, type: "spring", stiffness: 120, damping: 18 }}
        className="pointer-events-auto fixed bottom-5 left-5 z-30 hidden w-[292px] xl:block"
        aria-label="Recommended hidden spaces"
      >
        <p className="mb-2 pl-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/60">
          Field notes nearby
        </p>
        <div className="space-y-2">
          {visiblePlaces.map((place, index) => (
            <StackCard
              key={place.id}
              place={place}
              index={index}
              active={place.id === selectedPlaceId}
              onSelectPlace={onSelectPlace}
            />
          ))}
        </div>
      </motion.aside>

      <motion.aside
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, type: "spring", stiffness: 120, damping: 18 }}
        className="pointer-events-auto fixed bottom-[196px] left-5 right-5 z-30 hidden gap-2 overflow-x-auto hide-scrollbar md:flex xl:hidden"
        aria-label="Recommended hidden spaces"
      >
        {visiblePlaces.map((place, index) => (
          <div key={place.id} className="w-[260px] shrink-0">
            <StackCard
              place={place}
              index={index}
              active={place.id === selectedPlaceId}
              onSelectPlace={onSelectPlace}
            />
          </div>
        ))}
      </motion.aside>

      <button
        type="button"
        aria-label="Explore recommended places"
        onClick={() => setMobileOpen(true)}
        className="glass-light-quiet pointer-events-auto fixed bottom-[188px] left-4 z-30 flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink shadow-sm md:hidden"
      >
        <Compass className="h-4 w-4 text-teal" strokeWidth={1.8} />
        Explore
      </button>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close explore drawer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/12 backdrop-blur-[2px] md:hidden"
            />
            <motion.aside
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ type: "spring", stiffness: 150, damping: 24 }}
              className="glass-light field-grain fixed bottom-0 left-0 right-0 z-[41] rounded-t-[28px] p-4 md:hidden"
              aria-label="Explore hidden spaces"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
                    Field notes
                  </p>
                  <h2 className="font-display text-3xl font-semibold leading-none tracking-[-0.04em] text-ink">
                    Nearby calm
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close explore drawer"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-coconut/70 text-ink"
                >
                  <X className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
              <div className="space-y-2">
                {visiblePlaces.map((place, index) => (
                  <StackCard
                    key={place.id}
                    place={place}
                    index={index}
                    active={place.id === selectedPlaceId}
                    onSelectPlace={(nextPlace) => {
                      onSelectPlace(nextPlace);
                      setMobileOpen(false);
                    }}
                  />
                ))}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function uniquePlaces(places: Place[]) {
  const seen = new Set<string>();

  return places.filter((place) => {
    if (seen.has(place.id)) {
      return false;
    }

    seen.add(place.id);
    return true;
  });
}

function StackCard({
  place,
  index,
  active,
  onSelectPlace,
}: {
  place: Place;
  index: number;
  active: boolean;
  onSelectPlace: (place: Place) => void;
}) {
  const accent = categoryMeta[place.category].accent;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.06 * index,
        type: "spring",
        stiffness: 140,
        damping: 18,
      }}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectPlace(place)}
      className={`glass-light-quiet field-grain group flex w-full items-center gap-3 rounded-[22px] p-2.5 text-left transition ${
        active ? "ring-1 ring-teal/35" : ""
      }`}
    >
      <CinematicImage
        src={(place.coverImage ?? place.image).url}
        alt={(place.coverImage ?? place.image).alt}
        sizes="56px"
        className="h-14 w-14 shrink-0 rounded-2xl"
        imageClassName="transition duration-500 group-hover:scale-110"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold tracking-[-0.01em] text-ink">
          {place.name}
        </span>
        <span className="mt-1 flex items-center gap-2 text-xs font-medium text-mist">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
          {place.category} · {place.crowdLevel}
        </span>
      </span>
    </motion.button>
  );
}
