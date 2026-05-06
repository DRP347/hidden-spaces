import { HomeExperience } from "@/components/site/HomeExperience";
import { getPublicSpots } from "@/lib/publicSpots";
import { createDestinationJsonLd, createItemListJsonLd } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const result = await getPublicSpots();
  const spots = result.spots;
  const featuredSpots = spots.filter((spot) => spot.isFeatured);
  const jsonLd = [createDestinationJsonLd(), createItemListJsonLd(featuredSpots)];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeExperience
        spots={spots}
        dataStatus={{
          source: result.source,
          count: result.count,
          dbStatus: result.dbStatus,
          notice: process.env.NODE_ENV !== "production" ? result.notice : null,
        }}
      />
    </>
  );
}
