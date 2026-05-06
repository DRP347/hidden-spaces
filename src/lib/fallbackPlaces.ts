import { fallbackSpots } from "@/data/spots";
import type { Place, PlaceCategory, PlaceImage } from "@/types/placeTypes";
import type { Spot, SpotCategory } from "@/types/spot";

export function getFallbackPlaces(): Place[] {
  return fallbackSpots.map(spotToFallbackPlace);
}

function spotToFallbackPlace(spot: Spot): Place {
  const coverImage = spotToPlaceImage(spot);

  return {
    id: spot.id,
    slug: spot.slug,
    name: spot.name,
    category: toPlaceCategory(spot.category),
    coordinates: spot.coordinates,
    description: spot.description,
    coverImage,
    image: coverImage,
    gallery: [coverImage],
    tags: spot.tags,
    bestTime: spot.bestTime,
    crowdLevel: "Gentle",
    safetyLevel: "Comfortable",
    parking: spot.nearbyHint || "Use the map pin to plan the closest approach.",
    visibility: "Public",
    notes: spot.longDescription || spot.travelTip || "",
    nearbySlugs: [],
  };
}

function spotToPlaceImage(spot: Spot): PlaceImage {
  return {
    url: spot.imageSrc ?? "",
    publicId: `hidden-spaces-daman/fallback/${spot.slug}`,
    alt: spot.imageAlt || `${spot.name} in Daman`,
    width: 1200,
    height: 900,
  };
}

function toPlaceCategory(category: SpotCategory): PlaceCategory {
  return category;
}
