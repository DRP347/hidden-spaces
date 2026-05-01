import type { Spot } from "@/types/spot";

export function getGoogleMapsUrl(spot: Pick<Spot, "coordinates" | "name">) {
  const query = `${spot.name} ${spot.coordinates.lat},${spot.coordinates.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getCategoryCounts(spots: Spot[]) {
  return spots.reduce<Record<string, number>>(
    (counts, spot) => ({
      ...counts,
      [spot.category]: (counts[spot.category] ?? 0) + 1,
    }),
    { All: spots.length },
  );
}

export function createItemListJsonLd(spots: Spot[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hidden places in Daman",
    itemListElement: spots.map((spot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TouristAttraction",
        name: spot.name,
        description: spot.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: spot.area,
          addressRegion: "Daman",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: spot.coordinates.lat,
          longitude: spot.coordinates.lng,
        },
      },
    })),
  };
}

export function createDestinationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Hidden Spaces Daman",
    description:
      "A local field guide to Daman's quiet beaches, Portuguese heritage lanes, peaceful cafés, sunset points, food corners, and hidden local spaces.",
    touristType: ["Local travellers", "Weekend visitors", "Photo walkers", "Heritage explorers"],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.3974,
      longitude: 72.8328,
    },
    containedInPlace: {
      "@type": "Place",
      name: "Daman, India",
    },
  };
}
