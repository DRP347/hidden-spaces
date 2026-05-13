import {
  placeCategories,
  type CrowdLevel,
  type Place,
  type PlaceCategory,
  type PlaceImage,
  type PlaceVisibility,
  type SafetyLevel,
} from "@/types/placeTypes";

export const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=900&q=82";

const crowdLevels: CrowdLevel[] = ["Quiet", "Gentle", "Moderate", "Busy at peaks"];
const safetyLevels: SafetyLevel[] = [
  "Comfortable",
  "Stay aware",
  "Go before dark",
  "Local guidance suggested",
];
const visibilityOptions: PlaceVisibility[] = ["Public", "Private"];

export type PlacePayload = {
  name: string;
  slug: string;
  area: string;
  category: PlaceCategory;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  tags: string[];
  notes: string;
  images: {
    cover: ImageAsset;
    gallery: ImageAsset[];
  };
  bestTime: string;
  crowdLevel: CrowdLevel;
  safety: SafetyLevel;
  parking: boolean;
  isPublished: boolean;
};

export type ImageAsset = {
  url: string;
  publicId: string;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function mapsUrl(place: Pick<Place, "coordinates">) {
  const query = `${place.coordinates.lat},${place.coordinates.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function parseCoordinatePair(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const input = value.trim();

  if (!input) {
    return null;
  }

  const dmsMatches = [...input.matchAll(dmsCoordinatePattern)];

  if (dmsMatches.length >= 2) {
    let lat: number | null = null;
    let lng: number | null = null;

    for (const match of dmsMatches) {
      const parsed = dmsMatchToDecimal(match);

      if (!parsed) continue;
      if ((parsed.direction === "N" || parsed.direction === "S") && lat === null) {
        lat = parsed.value;
      }
      if ((parsed.direction === "E" || parsed.direction === "W") && lng === null) {
        lng = parsed.value;
      }
    }

    if (lat !== null && lng !== null && isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  const numbers = input.match(/[+-]?\d+(?:\.\d+)?/g)?.map(Number) ?? [];

  if (numbers.length >= 2 && isValidLatLng(numbers[0], numbers[1])) {
    return { lat: numbers[0], lng: numbers[1] };
  }

  return null;
}

export function createImage(url: string, seed: string, alt: string): PlaceImage {
  const safeUrl = url.trim() || DEFAULT_IMAGE_URL;

  return {
    url: safeUrl,
    publicId: seed.startsWith("hidden-spaces-daman/") ? seed : `hidden-spaces-daman/${seed}`,
    alt: alt.trim() || "Hidden space in Daman",
    width: 1200,
    height: 900,
  };
}

export function sanitizePlacePayload(input: unknown): PlacePayload {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid place payload.");
  }

  const record = input as Record<string, unknown>;
  const name = stringField(record.name, "Place name");
  const slug = slugify(stringField(record.slug, "Slug", slugify(name))) || slugify(name);
  const area = stringField(record.area, "Area", "Daman");
  const category = enumField<PlaceCategory>(
    record.category,
    placeCategories,
    "Category",
    "Peaceful",
  );
  const parsedCoordinates =
    parseCoordinatePair(record.coordinates) ??
    parseCoordinatePair(record.location) ??
    parseCoordinatePair(record.coordinateString) ??
    parseCoordinatePair(record.coordinatesText);
  const lat = parsedCoordinates
    ? parsedCoordinates.lat
    : coordinateField(nestedNumber(record.coordinates, "lat") ?? record.lat, "Latitude");
  const lng = parsedCoordinates
    ? parsedCoordinates.lng
    : coordinateField(nestedNumber(record.coordinates, "lng") ?? record.lng, "Longitude");

  if (!isValidLatLng(lat, lng)) {
    throw new Error("Coordinates are outside the valid latitude and longitude range.");
  }

  const description = stringField(record.description, "Description");
  const bestTime = stringField(record.bestTime, "Best time", "");
  const crowdLevel = enumField<CrowdLevel>(
    record.crowdLevel,
    crowdLevels,
    "Crowd level",
    "Gentle",
  );
  const safety = enumField<SafetyLevel>(
    record.safety ?? record.safetyLevel,
    safetyLevels,
    "Safety level",
    "Comfortable",
  );
  const visibility = enumField<PlaceVisibility>(
    record.visibility,
    visibilityOptions,
    "Visibility",
    "Public",
  );
  const tags = stringArray(record.tags);
  const notes = stringField(record.notes, "Notes", "");
  const coverImage = imageAssetField(
    nestedValue(record.images, "cover") ??
      record.coverImage ??
      record.coverImageUrl ??
      record.imageUrl ??
      record.cover,
    "Cover image",
    `${slug}/cover`,
  );
  const galleryImages = imageAssetArray(
    nestedValue(record.images, "gallery") ?? record.gallery ?? record.galleryUrls,
    slug,
  );
  const gallery = uniqueImageAssets([coverImage, ...galleryImages]).slice(0, 8);

  return {
    slug,
    name,
    area,
    category,
    coordinates: { lat, lng },
    description,
    tags,
    notes,
    images: {
      cover: coverImage,
      gallery,
    },
    bestTime,
    crowdLevel,
    safety,
    parking: booleanField(record.parking),
    isPublished: booleanField(record.isPublished, visibility === "Public"),
  };
}

export function placeToFormPayload(place: Place): PlacePayload {
  return {
    slug: place.slug,
    name: place.name,
    area: place.area,
    category: place.category,
    coordinates: place.coordinates,
    description: place.description,
    notes: place.notes,
    images: {
      cover: {
        url: place.coverImage.url,
        publicId: place.coverImage.publicId,
      },
      gallery: place.gallery.map((image) => ({
        url: image.url,
        publicId: image.publicId,
      })),
    },
    tags: place.tags,
    bestTime: place.bestTime,
    crowdLevel: place.crowdLevel,
    safety: place.safetyLevel,
    parking: !place.parking.toLowerCase().includes("no reliable"),
    isPublished: place.visibility === "Public",
  };
}

function stringField(value: unknown, label: string, fallback?: string) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`${label} is required.`);
}

function numberField(value: unknown, label: string) {
  const numberValue =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;

  if (!Number.isFinite(numberValue)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return numberValue;
}

function coordinateField(value: unknown, label: "Latitude" | "Longitude") {
  if (typeof value === "string") {
    const parsed = parseSingleCoordinate(value);

    if (parsed !== null) {
      return parsed;
    }
  }

  return numberField(value, label);
}

const dmsCoordinatePattern =
  /([+-]?\d+(?:\.\d+)?)\s*(?:°|deg|d)?\s*(?:(\d+(?:\.\d+)?)\s*(?:'|’|′|m|min)?)?\s*(?:(\d+(?:\.\d+)?)\s*(?:"|”|″|s|sec)?)?\s*([NSEW])/gi;

function parseSingleCoordinate(value: string) {
  const input = value.trim();
  const match = [...input.matchAll(dmsCoordinatePattern)][0];

  if (match) {
    return dmsMatchToDecimal(match)?.value ?? null;
  }

  const numberValue = Number(input);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function dmsMatchToDecimal(match: RegExpMatchArray) {
  const degrees = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const seconds = match[3] ? Number(match[3]) : 0;
  const direction = match[4]?.toUpperCase();

  if (
    !Number.isFinite(degrees) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds) ||
    !direction
  ) {
    return null;
  }

  const sign = direction === "S" || direction === "W" || degrees < 0 ? -1 : 1;
  const value = sign * (Math.abs(degrees) + minutes / 60 + seconds / 3600);

  return { direction, value };
}

function isValidLatLng(lat: number, lng: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function nestedNumber(value: unknown, key: "lat" | "lng") {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  return (value as Record<string, unknown>)[key];
}

function nestedString(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const nestedValue = (value as Record<string, unknown>)[key];
  return typeof nestedValue === "string" ? nestedValue : undefined;
}

function nestedValue(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  return (value as Record<string, unknown>)[key];
}

function nestedArray(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const nestedValue = (value as Record<string, unknown>)[key];
  return Array.isArray(nestedValue) ? nestedValue : undefined;
}

function enumField<T extends string>(
  value: unknown,
  options: readonly T[],
  label: string,
  fallback?: T,
) {
  if (typeof value === "string" && options.includes(value as T)) {
    return value as T;
  }

  if (fallback) {
    return fallback;
  }

  throw new Error(`${label} is invalid.`);
}

function stringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function imageAssetField(value: unknown, label: string, fallbackSeed: string): ImageAsset {
  if (typeof value === "string") {
    const url = value.trim() || DEFAULT_IMAGE_URL;

    return {
      url,
      publicId: url === DEFAULT_IMAGE_URL ? `hidden-spaces-daman/${fallbackSeed}` : "",
    };
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const url = stringField(record.url, label, DEFAULT_IMAGE_URL);
    const publicId =
      typeof record.publicId === "string"
        ? record.publicId.trim()
        : typeof record.public_id === "string"
          ? record.public_id.trim()
          : "";

    return { url, publicId };
  }

  return {
    url: DEFAULT_IMAGE_URL,
    publicId: `hidden-spaces-daman/${fallbackSeed}`,
  };
}

function imageAssetArray(value: unknown, slug: string) {
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      imageAssetField(item, `Gallery image ${index + 1}`, `${slug}/gallery-${index + 1}`),
    );
  }

  return stringArray(value).map((url, index) =>
    imageAssetField(url, `Gallery image ${index + 1}`, `${slug}/gallery-${index + 1}`),
  );
}

function booleanField(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "yes", "available", "public", "1"].includes(normalized)) {
      return true;
    }

    if (["false", "no", "private", "0"].includes(normalized)) {
      return false;
    }

    return !normalized.includes("no reliable") && !normalized.includes("not available");
  }

  return fallback;
}

function uniqueImageAssets(values: ImageAsset[]) {
  const seen = new Set<string>();

  return values.filter((image) => {
    const key = image.url.trim();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
