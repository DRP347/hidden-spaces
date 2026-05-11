import "leaflet/dist/leaflet.css";
import "./globals.css";

import type { Metadata } from "next";

import { defaultOgImage, getCanonicalUrl, siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hidden Spaces Daman | Quiet Beaches, Hidden Places & Local Field Notes",
    template: "%s | Hidden Spaces Daman",
  },
  description:
    "Discover quiet beaches, old lanes, cafés, sunrise spots, sunset corners, and local hidden places around Daman.",
  keywords: [
    "hidden places in Daman",
    "Daman travel guide",
    "quiet beaches in Daman",
    "Daman cafés",
    "Moti Daman",
    "Nani Daman",
    "Daman sunset points",
    "Daman hidden gems",
    "Portuguese heritage Daman",
    "Daman sunrise spots",
    "Daman local guide",
  ],
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    title: "Hidden Spaces Daman | Quiet Beaches, Hidden Places & Local Field Notes",
    description:
      "Discover quiet beaches, old lanes, cafés, sunrise spots, sunset corners, and local hidden places around Daman.",
    url: getCanonicalUrl("/"),
    siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Hidden Spaces Daman local field map preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hidden Spaces Daman | Quiet Beaches, Hidden Places & Local Field Notes",
    description:
      "Discover quiet beaches, old lanes, cafés, sunrise spots, sunset corners, and local hidden places around Daman.",
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
