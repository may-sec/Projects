import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { event } from '../lib/gtag';

export default function CookiePolicy() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unlocked Coding';

  // Track cookie policy page view
  useEffect(() => {
    event({
      action: 'page_view',
      category: 'Legal',
      label: 'Cookie Policy Page',
    });
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Cookie Policy",
    "description": "Learn about how we use cookies and similar technologies on our website.",
    "url": "https://unlockedcoding.com/cookie-policy",
    "isPartOf": {
      "@type": "WebSite",
      "name": siteName,
      "url": "https://unlockedcoding.com"
    }
  };

  return (
    <>
      <Head>
        <title>Cookie Policy - {siteName}</title>
        <meta name="description" content={`Cookie Policy for ${siteName}. Learn about how we use cookies and similar technologies on our website.`} />
        <link rel="canonical" href="https://unlockedcoding.com/cookie-policy" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`Cookie Policy - ${siteName}`} />
        <meta property="og:description" content={`Cookie Policy for ${siteName}. Learn about how we use cookies and similar technologies.`} />
        <meta property="og:url" content="https://unlockedcoding.com/cookie-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Cookie Policy - ${siteName}`} />
        <meta name="twitter:description" content={`Cookie Policy for ${siteName}. Learn about how we use cookies and similar technologies.`} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg">
              Last Updated: January 15, 2025
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
              <p className="text-muted-foreground">
                Cookies allow a website to recognize a user's device and remember information about their visit, such as their preferred language and other settings. This can make your next visit easier and the site more useful to you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. How We Use Cookies</h2>
              <p className="text-muted-foreground">
                {siteName} uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly and cannot be disabled</li>
                <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website</li>
                <li><strong>Functional Cookies:</strong> These cookies enable enhanced functionality and personalization</li>
                <li><strong>Advertising Cookies:</strong> These cookies are used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Types of Cookies We Use</h2>
              
              <div className="bg-card rounded-lg p-6 border border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Essential Cookies</h3>
                <p className="text-muted-foreground mb-3">
                  These cookies are strictly necessary for the operation of our website. They include:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Session cookies that keep you logged in</li>
                  <li>Security cookies that protect against cross-site request forgery</li>
                  <li>Load balancing cookies that ensure website performance</li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Cookies</h3>
                <p className="text-muted-foreground mb-3">
                  We use Google Analytics to understand how our website is used. These cookies collect information such as:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Pages visited and time spent on each page</li>
                  <li>How you arrived at our website</li>
                  <li>Your general location (country/city level)</li>
                  <li>Device and browser information</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  This information is anonymized and helps us improve our website's performance and user experience.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Functional Cookies</h3>
                <p className="text-muted-foreground mb-3">
                  These cookies enable enhanced functionality and personalization, such as:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Remembering your language preferences</li>
                  <li>Storing your theme preferences (dark/light mode)</li>
                  <li>Remembering your course progress</li>
                  <li>Personalizing content recommendations</li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Advertising Cookies</h3>
                <p className="text-muted-foreground mb-3">
                  We use Google AdSense to display relevant advertisements. These cookies:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Track your interests to show relevant ads</li>
                  <li>Prevent the same ad from being shown repeatedly</li>
                  <li>Measure the effectiveness of advertising campaigns</li>
                  <li>Help us provide free content by supporting our site</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                Our website may contain content from third-party services that set their own cookies. These include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Google AdSense:</strong> For displaying relevant advertisements</li>
                <li><strong>YouTube:</strong> For embedded video content</li>
                <li><strong>Social Media Platforms:</strong> For social sharing buttons and widgets</li>
              </ul>
              <p className="text-muted-foreground">
                These third-party services have their own privacy policies and cookie practices. We recommend reviewing their policies for more information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Managing Your Cookie Preferences</h2>
              <p className="text-muted-foreground">
                You have several options for managing cookies:
              </p>
              
              <div className="bg-card rounded-lg p-6 border border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Browser Settings</h3>
                <p className="text-muted-foreground mb-3">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Block all cookies</li>
                  <li>Allow only first-party cookies</li>
                  <li>Delete existing cookies</li>
                  <li>Set cookies to expire when you close your browser</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Please note that blocking cookies may affect the functionality of our website.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Opt-Out Options</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-muted-foreground mb-2">
                      <strong>Google Analytics:</strong> You can opt out of Google Analytics tracking by installing the 
                      <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                        Google Analytics Opt-out Browser Add-on
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">
                      <strong>Google AdSense:</strong> You can opt out of personalized advertising by visiting 
                      <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                        Google Ads Settings
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      <strong>Digital Advertising Alliance:</strong> You can opt out of interest-based advertising from participating companies at 
                      <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                        www.aboutads.info/choices
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Cookie Duration</h2>
              <p className="text-muted-foreground">
                Cookies can be either "session" cookies or "persistent" cookies:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them</li>
              </ul>
              <p className="text-muted-foreground">
                The duration of persistent cookies varies depending on their purpose. Analytics cookies typically last for 2 years, while functional cookies may last for 1 year or until you change your preferences.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Updates to This Cookie Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-muted-foreground">
                We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies and similar technologies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Cookie Policy or our use of cookies, please contact us:
              </p>
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Get in Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-background" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Telegram Support</p>
                      <a 
                        href="https://t.me/un_devs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        @un_devs
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for any questions about cookies or privacy.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
}
