import type { PlaceCategory } from "@/types/placeTypes";

type CategoryMeta = {
  accent: string;
  tint: string;
  label: PlaceCategory;
};

export const categoryMeta: Record<PlaceCategory, CategoryMeta> = {
  Sunset: {
    label: "Sunset",
    accent: "#B96F4A",
    tint: "rgba(185, 111, 74, 0.16)",
  },
  Peaceful: {
    label: "Peaceful",
    accent: "#8FA382",
    tint: "rgba(143, 163, 130, 0.18)",
  },
  Cafés: {
    label: "Cafés",
    accent: "#C79A52",
    tint: "rgba(199, 154, 82, 0.18)",
  },
  "Photo Spots": {
    label: "Photo Spots",
    accent: "#247B75",
    tint: "rgba(36, 123, 117, 0.16)",
  },
  Beaches: {
    label: "Beaches",
    accent: "#4F8FA8",
    tint: "rgba(79, 143, 168, 0.16)",
  },
  Heritage: {
    label: "Heritage",
    accent: "#9B6A45",
    tint: "rgba(155, 106, 69, 0.16)",
  },
  Food: {
    label: "Food",
    accent: "#D28B5B",
    tint: "rgba(210, 139, 91, 0.18)",
  },
  "Hidden Lanes": {
    label: "Hidden Lanes",
    accent: "#6C7A89",
    tint: "rgba(108, 122, 137, 0.16)",
  },
};
