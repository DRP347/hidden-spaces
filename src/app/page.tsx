import { HomeExperience } from "@/components/site/HomeExperience";
import { damanSpots, featuredSpots } from "@/data/spots";
import { createDestinationJsonLd, createItemListJsonLd } from "@/lib/site";

export default function Home() {
  const jsonLd = [createDestinationJsonLd(), createItemListJsonLd(featuredSpots)];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeExperience spots={damanSpots} />
    </>
  );
}
