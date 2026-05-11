import type { MetadataRoute } from "next";

import { getPublicSpots } from "@/lib/publicSpots";
import { getCanonicalUrl, getSpotUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const result = await getPublicSpots();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: getCanonicalUrl("/submit"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const spotRoutes: MetadataRoute.Sitemap = result.spots.map((spot) => ({
    url: getSpotUrl(spot),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...spotRoutes];
}
