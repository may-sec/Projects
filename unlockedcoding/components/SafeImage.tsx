import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { normalizeImageUrl, getFallbackImage } from '../lib/imageLoader';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackType?: 'course' | 'teacher' | 'blog';
  fallbackSrc?: string;
}

/**
 * SafeImage component that wraps Next.js Image with error handling
 * Automatically handles broken images and URL normalization
 */
export default function SafeImage({
  src,
  alt,
  fallbackType = 'course',
  fallbackSrc,
  ...props
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(normalizeImageUrl(src) || getFallbackImage(fallbackType));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = fallbackSrc || getFallbackImage(fallbackType);
      setImageSrc(fallback);
      console.warn(`Failed to load image: ${src}, using fallback: ${fallback}`);
    }
  };

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={handleError}
    />
  );
}

