import { ImageWithFallback } from "@/components/site/ImageWithFallback";
import { getSpotImageSrc } from "@/lib/images";
import type { Spot } from "@/types/spot";

export function SpotVisual({
  spot,
  priority = false,
  className = "",
  showBadge = true,
  showOverlay = true,
}: {
  spot: Spot;
  priority?: boolean;
  className?: string;
  showBadge?: boolean;
  showOverlay?: boolean;
}) {
  const imageSrc = getSpotImageSrc(spot);
  const imageAlt = spot.imageAlt || spot.image?.alt || `${spot.name} in Daman`;
  const fallback = spot.gradientFallback || spot.gradient;

  return (
    <div className={`group relative h-full w-full overflow-hidden bg-[#EADDC8] ${className}`}>
      <ImageWithFallback
        src={imageSrc}
        alt={imageAlt}
        fallbackClassName={fallback}
        priority={priority}
        sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
        label={!imageSrc ? spot.area : undefined}
        imagePosition={spot.imageFocus}
        className="transition duration-700 group-hover:scale-[1.04]"
      />
      {showOverlay ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,253,248,0.32),transparent_30%),linear-gradient(180deg,rgba(21,21,21,0.02),rgba(21,21,21,0.28))]" />
      ) : null}
      {showBadge ? (
        <div className="absolute left-4 top-4 rounded-full bg-[#FFFDF8]/88 px-3 py-1 text-xs font-bold text-[#151515] shadow-sm ring-1 ring-white/60 backdrop-blur">
          {spot.category}
        </div>
      ) : null}
    </div>
  );
}
