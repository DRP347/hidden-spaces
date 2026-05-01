import "leaflet/dist/leaflet.css";
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://hidden-spaces.vercel.app"),
  title: {
    default: "Hidden Spaces Daman | Quiet Beaches, Forts, Cafés & Local Gems",
    template: "%s | Hidden Spaces Daman",
  },
  description:
    "Discover Daman’s hidden beaches, Portuguese heritage lanes, peaceful cafés, sunset points, food corners, and local field notes.",
  keywords: [
    "Daman travel guide",
    "hidden places in Daman",
    "Daman beaches",
    "Nani Daman",
    "Moti Daman",
    "Daman cafés",
    "Daman sunset points",
    "Portuguese heritage Daman",
  ],
  openGraph: {
    title: "Hidden Spaces Daman",
    description:
      "Quiet beaches, old Portuguese lanes, peaceful cafés, sunset points, food corners, and local Daman field notes.",
    url: "https://hidden-spaces.vercel.app",
    siteName: "Hidden Spaces Daman",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hidden Spaces Daman",
    description:
      "A calm local field guide to Daman’s hidden beaches, forts, cafés, food spots, and golden-hour corners.",
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
