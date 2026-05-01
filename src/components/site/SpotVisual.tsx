import Image from "next/image";

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
  return (
    <div className={`group relative overflow-hidden bg-[#EADDC8] ${className}`}>
      {spot.image ? (
        <Image
          src={spot.image.src}
          alt={spot.image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${spot.gradient}`} />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,253,248,0.7),transparent_28%),linear-gradient(180deg,transparent,rgba(21,21,21,0.48))]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:7px_7px]" />
      <div className="absolute left-4 top-4 rounded-full bg-[#FFFDF8]/88 px-3 py-1 text-xs font-bold text-[#151515] shadow-sm backdrop-blur">
        {spot.category}
      </div>
    </div>
  );
}
