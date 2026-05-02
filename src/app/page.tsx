import { HomeExperience } from "@/components/site/HomeExperience";
import { damanSpots } from "@/data/spots";
import { listPlaces } from "@/lib/placeRepository";
import { createDestinationJsonLd, createItemListJsonLd } from "@/lib/site";
import { placesToSpots } from "@/lib/spotAdapter";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await listPlaces();
  const spots =
    result.source === "mongodb"
      ? placesToSpots(result.places)
      : result.places.length
        ? placesToSpots(result.places)
        : damanSpots;
  const featuredSpots = spots.filter((spot) => spot.isFeatured);
  const jsonLd = [createDestinationJsonLd(), createItemListJsonLd(featuredSpots)];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeExperience spots={spots} />
    </>
  );
}
