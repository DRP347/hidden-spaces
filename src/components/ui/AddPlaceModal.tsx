"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, Eye, EyeOff, MapPin, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { useScrollLock } from "@/hooks/useScrollLock";
import {
  placeCategories,
  type CrowdLevel,
  type NewPlaceDraft,
  type PlaceCategory,
  type PlaceVisibility,
  type SafetyLevel,
} from "@/types/placeTypes";

type AddPlaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (draft: NewPlaceDraft) => void;
};

const crowdLevels: CrowdLevel[] = ["Quiet", "Gentle", "Moderate", "Busy at peaks"];
const safetyLevels: SafetyLevel[] = [
  "Comfortable",
  "Stay aware",
  "Go before dark",
  "Local guidance suggested",
];
const visibilityOptions: PlaceVisibility[] = ["Public", "Private"];

const initialDraft: NewPlaceDraft = {
  name: "",
  category: "Peaceful",
  coordinates: "20.4140, 72.8320",
  description: "",
  bestTime: "",
  crowdLevel: "Gentle",
  safetyLevel: "Comfortable",
  parking: true,
  imageUrl: "",
  notes: "",
  visibility: "Public",
};

export function AddPlaceModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPlaceModalProps) {
  useScrollLock(isOpen);

  const [draft, setDraft] = useState<NewPlaceDraft>(initialDraft);
  const [error, setError] = useState("");

  const visibilityIcon = useMemo(
    () =>
      draft.visibility === "Public" ? (
        <Eye className="h-4 w-4" strokeWidth={1.8} />
      ) : (
        <EyeOff className="h-4 w-4" strokeWidth={1.8} />
      ),
    [draft.visibility],
  );

  const update = <K extends keyof NewPlaceDraft>(
    key: K,
    value: NewPlaceDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const [lat, lng] = draft.coordinates
      .split(",")
      .map((part) => Number(part.trim()));
    const requiredFields = [
      draft.name,
      draft.description,
      draft.bestTime,
      draft.notes,
    ];

    if (requiredFields.some((field) => field.trim().length < 3)) {
      setError("Add a little more detail before saving this space.");
      return;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError("Coordinates should look like 20.4140, 72.8320.");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Coordinates are outside the valid latitude and longitude range.");
      return;
    }

    onSubmit(draft);
    setDraft(initialDraft);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close add hidden space form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 cursor-default bg-ink/12 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 46, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 38, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 155, damping: 24 }}
            className="glass-light field-grain fixed bottom-0 left-0 right-0 z-[51] mx-auto max-h-[92dvh] max-w-[760px] overflow-hidden rounded-t-[30px] text-ink md:bottom-8 md:top-8 md:max-h-none md:rounded-[32px]"
            role="dialog"
            aria-modal="true"
            aria-label="Add hidden space"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
                  Local contribution
                </p>
                <h2 className="mt-1 font-display text-[36px] font-semibold leading-none tracking-[-0.04em] text-ink">
                  Add a hidden space
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close form"
                onClick={onClose}
                className="grid h-11 w-11 place-items-center rounded-full bg-coconut/70 text-mist transition hover:text-ink active:scale-95"
              >
                <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="hide-scrollbar max-h-[calc(92dvh-86px)] overflow-y-auto p-5"
            >
              <FormSection eyebrow="Place signal" title="What did you find?">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Place name">
                    <input
                      value={draft.name}
                      onChange={(event) => update("name", event.target.value)}
                      placeholder="Fort-side reading step"
                      className={fieldClassName}
                    />
                  </Field>

                  <Field label="Category">
                    <select
                      value={draft.category}
                      onChange={(event) =>
                        update("category", event.target.value as PlaceCategory)
                      }
                      className={fieldClassName}
                    >
                      {placeCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Location / coordinates">
                    <div className="relative">
                      <MapPin
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal"
                        strokeWidth={1.8}
                      />
                      <input
                        value={draft.coordinates}
                        onChange={(event) =>
                          update("coordinates", event.target.value)
                        }
                        placeholder="20.4140, 72.8320"
                        className={`${fieldClassName} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field label="Best time to visit">
                    <input
                      value={draft.bestTime}
                      onChange={(event) => update("bestTime", event.target.value)}
                      placeholder="After the first tea stalls open"
                      className={fieldClassName}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection eyebrow="Visit feel" title="How should people arrive?">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Crowd level">
                    <select
                      value={draft.crowdLevel}
                      onChange={(event) =>
                        update("crowdLevel", event.target.value as CrowdLevel)
                      }
                      className={fieldClassName}
                    >
                      {crowdLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Safety level">
                    <select
                      value={draft.safetyLevel}
                      onChange={(event) =>
                        update("safetyLevel", event.target.value as SafetyLevel)
                      }
                      className={fieldClassName}
                    >
                      {safetyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Image URL">
                    <div className="relative">
                      <Camera
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ochre"
                        strokeWidth={1.8}
                      />
                      <input
                        value={draft.imageUrl}
                        onChange={(event) => update("imageUrl", event.target.value)}
                        placeholder="https://res.cloudinary.com/..."
                        className={`${fieldClassName} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field label="Visibility">
                    <div className="grid grid-cols-2 gap-2 rounded-[20px] bg-coconut/54 p-1">
                      {visibilityOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => update("visibility", option)}
                          className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold transition ${
                            draft.visibility === option
                              ? "bg-ink text-coconut"
                              : "text-mist hover:text-ink"
                          }`}
                        >
                          {draft.visibility === option ? visibilityIcon : null}
                          {option}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </FormSection>

              <FormSection eyebrow="Local note" title="Why does it matter?">
                <div className="grid gap-4">
                  <Field label="Description">
                    <textarea
                      value={draft.description}
                      onChange={(event) => update("description", event.target.value)}
                      placeholder="What makes this place quiet, local, or underrated?"
                      rows={3}
                      className={`${fieldClassName} resize-none leading-6`}
                    />
                  </Field>

                  <Field label="Personal notes">
                    <textarea
                      value={draft.notes}
                      onChange={(event) => update("notes", event.target.value)}
                      placeholder="Small etiquette, timing, or detail that makes the visit better."
                      rows={3}
                      className={`${fieldClassName} resize-none leading-6`}
                    />
                  </Field>
                </div>
              </FormSection>

              <label className="mt-4 flex min-h-11 items-center gap-3 rounded-[22px] bg-coconut/48 p-3 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={draft.parking}
                  onChange={(event) => update("parking", event.target.checked)}
                  className="h-4 w-4 accent-teal"
                />
                Parking available nearby
              </label>

              {error ? (
                <div className="mt-4 rounded-[22px] bg-clay/12 px-4 py-3 text-sm font-semibold text-clay">
                  {error}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-coconut/58 px-5 py-3 text-sm font-bold text-ink transition hover:bg-coconut active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-coconut transition hover:bg-teal active:scale-95"
                >
                  Save space
                </button>
              </div>
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

const fieldClassName =
  "w-full rounded-[20px] border border-white/70 bg-coconut/54 px-3 py-3 text-sm font-medium text-ink outline-none transition placeholder:text-mist/68 focus:border-teal/45 focus:bg-coconut/78";

function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 first:mt-0">
      <div className="mb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
          {eyebrow}
        </p>
        <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm text-ink ${className}`}>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-mist">
        {label}
      </span>
      {children}
    </label>
  );
}
