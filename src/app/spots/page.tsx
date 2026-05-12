import type { Metadata } from "next";

import { SpotsDirectory } from "@/components/site/SpotsDirectory";
import { getPublicSpots } from "@/lib/publicSpots";
import { createItemListJsonLd } from "@/lib/site";
import { defaultOgImage, getCanonicalUrl, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "All field notes",
  description:
    "Browse all quiet beaches, old lanes, cafés, sunrise spots, sunset corners, and hidden places around Daman.",
  alternates: {
    canonical: getCanonicalUrl("/spots"),
  },
  openGraph: {
    title: "All field notes | Hidden Spaces Daman",
    description:
      "Browse all quiet beaches, old lanes, cafés, sunrise spots, sunset corners, and hidden places around Daman.",
    url: getCanonicalUrl("/spots"),
    siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Hidden Spaces Daman field notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All field notes | Hidden Spaces Daman",
    description:
      "Browse all quiet beaches, old lanes, cafés, sunrise spots, sunset corners, and hidden places around Daman.",
    images: [defaultOgImage],
  },
};

export default async function SpotsPage() {
  const result = await getPublicSpots();
  const spots = result.spots;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createItemListJsonLd(spots)) }}
      />
      <SpotsDirectory spots={spots} />
    </>
  );
}
