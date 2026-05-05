import { getFallbackPlaces } from "@/lib/fallbackPlaces";
import {
  createMongoStatus,
  getMongoStatus,
  resetDatabaseConnection,
  type DataSource,
  type MongoErrorType,
  type MongoStatus,
} from "@/lib/mongodb";
import { createImage, DEFAULT_IMAGE_URL, type ImageAsset } from "@/lib/placeUtils";
import { PlaceModel } from "@/models/Place";
import type {
  CrowdLevel,
  Place,
  PlaceCategory,
  SafetyLevel,
} from "@/types/placeTypes";

type DatabasePlaceRecord = {
  _id?: unknown;
  id?: unknown;
  slug?: string;
  name?: string;
  category?: PlaceCategory;
  coordinates?: Place["coordinates"] | null;
  description?: string;
  images?: Record<string, unknown> | null;
  coverImage?: Place["coverImage"];
  image?: Place["image"];
  gallery?: Place["gallery"];
  tags?: string[];
  bestTime?: string;
  crowdLevel?: Place["crowdLevel"];
  safety?: SafetyLevel;
  safetyLevel?: SafetyLevel;
  parking?: boolean | string;
  isPublished?: boolean;
  visibility?: Place["visibility"];
  notes?: string;
  nearbySlugs?: string[];
};

export type PlacesResult = {
  source: DataSource;
  places: Place[];
  mongoConfigured: boolean;
  dbStatus: MongoStatus;
  fallbackReason?: MongoErrorType;
};

export async function listPlaces({ includePrivate = false } = {}): Promise<PlacesResult> {
  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return placesFallbackResult(dbStatus, includePrivate);
  }

  try {
    const docs = await PlaceModel.find({}).sort({ updatedAt: -1, name: 1 }).lean();
    const places = docs
      .map(toPlace)
      .filter((place) => includePrivate || place.visibility === "Public");

    return {
      source: "database",
      mongoConfigured: true,
      dbStatus,
      places,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] MongoDB listPlaces failed:", getSafeErrorName(error));
    }

    await resetDatabaseConnection();
    return placesFallbackResult(createMongoStatus(error, "fallback"), includePrivate);
  }
}

export async function findPlace(id: string) {
  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return getFallbackPlace(id);
  }

  try {
    const query = isObjectIdLike(id) ? { _id: id } : { slug: id };
    const doc = await PlaceModel.findOne(query).lean();

    return doc ? toPlace(doc) : null;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] MongoDB findPlace failed:", getSafeErrorName(error));
    }

    await resetDatabaseConnection();
    return getFallbackPlace(id);
  }
}

export function toPlace(record: DatabasePlaceRecord): Place {
  const fallback = getFallbackPlaces()[0];
  const id =
    typeof record.id === "string"
      ? record.id
      : objectIdToString(record._id) ?? record.slug ?? fallback.id;
  const slug = record.slug ?? id;
  const name = record.name ?? "Untitled place";
  const legacyCover = record.coverImage ?? record.image;
  const coverAsset = normalizeImageAsset(record.images?.cover, legacyCover, fallback.coverImage);
  const coverUrl = coverAsset.url;
  const galleryValue = record.images?.gallery;
  const galleryItems = Array.isArray(galleryValue) ? galleryValue : [];
  const galleryUrls = galleryItems.length
    ? galleryItems
    : record.gallery?.length
      ? record.gallery
      : [coverAsset];
  const coverImage = createImage(coverUrl, coverAsset.publicId || `${slug}/cover`, `${name} in Daman`);
  const gallery = galleryUrls.map((image, index) =>
    assetToPlaceImage(image, `${slug}/gallery-${index + 1}`, `${name} gallery image ${index + 1}`),
  );
  const parkingLabel =
    typeof record.parking === "string"
      ? record.parking
      : record.parking
        ? "Parking is available nearby."
        : "No reliable parking nearby.";

  return {
    id,
    slug,
    name,
    category: normalizeCategory(record.category),
    coordinates: record.coordinates ?? fallback.coordinates,
    description: record.description ?? "",
    coverImage,
    image: coverImage,
    gallery,
    tags: record.tags ?? [],
    bestTime: record.bestTime ?? "",
    crowdLevel: normalizeCrowdLevel(record.crowdLevel),
    safetyLevel: normalizeSafetyLevel(record.safety ?? record.safetyLevel),
    parking: parkingLabel,
    visibility:
      record.visibility ?? (record.isPublished === false ? "Private" : "Public"),
    notes: record.notes ?? "",
    nearbySlugs: record.nearbySlugs ?? [],
  };
}

function placesFallbackResult(dbStatus: MongoStatus, includePrivate: boolean): PlacesResult {
  const places = getFallbackPlaces().filter(
    (place) => includePrivate || place.visibility === "Public",
  );

  return {
    source: "fallback",
    places,
    mongoConfigured: dbStatus.configured,
    dbStatus: {
      ...dbStatus,
      source: "fallback",
    },
    fallbackReason: dbStatus.errorType,
  };
}

function getFallbackPlace(id: string) {
  return getFallbackPlaces().find((place) => place.id === id || place.slug === id) ?? null;
}

function objectIdToString(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    "toString" in value &&
    typeof value.toString === "function"
  ) {
    return value.toString();
  }

  return null;
}

function isObjectIdLike(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

function assetToPlaceImage(value: unknown, seed: string, alt: string) {
  if (typeof value === "string") {
    return createImage(value, seed, alt);
  }

  if (value && typeof value === "object" && "url" in value) {
    const record = value as { url?: string; publicId?: string; public_id?: string };

    return createImage(record.url ?? DEFAULT_IMAGE_URL, record.publicId ?? record.public_id ?? seed, alt);
  }

  return createImage(DEFAULT_IMAGE_URL, seed, alt);
}

function normalizeImageAsset(
  value: unknown,
  legacy: Place["coverImage"] | undefined,
  fallback: Place["coverImage"],
): ImageAsset {
  if (typeof value === "string") {
    return {
      url: value.trim() || DEFAULT_IMAGE_URL,
      publicId: "",
    };
  }

  if (value && typeof value === "object" && "url" in value) {
    const record = value as { url?: unknown; publicId?: unknown; public_id?: unknown };

    return {
      url: typeof record.url === "string" && record.url.trim() ? record.url : DEFAULT_IMAGE_URL,
      publicId:
        typeof record.publicId === "string"
          ? record.publicId
          : typeof record.public_id === "string"
            ? record.public_id
            : "",
    };
  }

  if (legacy) {
    return {
      url: legacy.url,
      publicId: legacy.publicId,
    };
  }

  return {
    url: fallback.url,
    publicId: fallback.publicId,
  };
}

function normalizeCategory(value: unknown): PlaceCategory {
  if (value === "Sunset") return "Sunset";
  if (value === "Peaceful") return "Peaceful";
  if (value === "Cafés") return "Cafés";
  if (value === "Photo Spots") return "Photo Spots";
  if (value === "Beaches") return "Beaches";
  if (value === "Heritage") return "Heritage";
  if (value === "Food") return "Food";
  if (value === "Hidden Lanes") return "Hidden Lanes";

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized.includes("cafe") || normalized.includes("café")) return "Cafés";
    if (normalized.includes("food") || normalized.includes("falooda")) return "Food";
    if (normalized.includes("sunrise") || normalized.includes("sunset")) return "Sunset";
    if (normalized.includes("photo")) return "Photo Spots";
    if (normalized.includes("beach")) return "Beaches";
    if (normalized.includes("fort") || normalized.includes("chapel")) return "Heritage";
    if (normalized.includes("hidden") || normalized.includes("lane")) return "Hidden Lanes";
  }

  return "Peaceful";
}

function normalizeCrowdLevel(value: unknown): CrowdLevel {
  if (value === "Quiet") return "Quiet";
  if (value === "Gentle") return "Gentle";
  if (value === "Moderate") return "Moderate";
  if (value === "Busy at peaks") return "Busy at peaks";

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "low" || normalized.includes("quiet")) return "Quiet";
    if (normalized === "medium" || normalized.includes("moderate")) return "Moderate";
    if (normalized.includes("busy") || normalized.includes("high")) return "Busy at peaks";
  }

  return "Gentle";
}

function normalizeSafetyLevel(value: unknown): SafetyLevel {
  if (value === "Comfortable") return "Comfortable";
  if (value === "Stay aware") return "Stay aware";
  if (value === "Go before dark") return "Go before dark";
  if (value === "Local guidance suggested") return "Local guidance suggested";

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "safe" || normalized.includes("comfort")) return "Comfortable";
    if (normalized === "moderate" || normalized.includes("aware")) return "Stay aware";
    if (normalized.includes("dark")) return "Go before dark";
    if (normalized.includes("local")) return "Local guidance suggested";
  }

  return "Comfortable";
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unknown database error";
  }

  const name = "name" in error ? String(error.name) : "DatabaseError";
  return name;
}
