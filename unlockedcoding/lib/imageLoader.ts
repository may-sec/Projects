/**
 * Custom image loader utility for Next.js Image component
 * Handles URL normalization and error handling
 */

export interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Normalize image URLs to fix common issues like double slashes
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Fix double slashes in URLs (except after protocol)
    const normalized = url.replace(/([^:]\/)\/+/g, '$1');
    
    // Validate URL format
    new URL(normalized);
    
    return normalized;
  } catch (error) {
    console.warn('Invalid image URL:', url, error);
    return url; // Return original if normalization fails
  }
}

/**
 * Custom image loader for Next.js Image component
 * Handles image optimization and URL normalization
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Normalize the source URL
  const normalizedSrc = normalizeImageUrl(src);
  
  // In development, bypass optimization to prevent 400 errors
  if (process.env.NODE_ENV === 'development') {
    return normalizedSrc;
  }
  
  // In production, use Next.js image optimization
  const params = new URLSearchParams();
  params.set('url', normalizedSrc);
  params.set('w', width.toString());
  params.set('q', (quality || 75).toString());
  
  return `/_next/image?${params.toString()}`;
}

/**
 * Get a fallback image URL for error cases
 */
export function getFallbackImage(type: 'course' | 'teacher' | 'blog' = 'course'): string {
  const fallbacks = {
    course: '/images/course-placeholder.png',
    teacher: '/images/teacher-placeholder.png',
    blog: '/images/blog-placeholder.png',
  };
  
  return fallbacks[type] || fallbacks.course;
}

/**
 * Validate if an image URL is accessible
 * Returns true if valid, false otherwise
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const normalizedUrl = normalizeImageUrl(url);
    const response = await fetch(normalizedUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Image validation failed:', url, error);
    return false;
  }
}

