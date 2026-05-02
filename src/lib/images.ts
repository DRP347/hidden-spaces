const directImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

export function isDirectImageSrc(src?: string | null) {
  if (!src) return false;

  const trimmed = src.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("/")) return true;

  try {
    const url = new URL(trimmed);
    const pathname = url.pathname.toLowerCase();
    return directImageExtensions.some((extension) => pathname.endsWith(extension));
  } catch {
    return false;
  }
}

export function getSpotImageSrc({
  imageSrc,
  image,
}: {
  imageSrc?: string;
  image?: {
    src: string;
    alt: string;
  };
}) {
  if (isDirectImageSrc(imageSrc)) return imageSrc;
  if (isDirectImageSrc(image?.src)) return image?.src;
  return null;
}
