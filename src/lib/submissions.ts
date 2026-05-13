import mongoose from "mongoose";

import { DEFAULT_IMAGE_URL, parseCoordinatePair, slugify, type PlacePayload } from "@/lib/placeUtils";
import { PlaceModel } from "@/models/Place";
import type { SpotSubmissionDocument } from "@/models/SpotSubmission";
import type { PlaceCategory } from "@/types/placeTypes";
import type { SpotSubmission, SubmissionStatus } from "@/types/submissionTypes";

type SubmissionRecord = Partial<SpotSubmissionDocument> & {
  _id?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  reviewedAt?: unknown;
  approvedAt?: unknown;
  rejectedAt?: unknown;
  convertedPlaceId?: unknown;
};

export type ApprovalPlaceInput = {
  name?: unknown;
  slug?: unknown;
  category?: unknown;
  area?: unknown;
  description?: unknown;
  bestTime?: unknown;
  notes?: unknown;
  crowdLevel?: unknown;
  safety?: unknown;
  parking?: unknown;
  isPublished?: unknown;
  coordinates?: unknown;
  lat?: unknown;
  lng?: unknown;
  tags?: unknown;
  coverImageUrl?: unknown;
  coverPublicId?: unknown;
  galleryUrls?: unknown;
};

const categories: PlaceCategory[] = [
  "Sunset",
  "Peaceful",
  "Cafés",
  "Photo Spots",
  "Beaches",
  "Heritage",
  "Food",
  "Hidden Lanes",
];

export function serializeSubmission(record: SubmissionRecord): SpotSubmission {
  return {
    id: objectIdToString(record._id) ?? "",
    name: stringValue(record.name),
    area: stringValue(record.area),
    category: normalizeCategory(record.category),
    reason: stringValue(record.reason),
    description: stringValue(record.description),
    bestTime: stringValue(record.bestTime),
    mapsLink: stringValue(record.mapsLink),
    coordinates: normalizeCoordinates(record.coordinates),
    submitterName: stringValue(record.submitterName),
    submitterContact: stringValue(record.submitterContact),
    notes: stringValue(record.notes),
    status: normalizeStatus(record.status),
    adminNotes: stringValue(record.adminNotes),
    reviewedAt: dateToString(record.reviewedAt),
    approvedAt: dateToString(record.approvedAt),
    rejectedAt: dateToString(record.rejectedAt),
    convertedPlaceId: objectIdToString(record.convertedPlaceId),
    createdAt: dateToString(record.createdAt),
    updatedAt: dateToString(record.updatedAt),
  };
}

export async function buildPlacePayloadFromSubmission(
  submission: SubmissionRecord,
  input: ApprovalPlaceInput,
): Promise<PlacePayload> {
  const serialized = serializeSubmission(submission);
  const name = clean(input.name, serialized.name);
  const baseSlug = slugify(clean(input.slug, slugify(name))) || slugify(name);
  const coordinates = getApprovalCoordinates(input, serialized);
  const description = clean(
    input.description,
    serialized.description || serialized.reason || "Submitted local field note.",
  );
  const coverImageUrl = clean(input.coverImageUrl, DEFAULT_IMAGE_URL);
  const galleryUrls = splitList(input.galleryUrls);
  const tags = splitList(input.tags);
  const finalTags = tags.length
    ? tags
    : Array.from(
        new Set(
          [
            serialized.category.toLowerCase(),
            serialized.area,
            ...serialized.reason.split(/\W+/).filter((word) => word.length > 4).slice(0, 3),
          ]
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean),
        ),
      ).slice(0, 5);

  return {
    name,
    slug: await createUniqueSlug(baseSlug, objectIdToString(submission._id) ?? name),
    area: clean(input.area, serialized.area),
    category: normalizeCategory(input.category ?? serialized.category),
    coordinates,
    description,
    notes: clean(input.notes, [serialized.reason, serialized.notes].filter(Boolean).join("\n\n")),
    tags: finalTags,
    images: {
      cover: {
        url: coverImageUrl,
        publicId: clean(input.coverPublicId, ""),
      },
      gallery: galleryUrls.map((url) => ({ url, publicId: "" })),
    },
    bestTime: clean(input.bestTime, serialized.bestTime),
    crowdLevel: normalizeCrowdLevel(input.crowdLevel),
    safety: normalizeSafety(input.safety),
    parking: booleanValue(input.parking, false),
    isPublished: booleanValue(input.isPublished, true),
  };
}

export async function createUniqueSlug(baseSlug: string, suffixSeed: string) {
  const cleanBase = slugify(baseSlug) || "hidden-space";
  let candidate = cleanBase;
  let counter = 2;

  while (await PlaceModel.exists({ slug: candidate })) {
    candidate = `${cleanBase}-${counter}`;
    counter += 1;

    if (counter > 50) {
      candidate = `${cleanBase}-${slugify(suffixSeed).slice(0, 8) || Date.now().toString(36)}`;
      if (!(await PlaceModel.exists({ slug: candidate }))) {
        break;
      }
    }
  }

  return candidate;
}

function getApprovalCoordinates(input: ApprovalPlaceInput, submission: SpotSubmission) {
  const parsedInput =
    parseCoordinatePair(input.coordinates) ??
    parseCoordinatePair(`${clean(input.lat, "")}, ${clean(input.lng, "")}`);
  const parsedMapsLink = parseCoordinatePair(submission.mapsLink);

  const lat =
    parsedInput?.lat ??
    numberValue(nestedValue(input.coordinates, "lat")) ??
    numberValue(input.lat) ??
    submission.coordinates?.lat ??
    parsedMapsLink?.lat;
  const lng =
    parsedInput?.lng ??
    numberValue(nestedValue(input.coordinates, "lng")) ??
    numberValue(input.lng) ??
    submission.coordinates?.lng ??
    parsedMapsLink?.lng;

  if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Valid latitude and longitude are required before publishing.");
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error("Coordinates are outside the valid latitude and longitude range.");
  }

  return { lat, lng };
}

function normalizeCoordinates(value: unknown) {
  if (!value || typeof value !== "object") return undefined;

  const lat = numberValue((value as Record<string, unknown>).lat);
  const lng = numberValue((value as Record<string, unknown>).lng);

  if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return undefined;
  }

  return { lat, lng };
}

function normalizeCategory(value: unknown): PlaceCategory {
  if (categories.includes(value as PlaceCategory)) {
    return value as PlaceCategory;
  }

  return "Peaceful";
}

function normalizeStatus(value: unknown): SubmissionStatus {
  if (value === "approved") return "approved";
  if (value === "rejected") return "rejected";
  return "pending";
}

function normalizeCrowdLevel(value: unknown): PlacePayload["crowdLevel"] {
  if (value === "Quiet" || value === "Gentle" || value === "Moderate" || value === "Busy at peaks") {
    return value;
  }

  return "Gentle";
}

function normalizeSafety(value: unknown): PlacePayload["safety"] {
  if (
    value === "Comfortable" ||
    value === "Stay aware" ||
    value === "Go before dark" ||
    value === "Local guidance suggested"
  ) {
    return value;
  }

  return "Comfortable";
}

function clean(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(number) ? number : undefined;
}

function booleanValue(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (["true", "yes", "1", "public"].includes(value.trim().toLowerCase())) return true;
    if (["false", "no", "0", "private"].includes(value.trim().toLowerCase())) return false;
  }
  return fallback;
}

function splitList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function nestedValue(value: unknown, key: string) {
  return value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined;
}

function dateToString(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return null;
}

function objectIdToString(value: unknown) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof mongoose.Types.ObjectId) return value.toString();
  if (typeof value === "object" && "toString" in value && typeof value.toString === "function") {
    return value.toString();
  }
  return null;
}
