"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, ChevronLeft, Clock3, Compass, Heart, Route } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { categoryMeta } from "@/lib/categories";
import type { Place } from "@/types/placeTypes";

type DiscoveryPanelProps = {
  isOpen: boolean;
  onToggle: () => void;
  nearbyPlaces: Place[];
  recentPlaces: Place[];
  savedPlaces: Place[];
  onSelectPlace: (place: Place) => void;
};

const sections = ["Nearby", "Recent", "Saved", "Routes"] as const;
type DiscoverySection = (typeof sections)[number];

export function DiscoveryPanel({
  isOpen,
  onToggle,
  nearbyPlaces,
  recentPlaces,
  savedPlaces,
  onSelectPlace,
}: DiscoveryPanelProps) {
  const [section, setSection] = useState<DiscoverySection>("Nearby");

  const places =
    section === "Nearby"
      ? nearbyPlaces
      : section === "Recent"
        ? recentPlaces
        : section === "Saved"
          ? savedPlaces
          : nearbyPlaces.slice(0, 3);

  return (
    <div className="pointer-events-none fixed left-4 top-[162px] z-30 hidden md:block">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.aside
            key="panel"
            initial={{ opacity: 0, x: -24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 130, damping: 22 }}
            className="glass-surface pointer-events-auto w-[318px] rounded-[28px] p-3"
          >
            <div className="flex items-center justify-between px-2 py-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-mist">
                  Discovery
                </p>
                <h2 className="mt-1 font-display text-2xl leading-none text-bone">
                  Quiet Signals
                </h2>
              </div>
              <button
                type="button"
                aria-label="Collapse discovery panel"
                onClick={onToggle}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-mist transition hover:text-bone active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
              {sections.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSection(item)}
                  className={`relative rounded-full px-2 py-2 text-[11px] transition ${
                    section === item ? "text-ink" : "text-mist hover:text-bone"
                  }`}
                >
                  {section === item ? (
                    <motion.span
                      layoutId="discovery-pill"
                      className="absolute inset-0 rounded-full bg-sand"
                      transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    />
                  ) : null}
                  <span className="relative">{item}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {section === "Routes" ? (
                <RoutePreview places={nearbyPlaces.slice(0, 3)} />
              ) : places.length > 0 ? (
                places.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => onSelectPlace(place)}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-2 text-left transition hover:border-white/18 hover:bg-white/[0.07] active:scale-[0.99]"
                  >
                    <Image
                      src={place.image.url}
                      alt={place.image.alt}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-bone">
                        {place.name}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-xs text-mist">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: categoryMeta[place.category].accent,
                          }}
                        />
                        {place.category}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm text-mist">
                  Saved places will settle here.
                </div>
              )}
            </div>
          </motion.aside>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            aria-label="Open discovery panel"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="glass-surface pointer-events-auto grid h-12 w-12 place-items-center rounded-full text-mist transition hover:text-teal"
          >
            <Compass className="h-5 w-5" strokeWidth={1.7} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoutePreview({ places }: { places: Place[] }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-3">
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-mist">
        <Route className="h-3.5 w-3.5" strokeWidth={1.8} />
        Slow Loop
      </div>
      <div className="space-y-3">
        {places.map((place, index) => (
          <div key={place.id} className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-[11px] text-sand">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-bone">{place.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-mist">
                {index === 0 ? (
                  <Clock3 className="h-3 w-3" strokeWidth={1.8} />
                ) : index === 1 ? (
                  <Heart className="h-3 w-3" strokeWidth={1.8} />
                ) : (
                  <Bookmark className="h-3 w-3" strokeWidth={1.8} />
                )}
                {place.bestTime.split(",")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
