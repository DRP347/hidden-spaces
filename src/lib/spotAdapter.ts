import type { Place, PlaceCategory } from "@/types/placeTypes";
import type { Spot, SpotCategory } from "@/types/spot";

const categoryFallbacks: Record<SpotCategory, string> = {
  Sunset: "from-[#D99A3D] via-[#B96F4A] to-[#1E4E8C]",
  Peaceful: "from-[#395B45] via-[#8FA382] to-[#EADDC8]",
  Cafés: "from-[#EADDC8] via-[#C79A52] to-[#395B45]",
  "Photo Spots": "from-[#FFFDF8] via-[#4F8FA8] to-[#1E4E8C]",
  Beaches: "from-[#4F8FA8] via-[#E2D2B8] to-[#8FA382]",
  Heritage: "from-[#9E3F2F] via-[#C79A52] to-[#395B45]",
  Food: "from-[#D99A3D] via-[#9E3F2F] to-[#395B45]",
  "Hidden Lanes": "from-[#EADDC8] via-[#C79A52] to-[#1E4E8C]",
};

export function placesToSpots(places: Place[]): Spot[] {
  return places.map((place, index) => placeToSpot(place, index));
}

export function placeToSpot(place: Place, index = 0): Spot {
  const category = toSpotCategory(place.category);
  const imageSrc = place.coverImage?.url || place.image?.url || "";
  const imageAlt =
    place.coverImage?.alt ||
    place.image?.alt ||
    `${place.name} hidden space in Daman`;
  const tags = place.tags.length ? place.tags : [category.toLowerCase()];
  const bestTime = place.bestTime || "A quieter hour of the day";
  const notes = place.notes?.trim();

  return {
    id: place.id,
    slug: place.slug,
    name: place.name,
    category,
    area: inferArea(place),
    description: place.description,
    longDescription: notes || place.description,
    bestTime,
    mood: `${place.crowdLevel.toLowerCase()}, ${place.safetyLevel.toLowerCase()}`,
    tags,
    coordinates: place.coordinates,
    imageSrc,
    imageAlt,
    imageFocus: "center",
    gradientFallback: categoryFallbacks[category],
    gradient: categoryFallbacks[category],
    travelTip: notes || `Best visited around ${bestTime.toLowerCase()}.`,
    nearbyHint: place.parking || "Use the map pin to plan the closest approach.",
    isFeatured: index < 6,
  };
}

function toSpotCategory(category: PlaceCategory): SpotCategory {
  return category;
}

function inferArea(place: Place) {
  const haystack = `${place.name} ${place.slug} ${place.description}`.toLowerCase();

  if (haystack.includes("moti")) return "Moti Daman";
  if (haystack.includes("nani") || haystack.includes("jetty")) return "Nani Daman";
  if (haystack.includes("devka")) return "Devka";
  if (haystack.includes("jampore")) return "Jampore";
  if (haystack.includes("lighthouse") || haystack.includes("chapel") || haystack.includes("fort")) {
    return "Moti Daman";
  }

  return "Daman";
}
