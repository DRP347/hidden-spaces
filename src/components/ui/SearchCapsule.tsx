"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { categoryMeta } from "@/lib/categories";
import type { Place } from "@/types/placeTypes";

type SearchCapsuleProps = {
  query: string;
  places: Place[];
  onQueryChange: (value: string) => void;
  onSelectPlace: (place: Place) => void;
};

export function SearchCapsule({
  query,
  places,
  onQueryChange,
  onSelectPlace,
}: SearchCapsuleProps) {
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return places.slice(0, 4);
    }

    return places
      .filter((place) =>
        [place.name, place.category, place.description, ...place.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 4);
  }, [places, query]);

  return (
    <div className="pointer-events-auto relative z-20 w-full max-w-[680px]">
      <motion.label
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isFocused ? 1.015 : 1,
        }}
        transition={{ delay: 0.06, type: "spring", stiffness: 130, damping: 20 }}
        className="glass-light field-grain flex h-16 items-center gap-3 rounded-full px-5 text-ink sm:h-[70px] sm:px-6"
      >
        <Search className="h-[18px] w-[18px] shrink-0 text-teal" strokeWidth={1.9} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => window.setTimeout(() => setIsFocused(false), 140)}
          placeholder="Search beaches, lanes, sunset corners..."
          aria-label="Search beaches, lanes, sunset corners"
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink placeholder:text-mist/78 outline-none"
        />
        <AnimatePresence>
          {query ? (
            <motion.button
              type="button"
              aria-label="Clear search"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onQueryChange("")}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coconut/70 text-mist transition hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </motion.label>

      <AnimatePresence>
        {isFocused ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 150, damping: 22 }}
            className="glass-light field-grain absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-[26px] p-2"
          >
            {suggestions.length > 0 ? (
              suggestions.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onSelectPlace(place)}
                  className="group flex w-full items-center justify-between gap-3 rounded-[20px] px-3 py-3 text-left transition hover:bg-coconut/60"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {place.name}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-xs font-medium text-mist">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: categoryMeta[place.category].accent,
                        }}
                      />
                      {place.category} · {place.tags.slice(0, 2).join(", ")}
                    </span>
                  </span>
                  <span className="rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal opacity-0 transition group-hover:opacity-100">
                    Open
                  </span>
                </button>
              ))
            ) : (
              <div className="rounded-[20px] bg-coconut/50 px-4 py-5 text-sm text-mist">
                No matching hidden spaces yet. Try beach, fort, chai, or quiet.
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
