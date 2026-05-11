import type { Metadata } from "next";

import { getSpotImageSrc } from "@/lib/images";
import type { Spot } from "@/types/spot";

export const siteUrl = "https://hidden-spaces.vercel.app";
export const siteName = "Hidden Spaces Daman";
export const defaultOgImage = "/opengraph-image";

export function getCanonicalUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function getAbsoluteImageUrl(src?: string | null) {
  if (!src) return getCanonicalUrl(defaultOgImage);

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return getCanonicalUrl(src);
}

export function getSpotUrl(spot: Pick<Spot, "slug">) {
  return getCanonicalUrl(`/spots/${spot.slug}`);
}

export function createSpotMetadata(spot: Spot): Metadata {
  const title = `${spot.name} | Hidden Spaces Daman`;
  const description = spot.description || `A local field note for ${spot.name} in Daman.`;
  const image = getAbsoluteImageUrl(getSpotImageSrc(spot));
  const url = getSpotUrl(spot);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "en_IN",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: spot.imageAlt || `${spot.name} in Daman`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
