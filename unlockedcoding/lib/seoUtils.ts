// SEO utilities for crawler detection and hybrid pagination

export function isCrawler(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: assume it's a crawler for SSR
    return true;
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  const crawlerPatterns = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    'applebot',
    'crawler',
    'spider',
    'bot'
  ];
  
  return crawlerPatterns.some(pattern => userAgent.includes(pattern));
}

export function shouldUsePagination(): boolean {
  // Use pagination for crawlers and when JavaScript is disabled
  return isCrawler() || typeof window === 'undefined';
}

// SEO utility functions
export function normalizeUrl(url: string): string {
  // Remove double slashes and normalize URL
  return url.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

export function generateCanonicalUrl(baseUrl: string, path: string): string {
  const cleanPath = normalizeUrl(path);
  return `${baseUrl}${cleanPath}`;
}

export function generateMetaRobots(index: boolean = true, follow: boolean = true): string {
  const directives = [];
  if (index) directives.push('index');
  else directives.push('noindex');
  if (follow) directives.push('follow');
  else directives.push('nofollow');
  return directives.join(', ');
}

export function generateStructuredData(type: 'Course' | 'CollectionPage' | 'Organization', data: any) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
  
  return baseStructuredData;
}

export function validateCanonicalUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateOpenGraphData(title: string, description: string, url: string, image?: string) {
  return {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:type': 'website',
    'og:site_name': 'Unlocked Coding',
    ...(image && { 'og:image': image })
  };
}

export function generateTwitterCardData(title: string, description: string, image?: string) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    ...(image && { 'twitter:image': image })
  };
}