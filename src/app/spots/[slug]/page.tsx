import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Compass, ExternalLink, MapPin } from "lucide-react";

import { ShareButtons } from "@/components/share/ShareButtons";
import { SpotVisual } from "@/components/site/SpotVisual";
import { getSpotImageSrc } from "@/lib/images";
import { getPublicSpots } from "@/lib/publicSpots";
import { createSpotMetadata, getAbsoluteImageUrl, getSpotUrl, siteName } from "@/lib/seo";
import { getGoogleMapsUrl } from "@/lib/site";
import type { Spot } from "@/types/spot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SpotPageProps = {
  params: Promise<{ slug: string }>;
};

async function getSpot(slug: string) {
  const result = await getPublicSpots();
  return result.spots.find((spot) => spot.slug === slug) ?? null;
}

export async function generateMetadata({ params }: SpotPageProps): Promise<Metadata> {
  const { slug } = await params;
  const spot = await getSpot(slug);

  if (!spot) {
    return {
      title: "Spot not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return createSpotMetadata(spot);
}

export default async function SpotPage({ params }: SpotPageProps) {
  const { slug } = await params;
  const spot = await getSpot(slug);

  if (!spot) {
    notFound();
  }

  const jsonLd = [
    createSpotJsonLd(spot),
    createBreadcrumbJsonLd(spot),
  ];

  return (
    <main className="min-h-screen bg-[#F5EFE6] px-4 py-5 text-[#151515] sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl">
        <Link
          href="/#spots"
          className="secondary-button mb-4 w-fit bg-white/60 px-4 text-[#5d5143]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to map
        </Link>

        <article className="overflow-hidden rounded-[32px] bg-[#FFFDF8] shadow-[0_24px_90px_rgba(75,55,29,0.12)] ring-1 ring-[#eadcc8]">
          <div className="relative aspect-[16/10] max-h-[440px] sm:aspect-[16/8]">
            <SpotVisual spot={spot} priority className="h-full" />
          </div>
          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_320px] lg:gap-8">
            <div>
              <p className="text-sm font-bold text-[#9E3F2F]">{spot.category} · {spot.area}</p>
              <h1 className="mt-2 max-w-3xl text-balance font-display text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                {spot.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#5b4f42] sm:text-lg">
                {spot.longDescription || spot.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoCard icon={<Clock3 className="h-4 w-4" />} label="Best time" value={spot.bestTime} />
                <InfoCard icon={<Compass className="h-4 w-4" />} label="Mood" value={spot.mood} />
                <InfoCard icon={<MapPin className="h-4 w-4" />} label="Area" value={spot.area} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Note title="Travel tip" text={spot.travelTip} />
                <Note title="Nearby hint" text={spot.nearbyHint} />
              </div>
            </div>

            <aside className="h-fit rounded-[26px] border border-[#eadcc8] bg-[#F8F1E7] p-4">
              <p className="text-sm font-bold text-[#151515]">Share this field note</p>
              <ShareButtons title={spot.name} url={getSpotUrl(spot)} className="mt-3" />

              <div className="mt-5 flex flex-wrap gap-2">
                {spot.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#EFF4EF] px-3 py-1.5 text-xs font-semibold text-[#4d6d62]">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={getGoogleMapsUrl(spot)}
                target="_blank"
                rel="noreferrer"
                className="primary-button mt-5 w-full"
              >
                Open in Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F5EFE6] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8a785e]">
        {icon}
        {label}
      </div>
      <p className="text-sm font-bold text-[#151515]">{value || "Local timing varies"}</p>
    </div>
  );
}

function Note({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#eadcc8] bg-white p-4">
      <h2 className="text-sm font-bold text-[#151515]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#5d5143]">{text}</p>
    </div>
  );
}

function createSpotJsonLd(spot: Spot) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: spot.name,
    description: spot.description,
    url: getSpotUrl(spot),
    image: getAbsoluteImageUrl(getSpotImageSrc(spot)),
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
  };
}

function createBreadcrumbJsonLd(spot: Spot) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteName,
        item: "https://hidden-spaces.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: spot.name,
        item: getSpotUrl(spot),
      },
    ],
  };
}
