export const placeCategories = [
  "Sunset",
  "Peaceful",
  "Cafés",
  "Photo Spots",
  "Beaches",
  "Heritage",
  "Food",
  "Hidden Lanes",
] as const;

export type PlaceCategory = (typeof placeCategories)[number];

export type CrowdLevel = "Quiet" | "Gentle" | "Moderate" | "Busy at peaks";

export type SafetyLevel =
  | "Comfortable"
  | "Stay aware"
  | "Go before dark"
  | "Local guidance suggested";

export type PlaceVisibility = "Public" | "Private";

export type PlaceImage = {
  url: string;
  publicId: string;
  alt: string;
  width: number;
  height: number;
};

export type Place = {
  id: string;
  slug: string;
  name: string;
  category: PlaceCategory;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  coverImage: PlaceImage;
  image: PlaceImage;
  gallery: PlaceImage[];
  tags: string[];
  bestTime: string;
  crowdLevel: CrowdLevel;
  safetyLevel: SafetyLevel;
  parking: string;
  visibility: PlaceVisibility;
  notes: string;
  nearbySlugs: string[];
};

export type NewPlaceDraft = {
  name: string;
  category: PlaceCategory;
  coordinates: string;
  description: string;
  bestTime: string;
  crowdLevel: CrowdLevel;
  safetyLevel: SafetyLevel;
  parking: boolean;
  imageUrl: string;
  notes: string;
  visibility: PlaceVisibility;
};
