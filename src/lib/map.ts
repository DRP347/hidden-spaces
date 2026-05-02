import type { Spot, SpotCategory } from "@/types/spot";

export const DAMAN_CENTER: [number, number] = [20.409, 72.832];

export const categoryColors: Record<SpotCategory, string> = {
  Sunset: "#D99A3D",
  Peaceful: "#8FA382",
  Cafés: "#9B7B55",
  "Photo Spots": "#25313D",
  Beaches: "#4F8FA8",
  Heritage: "#9E3F2F",
  Food: "#395B45",
  "Hidden Lanes": "#1E4E8C",
};

export function getSpotAccent(spot: Pick<Spot, "category">) {
  return categoryColors[spot.category] ?? "#D99A3D";
}

export function isValidSpotCoordinate(spot: Pick<Spot, "coordinates">) {
  const { lat, lng } = spot.coordinates;
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
