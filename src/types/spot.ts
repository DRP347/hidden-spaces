export const spotCategories = [
  "Sunset",
  "Peaceful Cafés",
  "Photo Spots",
  "Beaches",
  "Heritage",
  "Food",
  "Hidden Lanes",
] as const;

export type SpotCategory = (typeof spotCategories)[number];

export type Spot = {
  id: string;
  name: string;
  slug: string;
  category: SpotCategory;
  area: string;
  description: string;
  longDescription: string;
  bestTime: string;
  mood: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: {
    src: string;
    alt: string;
  };
  gradient: string;
  travelTip: string;
  nearbyHint: string;
  isFeatured: boolean;
};
