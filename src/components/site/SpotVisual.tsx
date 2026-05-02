import { ImageWithFallback } from "@/components/site/ImageWithFallback";
import { getSpotImageSrc } from "@/lib/images";
import type { Spot } from "@/types/spot";

export function SpotVisual({
  spot,
  priority = false,
  className = "",
}: {
  spot: Spot;
  priority?: boolean;
  className?: string;
}) {
  const imageSrc = getSpotImageSrc(spot);
  const imageAlt = spot.imageAlt || spot.image?.alt || `${spot.name} in Daman`;
  const fallback = spot.gradientFallback || spot.gradient;

  return (
    <div className={`group relative overflow-hidden bg-[#EADDC8] ${className}`}>
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,253,248,0.58),transparent_28%),linear-gradient(180deg,rgba(21,21,21,0.02),rgba(21,21,21,0.5))]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:7px_7px]" />
      <div className="absolute left-4 top-4 rounded-full bg-[#FFFDF8]/88 px-3 py-1 text-xs font-bold text-[#151515] shadow-sm ring-1 ring-white/60 backdrop-blur">
        {spot.category}
      </div>
    </div>
  );
}
