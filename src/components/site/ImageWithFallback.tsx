"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { isDirectImageSrc } from "@/lib/images";

export function ImageWithFallback({
  src,
  alt,
  fallbackClassName,
  priority = false,
  sizes = "100vw",
  className = "",
  label,
  imagePosition = "center",
}: {
  src?: string | null;
  alt: string;
  fallbackClassName: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  label?: string;
  imagePosition?: string;
}) {
  const [failed, setFailed] = useState(false);
  const safeSrc = useMemo(() => (isDirectImageSrc(src) ? src : null), [src]);
  const showImage = Boolean(safeSrc) && !failed;

  return (
    <>
      {showImage ? (
        <Image
          src={safeSrc as string}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          onError={() => setFailed(true)}
          style={{ objectPosition: imagePosition }}
          className={`object-cover opacity-0 transition duration-700 [animation:image-fade-in_700ms_ease_forwards] ${className}`}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackClassName}`} aria-hidden="true" />
      )}
      {!showImage && label ? (
        <div className="absolute inset-0 grid place-items-center p-5 text-center">
          <div className="max-w-[18rem] rounded-[24px] border border-white/38 bg-[#FFFDF8]/28 px-5 py-4 text-[#FFFDF8] shadow-[0_18px_54px_rgba(22,32,42,0.16)] backdrop-blur-md">
            <p className="font-display text-3xl font-semibold leading-none tracking-[-0.04em]">{label}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
