"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";

import { parseCoordinatePair, slugify } from "@/lib/placeUtils";
import {
  placeCategories,
  type CrowdLevel,
  type Place,
  type PlaceCategory,
  type SafetyLevel,
} from "@/types/placeTypes";

const AdminMapPicker = dynamic(
  () => import("@/components/admin/AdminMapPicker").then((module) => module.AdminMapPicker),
  {
    ssr: false,
    loading: () => <div className="h-[320px] rounded-2xl bg-slate-100" />,
  },
);

type PlaceFormMode = "create" | "edit";

type FormState = {
  name: string;
  slug: string;
  category: PlaceCategory;
  coordinateInput: string;
  lat: number;
  lng: number;
  description: string;
  coverImageUrl: string;
  coverPublicId: string;
  galleryUrls: string;
  galleryImages: UploadedImage[];
  tags: string;
  bestTime: string;
  crowdLevel: CrowdLevel;
  safety: SafetyLevel;
  parking: boolean;
  isPublished: boolean;
  nearbySlugs: string;
};

type UploadedImage = {
  url: string;
  publicId: string;
};

const crowdLevels: CrowdLevel[] = ["Quiet", "Gentle", "Moderate", "Busy at peaks"];
const safetyLevels: SafetyLevel[] = [
  "Comfortable",
  "Stay aware",
  "Go before dark",
  "Local guidance suggested",
];

export function PlaceForm({
  mode,
  initialPlace,
}: {
  mode: PlaceFormMode;
  initialPlace?: Place;
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(() => toFormState(initialPlace));
  const [isSaving, setIsSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canSave = useMemo(
    () =>
      state.name.trim() &&
      state.description.trim() &&
      Number.isFinite(state.lat) &&
      Number.isFinite(state.lng),
    [state],
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((current) => ({
      ...current,
      [key]: value,
      slug:
        key === "name" && (!current.slug || current.slug === slugify(current.name))
          ? slugify(String(value))
          : current.slug,
    }));
    setError("");
    setUploadError("");
    setMessage("");
  };

  const handleCoordinateInput = (value: string) => {
    const coordinates = parseCoordinatePair(value);

    setState((current) => ({
      ...current,
      coordinateInput: value,
      ...(coordinates
        ? {
            lat: Number(coordinates.lat.toFixed(6)),
            lng: Number(coordinates.lng.toFixed(6)),
          }
        : {}),
    }));
    setMessage(coordinates ? "Coordinates converted to decimal degrees." : "");
    setError(
      value.trim() && !coordinates
        ? "Paste coordinates as decimal values or DMS, for example 20°24'21.9\"N 72°50'02.6\"E."
        : "",
    );
    setUploadError("");
  };

  const handleImageUpload = async (file: File | null, mode: "cover" | "gallery") => {
    if (!file) {
      return;
    }

    setUploadError("");
    setUploadStatus(mode === "cover" ? "Uploading cover image..." : "Uploading gallery image...");

    try {
      const uploaded = await uploadImage(file);

      if (mode === "cover") {
        setState((current) => ({
          ...current,
          coverImageUrl: uploaded.url,
          coverPublicId: uploaded.publicId,
        }));
      } else {
        setState((current) => ({
          ...current,
          galleryImages: [...current.galleryImages, uploaded],
        }));
      }
    } catch (uploadIssue) {
      setUploadError(
        uploadIssue instanceof Error ? uploadIssue.message : "Unable to upload image.",
      );
    } finally {
      setUploadStatus("");
    }
  };

  const removeGalleryImage = (index: number) => {
    setState((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    setState((current) => {
      if (toIndex < 0 || toIndex >= current.galleryImages.length) {
        return current;
      }

      const galleryImages = [...current.galleryImages];
      const [image] = galleryImages.splice(fromIndex, 1);
      galleryImages.splice(toIndex, 0, image);

      return {
        ...current,
        galleryImages,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave) {
      setError("Name, description, and valid coordinates are required.");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    const coverImage = state.coverImageUrl.trim()
      ? {
          url: state.coverImageUrl.trim(),
          publicId: state.coverPublicId,
        }
      : undefined;
    const manualGallery = splitLines(state.galleryUrls).map((url) => ({
      url,
      publicId: "",
    }));
    const payload = {
      name: state.name,
      slug: state.slug || slugify(state.name),
      category: state.category,
      coordinates: { lat: state.lat, lng: state.lng },
      description: state.description,
      images: {
        cover: coverImage,
        gallery: [...state.galleryImages, ...manualGallery],
      },
      tags: splitComma(state.tags),
      bestTime: state.bestTime,
      crowdLevel: state.crowdLevel,
      safety: state.safety,
      parking: state.parking,
      isPublished: state.isPublished,
      nearbySlugs: splitComma(state.nearbySlugs),
    };
    const url =
      mode === "edit" && initialPlace
        ? `/api/places/${encodeURIComponent(initialPlace.id)}`
        : "/api/places";
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        data?: Place;
        place?: Place;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save place.");
      }

      setMessage(mode === "edit" ? "Place updated." : "Place created.");

      const savedPlace = data.data ?? data.place;

      if (savedPlace) {
        router.push(`/admin/places/edit/${savedPlace.id}`);
        router.refresh();
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save place.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_390px]">
      <section className="grid gap-4">
        <Panel title="Basics">
          <Field label="Place name">
            <input
              value={state.name}
              onChange={(event) => update("name", event.target.value)}
              className={fieldClass}
              required
            />
          </Field>
          <Field label="Slug">
            <input
              value={state.slug}
              onChange={(event) => update("slug", slugify(event.target.value))}
              className={fieldClass}
              required
            />
          </Field>
          <Field label="Category">
            <select
              value={state.category}
              onChange={(event) => update("category", event.target.value as PlaceCategory)}
              className={fieldClass}
            >
              {placeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea
              value={state.description}
              onChange={(event) => update("description", event.target.value)}
              rows={4}
              className={fieldClass}
              required
            />
          </Field>
        </Panel>

        <Panel title="Visit Details">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Best time">
              <input
                value={state.bestTime}
                onChange={(event) => update("bestTime", event.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="Crowd level">
              <select
                value={state.crowdLevel}
                onChange={(event) => update("crowdLevel", event.target.value as CrowdLevel)}
                className={fieldClass}
              >
                {crowdLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Safety / comfort">
              <select
                value={state.safety}
                onChange={(event) => update("safety", event.target.value as SafetyLevel)}
                className={fieldClass}
              >
                {safetyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </Field>
            <ToggleField
              label="Published"
              description="Show this place on the public map."
              checked={state.isPublished}
              onChange={(checked) => update("isPublished", checked)}
            />
          </div>
          <ToggleField
            label="Parking available"
            description="Use this for nearby public or street parking."
            checked={state.parking}
            onChange={(checked) => update("parking", checked)}
          />
        </Panel>

        <Panel title="Images">
          <DropZone
            title="Cover image"
            description="Drop a JPEG, PNG, or WebP under 5MB."
            onFiles={(files) => handleImageUpload(files[0] ?? null, "cover")}
          />
          {state.coverImageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="relative aspect-video">
                <Image
                  src={state.coverImageUrl}
                  alt="Cover preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 p-3">
                <p className="truncate text-xs font-semibold text-slate-500">
                  {state.coverPublicId || state.coverImageUrl}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setState((current) => ({
                      ...current,
                      coverImageUrl: "",
                      coverPublicId: "",
                    }))
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ) : null}
          <Field label="Cover image URL fallback">
            <input
              value={state.coverImageUrl}
              onChange={(event) => {
                update("coverImageUrl", event.target.value);
                update("coverPublicId", "");
              }}
              className={fieldClass}
              placeholder="https://res.cloudinary.com/..."
            />
          </Field>

          <DropZone
            title="Gallery images"
            description="Drop multiple files to upload the visual story."
            multiple
            onFiles={async (files) => {
              for (const file of files) {
                await handleImageUpload(file, "gallery");
              }
            }}
          />
          {state.galleryImages.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {state.galleryImages.map((image, index) => (
                <div
                  key={`${image.publicId || image.url}-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={image.url}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="truncate text-xs font-semibold text-slate-500">
                      {index + 1}. {image.publicId || "URL image"}
                    </span>
                    <div className="flex items-center gap-1">
                      <IconButton
                        label="Move image up"
                        disabled={index === 0}
                        onClick={() => moveGalleryImage(index, index - 1)}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        label="Move image down"
                        disabled={index === state.galleryImages.length - 1}
                        onClick={() => moveGalleryImage(index, index + 1)}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        label="Remove image"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <Field label="Gallery image URLs, one per line">
            <textarea
              value={state.galleryUrls}
              onChange={(event) => update("galleryUrls", event.target.value)}
              rows={5}
              className={fieldClass}
            />
          </Field>
          {uploadStatus ? (
            <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
              {uploadStatus}
            </div>
          ) : null}
          {uploadError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {uploadError}
            </div>
          ) : null}
        </Panel>
      </section>

      <aside className="grid h-fit gap-4">
        <Panel title="Coordinates">
          <Field label="Paste coordinates">
            <input
              type="text"
              value={state.coordinateInput}
              onChange={(event) => handleCoordinateInput(event.target.value)}
              placeholder={`20°24'21.9"N 72°50'02.6"E`}
              className={fieldClass}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Latitude">
              <input
                type="number"
                value={state.lat}
                step="0.000001"
                onChange={(event) => update("lat", Number(event.target.value))}
                className={fieldClass}
              />
            </Field>
            <Field label="Longitude">
              <input
                type="number"
                value={state.lng}
                step="0.000001"
                onChange={(event) => update("lng", Number(event.target.value))}
                className={fieldClass}
              />
            </Field>
          </div>
          <AdminMapPicker
            lat={state.lat}
            lng={state.lng}
            onChange={(coordinates) =>
              setState((current) => ({
                ...current,
                lat: Number(coordinates.lat.toFixed(6)),
                lng: Number(coordinates.lng.toFixed(6)),
              }))
            }
          />
          <p className="text-xs text-slate-500">
            Click the map or drag the marker to fix coordinates.
          </p>
        </Panel>

        <Panel title="Tags">
          <Field label="Tags, comma-separated">
            <input
              value={state.tags}
              onChange={(event) => update("tags", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Nearby slugs, comma-separated">
            <input
              value={state.nearbySlugs}
              onChange={(event) => update("nearbySlugs", event.target.value)}
              className={fieldClass}
            />
          </Field>
        </Panel>

        {state.coverImageUrl ? (
          <Image
            src={state.coverImageUrl}
            alt=""
            width={1200}
            height={675}
            unoptimized
            className="aspect-video w-full rounded-2xl object-cover"
          />
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving || !canSave}
          className="min-h-12 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSaving ? "Saving..." : mode === "edit" ? "Save changes" : "Create place"}
        </button>
      </aside>
    </form>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}

function DropZone({
  title,
  description,
  multiple = false,
  onFiles,
}: {
  title: string;
  description: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        onFiles(Array.from(event.dataTransfer.files));
      }}
      className={`grid cursor-pointer place-items-center rounded-2xl border border-dashed p-5 text-center transition ${
        isDragging
          ? "border-teal-500 bg-teal-50"
          : "border-slate-300 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50"
      }`}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={(event) => onFiles(Array.from(event.target.files ?? []))}
        className="sr-only"
      />
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-teal-700 shadow-sm">
        {multiple ? <ImagePlus className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
      </span>
      <span className="mt-3 text-sm font-bold text-slate-950">{title}</span>
      <span className="mt-1 max-w-sm text-xs leading-5 text-slate-500">{description}</span>
    </label>
  );
}

function IconButton({
  label,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
      <span>
        <span className="block text-sm font-semibold text-slate-700">{label}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
      />
    </label>
  );
}

function toFormState(place?: Place): FormState {
  return {
    name: place?.name ?? "",
    slug: place?.slug ?? "",
    category: place?.category ?? "Peaceful",
    coordinateInput: "",
    lat: place?.coordinates.lat ?? 20.4142,
    lng: place?.coordinates.lng ?? 72.8321,
    description: place?.description ?? "",
    coverImageUrl: place?.coverImage.url ?? "",
    coverPublicId: place?.coverImage.publicId ?? "",
    galleryUrls: "",
    galleryImages:
      place?.gallery.map((image) => ({
        url: image.url,
        publicId: image.publicId,
      })) ?? [],
    tags: place?.tags.join(", ") ?? "",
    bestTime: place?.bestTime ?? "",
    crowdLevel: place?.crowdLevel ?? "Gentle",
    safety: place?.safetyLevel ?? "Comfortable",
    parking: place ? !place.parking.toLowerCase().includes("no reliable") : false,
    isPublished: place?.visibility !== "Private",
    nearbySlugs: place?.nearbySlugs.join(", ") ?? "",
  };
}

function splitComma(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function uploadImage(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = (await response.json()) as {
    success?: boolean;
    data?: {
      secure_url?: string;
      public_id?: string;
    };
    secure_url?: string;
    public_id?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to upload image.");
  }

  const url = data.data?.secure_url ?? data.secure_url;
  const publicId = data.data?.public_id ?? data.public_id;

  if (!url || !publicId) {
    throw new Error("Upload response was missing image details.");
  }

  return { url, publicId };
}

const fieldClass =
  "min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";
