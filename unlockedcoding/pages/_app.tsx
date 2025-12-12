import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'
import CookieConsent from '../components/CookieConsent'
import ErrorBoundary from '../components/ErrorBoundary'
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/images.png" />
        <link rel="shortcut icon" type="image/png" href="/images.png" />
        <link rel="apple-touch-icon" href="/images.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images.png" />
        <meta name="msapplication-TileImage" content="/images.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      {/* AdSense script removed - no ad units currently on site */}
      
      {/* Google Analytics - Delayed loading for better mobile performance */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-N90CFT21QV"
        strategy="lazyOnload"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N90CFT21QV');
          `,
        }}
      />
      
      {/* Microsoft Clarity - Delayed loading for better mobile performance */}
      <Script
        id="microsoft-clarity"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tmn2bh7zw9");
          `,
        }}
      />
      
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <Component {...pageProps} />
            <CookieConsent />
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
      <Analytics />
    </>
  )
}
