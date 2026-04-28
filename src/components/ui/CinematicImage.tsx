"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type CinematicImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function CinematicImage({
  src,
  alt,
  sizes,
  className = "",
  imageClassName = "",
  priority = false,
}: CinematicImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      {!hasError ? (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.03 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            unoptimized
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(false);
              setHasError(true);
            }}
            className={`object-cover ${imageClassName}`}
          />
        </motion.div>
      ) : null}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,253,247,0.72),transparent_30%),linear-gradient(135deg,rgba(226,210,184,0.82),rgba(111,166,161,0.28))]"
        animate={{ opacity: loaded && !hasError ? 0 : 1 }}
        transition={{ duration: 0.45 }}
      />
      {hasError ? (
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink/56">
            Image unavailable
          </span>
        </div>
      ) : null}
    </div>
  );
}
