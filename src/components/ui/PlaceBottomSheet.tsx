"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Clock3,
  ExternalLink,
  MapPinned,
  ShieldCheck,
  X,
} from "lucide-react";

import { CinematicImage } from "@/components/ui/CinematicImage";
import { categoryMeta } from "@/lib/categories";
import type { Place } from "@/types/placeTypes";

type PlaceBottomSheetProps = {
  place: Place;
  isSaved: boolean;
  onClose: () => void;
  onOpenDetails: () => void;
  onOpenMaps: () => void;
  onToggleSave: () => void;
};

export function PlaceBottomSheet({
  place,
  isSaved,
  onClose,
  onOpenDetails,
  onOpenMaps,
  onToggleSave,
}: PlaceBottomSheetProps) {
  const accent = categoryMeta[place.category].accent;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={place.id}
        initial={{ opacity: 0, y: 38, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.985 }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
        className="pointer-events-none fixed bottom-5 left-3 right-3 z-30 mx-auto max-w-[760px] md:bottom-6"
        aria-label={`Selected place: ${place.name}`}
      >
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-light field-grain pointer-events-auto max-h-[52vh] overflow-y-auto rounded-[30px] p-3 text-ink md:max-h-none md:overflow-hidden md:p-3.5"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
        <div className="grid gap-3 md:grid-cols-[214px_minmax(0,1fr)]">
          <div className="group relative h-[154px] overflow-hidden rounded-[24px] bg-sand md:h-full">
            <CinematicImage
              src={(place.coverImage ?? place.image).url}
              alt={(place.coverImage ?? place.image).alt}
              sizes="(min-width: 768px) 214px, 100vw"
              className="h-full w-full rounded-[24px]"
              imageClassName="transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/26 via-transparent to-transparent" />
          </div>

          <div className="min-w-0 px-1 py-1 md:py-2">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div
                  className="mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    color: accent,
                    backgroundColor: `${accent}16`,
                  }}
                >
                  {place.category}
                </div>
                <h2 className="max-w-[12ch] font-display text-[34px] font-semibold leading-[0.93] tracking-[-0.04em] text-ink md:text-[42px]">
                  {place.name}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close selected place"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coconut/70 text-mist transition hover:text-ink active:scale-95"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <p className="mt-3 line-clamp-2 max-w-[48ch] text-[15px] leading-[1.55] text-charcoal/82">
              {place.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {place.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-coconut/58 px-2.5 py-1 text-xs font-semibold text-mist"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-3 grid gap-2 text-xs font-semibold text-mist sm:grid-cols-3">
              <InfoPill icon={<Clock3 className="h-3.5 w-3.5" />} label={place.bestTime.split(",")[0]} />
              <InfoPill icon={<MapPinned className="h-3.5 w-3.5" />} label={place.crowdLevel} />
              <InfoPill icon={<ShieldCheck className="h-3.5 w-3.5" />} label={place.safetyLevel} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onOpenDetails}
                className="rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-coconut transition hover:bg-teal"
              >
                View Details
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onOpenMaps}
                className="flex items-center gap-2 rounded-full bg-coconut/68 px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-coconut"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
                Open in Maps
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onToggleSave}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  isSaved
                    ? "bg-ochre/18 text-ochre"
                    : "bg-coconut/54 text-ink hover:bg-coconut"
                }`}
              >
                <Bookmark
                  className="h-4 w-4"
                  strokeWidth={1.8}
                  fill={isSaved ? "currentColor" : "none"}
                />
                Save
              </motion.button>
            </div>
          </div>
        </div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-full bg-coconut/56 px-3 py-2">
      <span className="shrink-0 text-teal">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
