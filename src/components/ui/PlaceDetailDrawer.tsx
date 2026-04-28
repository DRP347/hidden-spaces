"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Clock3,
  Compass,
  ExternalLink,
  MapPin,
  Navigation,
  ParkingCircle,
  ShieldCheck,
  Sparkles,
  StickyNote,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { CinematicImage } from "@/components/ui/CinematicImage";
import { useScrollLock } from "@/hooks/useScrollLock";
import { categoryMeta } from "@/lib/categories";
import type { Place } from "@/types/placeTypes";

type DetailTab = "photos" | "street" | "vibe";

type PlaceDetailDrawerProps = {
  place: Place | null;
  isOpen: boolean;
  nearbyPlaces: Place[];
  onClose: () => void;
  onOpenMaps: (place: Place) => void;
  onSelectNearby: (place: Place) => void;
};

const tabs: Array<{ id: DetailTab; label: string }> = [
  { id: "photos", label: "Photos" },
  { id: "street", label: "Street View" },
  { id: "vibe", label: "Vibe" },
];

export function PlaceDetailDrawer({
  place,
  isOpen,
  nearbyPlaces,
  onClose,
  onOpenMaps,
  onSelectNearby,
}: PlaceDetailDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeTab, setActiveTab] = useState<DetailTab>("photos");

  useScrollLock(isOpen);

  useEffect(() => {
    setActiveTab("photos");
  }, [isOpen, place?.id]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && place ? (
        <>
          <motion.button
            type="button"
            aria-label="Close place details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 cursor-default bg-ink/10 backdrop-blur-[1px]"
          />
          <motion.aside
            key={place.id}
            initial={isDesktop ? { x: "106%", opacity: 0.72 } : { y: "104%", opacity: 0.72 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={isDesktop ? { x: "106%", opacity: 0 } : { y: "104%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 24 }}
            className="glass-light field-grain fixed inset-0 z-[41] flex flex-col overflow-hidden text-ink md:inset-y-4 md:left-auto md:right-4 md:w-[460px] md:rounded-[32px] lg:w-[480px]"
            aria-label={`${place.name} details`}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="hide-scrollbar flex-1 overflow-y-auto">
              <DrawerHero place={place} onClose={onClose} />

              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="mt-4 flex flex-wrap gap-2">
                  {place.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-coconut/62 px-3 py-1.5 text-xs font-semibold text-mist"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <TabBar activeTab={activeTab} onChange={setActiveTab} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.985, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.985, y: 8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {activeTab === "photos" ? (
                      <PhotosTab place={place} />
                    ) : activeTab === "street" ? (
                      <StreetViewPanel
                        place={place}
                        onOpenMaps={() => onOpenMaps(place)}
                      />
                    ) : (
                      <VibePanel place={place} />
                    )}
                  </motion.div>
                </AnimatePresence>

                <p className="mt-5 max-w-[58ch] text-[15.5px] leading-[1.6] text-charcoal/84">
                  {place.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <MetadataPill
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Best time"
                    value={place.bestTime.split(",")[0]}
                  />
                  <MetadataPill
                    icon={<Compass className="h-4 w-4" />}
                    label="Crowd"
                    value={place.crowdLevel}
                  />
                  <MetadataPill
                    icon={<ShieldCheck className="h-4 w-4" />}
                    label="Comfort"
                    value={place.safetyLevel}
                  />
                  <MetadataPill
                    icon={<MapPin className="h-4 w-4" />}
                    label="Coordinates"
                    value={`${place.coordinates.lat.toFixed(3)}, ${place.coordinates.lng.toFixed(3)}`}
                  />
                </div>

                <div className="mt-5 grid gap-2.5">
                  <DetailRow
                    icon={<ParkingCircle className="h-4 w-4" />}
                    label="Parking"
                    value={place.parking}
                  />
                  <DetailRow
                    icon={<StickyNote className="h-4 w-4" />}
                    label="Local note"
                    value={place.notes}
                  />
                </div>

                <NearbyPlaces
                  nearbyPlaces={nearbyPlaces}
                  onSelectNearby={onSelectNearby}
                />
              </div>
            </div>

            <div className="border-t border-ink/8 p-4 sm:p-5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenMaps(place)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-bold text-coconut transition hover:bg-teal"
              >
                <Navigation className="h-4 w-4" strokeWidth={1.9} />
                Open in Google Maps
                <ExternalLink className="h-4 w-4" strokeWidth={1.9} />
              </motion.button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function DrawerHero({ place, onClose }: { place: Place; onClose: () => void }) {
  const accent = categoryMeta[place.category].accent;
  const cover = place.coverImage ?? place.image;

  return (
    <header className="relative p-3 pb-0">
      <CinematicImage
        src={cover.url}
        alt={cover.alt}
        sizes="(min-width: 768px) 480px, 100vw"
        priority
        className="aspect-[4/3] rounded-[28px]"
        imageClassName="contrast-[0.98] saturate-[0.96]"
      />
      <div className="absolute inset-x-3 bottom-0 rounded-b-[28px] bg-gradient-to-t from-ink/54 via-ink/14 to-transparent p-5 pt-16">
        <div
          className="mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold text-coconut"
          style={{ backgroundColor: accent }}
        >
          {place.category}
        </div>
        <h2 className="max-w-[12ch] font-display text-[40px] font-semibold leading-[0.9] tracking-[-0.04em] text-coconut">
          {place.name}
        </h2>
      </div>
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-coconut/76 text-ink shadow-[0_12px_30px_rgba(22,32,42,0.18)] backdrop-blur-md transition hover:bg-coconut active:scale-95"
      >
        <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </button>
    </header>
  );
}

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: DetailTab;
  onChange: (tab: DetailTab) => void;
}) {
  return (
    <div
      className="mt-5 grid grid-cols-3 gap-1 rounded-full bg-coconut/54 p-1"
      role="tablist"
      aria-label="Place detail views"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onPointerDown={(event) => {
            event.stopPropagation();
            onChange(tab.id);
          }}
          onClick={(event) => {
            event.stopPropagation();
            onChange(tab.id);
          }}
          className={`relative min-h-11 rounded-full px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
            activeTab === tab.id ? "text-coconut" : "text-mist hover:text-ink"
          }`}
        >
          {activeTab === tab.id ? (
            <motion.span
              layoutId="detail-tab-pill"
              className="absolute inset-0 rounded-full bg-ink"
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            />
          ) : null}
          <span className="relative">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

function PhotosTab({ place }: { place: Place }) {
  const images = place.gallery.length ? place.gallery : [place.coverImage ?? place.image];

  return (
    <section className="mt-4" aria-label={`${place.name} photo gallery`}>
      <div className="gallery-scroll hide-scrollbar flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <motion.figure
            key={image.publicId}
            whileHover={{ y: -3 }}
            className="w-[82%] shrink-0 sm:w-[74%]"
          >
            <CinematicImage
              src={image.url}
              alt={image.alt}
              sizes="(min-width: 768px) 360px, 82vw"
              priority={index === 0}
              className="aspect-video rounded-[24px] shadow-[0_18px_42px_rgba(22,32,42,0.14)]"
              imageClassName="transition duration-700 hover:scale-[1.035]"
            />
            <figcaption className="mt-2 px-1 text-xs font-semibold text-mist">
              Frame {index + 1} · {place.category.toLowerCase()} field note
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function StreetViewPanel({
  place,
  onOpenMaps,
}: {
  place: Place;
  onOpenMaps: () => void;
}) {
  const cover = place.coverImage ?? place.image;

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
          Look around this place
        </p>
        <span className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-bold text-teal">
          Street layer
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="group relative aspect-[4/3] overflow-hidden rounded-[28px] bg-sand shadow-[0_18px_42px_rgba(22,32,42,0.14)]"
      >
        <CinematicImage
          src={cover.url}
          alt={cover.alt}
          sizes="(min-width: 768px) 430px, 92vw"
          className="h-full w-full"
          imageClassName="transition duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/72 via-ink/24 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-[32px] font-semibold leading-none tracking-[-0.04em] text-coconut">
            Explore this place in Google Maps
          </p>
          <p className="mt-2 text-sm font-semibold text-coconut/78">
            {place.coordinates.lat.toFixed(5)}, {place.coordinates.lng.toFixed(5)}
          </p>
          <button
            type="button"
            onClick={onOpenMaps}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-coconut px-4 py-2.5 text-sm font-bold text-ink shadow-[0_14px_34px_rgba(22,32,42,0.18)] transition hover:bg-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            Open Street View
            <ExternalLink className="h-4 w-4" strokeWidth={1.9} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function VibePanel({ place }: { place: Place }) {
  const accent = categoryMeta[place.category].accent;
  const moodImages = place.gallery.slice(0, 3);
  const goodFor = getGoodFor(place);

  return (
    <section className="mt-4 grid gap-3">
      <div className="rounded-[26px] bg-coconut/52 p-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
          <Sparkles className="h-4 w-4" strokeWidth={1.8} />
          Mood
        </div>
        <div className="flex flex-wrap gap-2">
          {place.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full px-3 py-1.5 text-xs font-bold"
              style={{
                backgroundColor: `${accent}16`,
                color: accent,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <VibeCard label="Crowd" value={place.crowdLevel} accent={accent} />
        <VibeCard
          label="Energy"
          value={getEnergyLevel(place)}
          accent={accent}
        />
        <VibeCard label="Best time" value={place.bestTime.split(",")[0]} accent={accent} />
        <VibeCard label="Comfort" value={place.safetyLevel} accent={accent} />
      </div>
      <div className="rounded-[26px] bg-coconut/52 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
          Good for
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {goodFor.map((item) => (
            <span
              key={item}
              className="rounded-full bg-coconut/72 px-3 py-1.5 text-xs font-bold text-ink"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      {moodImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {moodImages.map((image, index) => (
            <CinematicImage
              key={image.publicId}
              src={image.url}
              alt={image.alt}
              sizes="150px"
              className={`rounded-[20px] ${
                index === 0 ? "aspect-[4/5]" : "aspect-square"
              }`}
              imageClassName="transition duration-700 hover:scale-[1.035]"
            />
          ))}
        </div>
      ) : null}
      <DetailRow
        icon={<Camera className="h-4 w-4" />}
        label="How to read it"
        value={place.notes || "Arrive slowly, watch the edges of the place, and let the view settle before taking photos."}
      />
    </section>
  );
}

function VibeCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-[24px] bg-coconut/52 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-ink">{value}</p>
      <span
        className="mt-4 block h-1.5 w-12 rounded-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

function MetadataPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] bg-coconut/52 p-3">
      <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mist">
        <span className="text-teal">{icon}</span>
        {label}
      </div>
      <p className="truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] bg-coconut/48 p-3">
      <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
        <span className="text-teal">{icon}</span>
        {label}
      </div>
      <p className="text-sm leading-6 text-charcoal/86">{value}</p>
    </div>
  );
}

function NearbyPlaces({
  nearbyPlaces,
  onSelectNearby,
}: {
  nearbyPlaces: Place[];
  onSelectNearby: (place: Place) => void;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
          Nearby
        </h3>
        <span className="text-xs font-semibold text-mist">
          {nearbyPlaces.length} close
        </span>
      </div>
      <div className="grid gap-2">
        {nearbyPlaces.map((nearby) => {
          const cover = nearby.coverImage ?? nearby.image;

          return (
            <button
              key={nearby.id}
              type="button"
              onClick={() => onSelectNearby(nearby)}
              className="group flex items-center gap-3 rounded-[22px] bg-coconut/48 p-2.5 text-left transition hover:bg-coconut/76 active:scale-[0.99]"
            >
              <CinematicImage
                src={cover.url}
                alt={cover.alt}
                sizes="52px"
                className="h-[52px] w-[52px] shrink-0 rounded-2xl"
                imageClassName="transition duration-500 group-hover:scale-110"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ink">
                  {nearby.name}
                </span>
                <span className="mt-1 text-xs font-semibold text-mist">
                  {nearby.category} · {nearby.crowdLevel}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getGoodFor(place: Place) {
  const tagText = `${place.category} ${place.tags.join(" ")}`.toLowerCase();
  const values = new Set<string>();

  if (tagText.includes("photo") || tagText.includes("heritage")) {
    values.add("photography");
  }
  if (tagText.includes("peace") || tagText.includes("morning") || tagText.includes("walk")) {
    values.add("solo walk");
  }
  if (tagText.includes("sunset") || tagText.includes("golden")) {
    values.add("sunset");
  }
  if (tagText.includes("quiet") || tagText.includes("calm")) {
    values.add("quiet sit");
  }
  if (tagText.includes("food") || tagText.includes("chai")) {
    values.add("local snack");
  }

  if (values.size === 0) {
    values.add("slow visit");
    values.add("local texture");
  }

  return Array.from(values).slice(0, 5);
}

function getEnergyLevel(place: Place) {
  if (place.crowdLevel === "Quiet") return "low and soft";
  if (place.crowdLevel === "Gentle") return "easy pulse";
  if (place.crowdLevel === "Moderate") return "lively edge";
  return "peak-hour buzz";
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
