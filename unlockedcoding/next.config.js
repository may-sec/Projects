/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  
  // Performance optimizations
  compress: true,
  
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  
  // Use modern JS output for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache for static assets
    remotePatterns: [
      // ImageBB/ImgBB
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.imgbb.com',
      },
      // KAXA/CDN Domains
      {
        protocol: 'https',
        hostname: 'appxcontent.kaxa.in',
      },
      {
        protocol: 'https',
        hostname: 'appx-content-v2.classx.co.in',
      },
      {
        protocol: 'https',
        hostname: 'appx-wsb-gcp-mcdn.akamai.net.in',
      },
      // YouTube Images
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Teacher Profile Images
      {
        protocol: 'https',
        hostname: 'static.takeuforward.org',
      },
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pathfinder.edu.in',
      },
      {
        protocol: 'https',
        hostname: 'bs-uploads.toptal.io',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      // Other Course/Content Domains
      {
        protocol: 'https',
        hostname: 'codeforsuccess.in',
      },
      {
        protocol: 'https',
        hostname: 'unlockedcoding.com',
      },
      // Blog Images (Unsplash)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // CloudFront CDN
      {
        protocol: 'https',
        hostname: 'do6gp1uxl3luu.cloudfront.net',
      },
      // Educosys Course Images
      {
        protocol: 'https',
        hostname: 'www.educosys.com',
      },
      {
        protocol: 'https',
        hostname: 'educosys.com',
      },
      // DigitalOcean Spaces CDN
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'codewithharry.nyc3.cdn.digitaloceanspaces.com',
      },
      // Globayouth (with proper URL handling)
      {
        protocol: 'https',
        hostname: 'www.globayouth.in',
      },
      {
        protocol: 'https',
        hostname: 'globayouth.in',
      },
    ],
    // Disable image optimization for development to prevent 400 errors
    unoptimized: process.env.NODE_ENV === 'development',
    // Add dangerouslyAllowSVG for SVG support
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Custom loader for better error handling
    loader: process.env.NODE_ENV === 'development' ? 'default' : 'default',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable source maps in development to prevent HMR issues
      config.devtool = false;
    } else {
      // Enable source maps for production debugging
      config.devtool = 'source-map';
    }
    
    if (!dev && !isServer) {
      // Optimize chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://*.clarity.ms https://www.google-analytics.com https://www.gstatic.com https://va.vercel-scripts.com https://fast.wistia.com https://*.wistia.com https://*.wistia.net https://browser.sentry-cdn.com https://*.sentry-cdn.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.wistia.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://*.ibb.co https://va.vercel-scripts.com https://appx-transcoded-videos-mcdn.akamai.net.in https://appx-recordings-mcdn.akamai.net.in https://transcoded-videos-v2.classx.co.in https://*.akamai.net.in https://*.classx.co.in https://*.wistia.com https://*.wistia.net http://pipedream.wistia.com https://pipedream.wistia.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://fast.wistia.com https://*.wistia.com",
              "media-src 'self' https: blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
