import type { Place } from "@/types/placeTypes";

export function hasValidCoordinates(place: Place) {
  const { lat, lng } = place.coordinates;

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function getValidPlaces(places: Place[]) {
  return places.filter(hasValidCoordinates);
}

export function debugPlaces(places: Place[]) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  places.forEach((place) => {
    if (!hasValidCoordinates(place)) {
      console.warn("[Hidden Spaces] Invalid place coordinates skipped:", {
        id: place.id,
        name: place.name,
        coordinates: place.coordinates,
      });
    }

  });
}
