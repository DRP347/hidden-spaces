import "leaflet/dist/leaflet.css";
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hidden Spaces Daman",
  description:
    "A cinematic map for discovering quiet, underrated, and local-only spaces in Daman.",
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
