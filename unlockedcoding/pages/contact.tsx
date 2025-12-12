import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { event } from '../lib/gtag';

export default function Contact() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unlocked Coding';

  // Track contact page view
  useEffect(() => {
    event({
      action: 'page_view',
      category: 'Contact',
      label: 'Contact Page',
    });
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us",
    "url": "https://unlockedcoding.com/contact",
    "description": "Get in touch with Unlocked Coding team for support, questions, or feedback about our programming courses.",
    "mainEntity": {
      "@type": "Organization",
      "name": siteName,
      "url": "https://unlockedcoding.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi"],
        "areaServed": "Worldwide"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "House No 38, Block 4 Moti Nagar, Ramesh Nagar",
        "addressLocality": "New Delhi West",
        "postalCode": "110051",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - {siteName}</title>
        <meta name="description" content={`Contact ${siteName} for support, questions, or feedback about our programming courses. Get help with your learning journey.`} />
        <link rel="canonical" href="https://unlockedcoding.com/contact" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`Contact Us - ${siteName}`} />
        <meta property="og:description" content={`Contact ${siteName} for support, questions, or feedback about our programming courses.`} />
        <meta property="og:url" content="https://unlockedcoding.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Contact Us - ${siteName}`} />
        <meta name="twitter:description" content={`Contact ${siteName} for support, questions, or feedback about our programming courses.`} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We're here to help you succeed in your programming journey. Get in touch with our team for support, questions, or feedback.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 sm:mb-16">
            {/* Primary Contact - Telegram */}
            <div className="bg-gradient-to-br from-gray-500/5 via-purple-500/5 to-white/5 rounded-2xl p-8 sm:p-12 border border-border/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-500/10 dark:bg-gray-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.121.57-.44.71-.89.44l-2.46-1.81-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.56 4.57-4.13c.2-.18-.04-.28-.31-.1l-5.64 3.55-2.43-.76c-.53-.16-.54-.53.11-.79l9.52-3.67c.44-.16.83.1.69.79z"/>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Telegram Support
                </h2>
                <p className="text-muted-foreground mb-6">
                  Get instant help and connect with our community. Our team responds within 24 hours.
                </p>
                <div className="space-y-4">
                  <a
                    href="https://t.me/un_devs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-foreground text-background px-8 py-4 rounded-lg hover:opacity-90 transition-colors font-semibold text-lg"
                    onClick={() => event({
                      action: 'click',
                      category: 'Contact',
                      label: 'Telegram Support Link'
                    })}
                  >
                    Contact Support Team
                  </a>
                  <a
                    href="https://t.me/unlocked_chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-100 dark:bg-gray-800 text-foreground px-8 py-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-semibold"
                    onClick={() => event({
                      action: 'click',
                      category: 'Contact',
                      label: 'Telegram Community Link'
                    })}
                  >
                    Join Community Chat
                  </a>
                </div>
                <div className="mt-6 text-sm text-muted-foreground">
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                  <p><strong>Languages:</strong> English & Hindi</p>
                </div>
              </div>
            </div>

            {/* Physical Address */}
            <div className="bg-card rounded-2xl p-8 sm:p-12 border border-border">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Our Office
                </h2>
                <p className="text-muted-foreground mb-6">
                  Visit our office for in-person support and consultations.
                </p>
                <div className="text-left bg-muted/50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Address:</h3>
                      <p className="text-muted-foreground">
                        House No 38, Block 4 Moti Nagar<br />
                        Ramesh Nagar<br />
                        New Delhi West - 110051<br />
                        India
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Building:</h3>
                      <p className="text-muted-foreground">
                        100xDev School Building<br />
                        Top Floor
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Office Hours:</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-2xl p-8 sm:p-12 mb-12 sm:mb-16 border border-border">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How quickly do you respond?</h3>
                  <p className="text-muted-foreground">We typically respond to all inquiries within 24 hours during business days.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Do you offer technical support?</h3>
                  <p className="text-muted-foreground">Yes! Our team provides technical support for all course-related questions and issues.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Can I visit your office?</h3>
                  <p className="text-muted-foreground">Absolutely! We welcome visitors during office hours. Please contact us first to schedule a visit.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What languages do you support?</h3>
                  <p className="text-muted-foreground">We provide support in both English and Hindi to serve our diverse community.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How can I report issues?</h3>
                  <p className="text-muted-foreground">Use our Telegram support channel for quick issue reporting and resolution.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Do you offer career guidance?</h3>
                  <p className="text-muted-foreground">Yes! Our team provides career guidance and mentorship for programming students.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 sm:mb-16">
            {/* Email Support */}
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Send us an email for detailed inquiries</p>
              <a 
                href="mailto:unlockedcoding@gmail.com"
                className="text-primary hover:underline text-sm font-medium"
                onClick={() => event({
                  action: 'click',
                  category: 'Contact',
                  label: 'Email Support'
                })}
              >
                unlockedcoding@gmail.com
              </a>
            </div>

            {/* Social Media */}
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Follow Us</h3>
              <p className="text-sm text-muted-foreground mb-4">Stay connected on social media</p>
              <div className="flex justify-center gap-3">
                <a 
                  href="https://t.me/unlocked_coding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:opacity-80 transition-opacity"
                  onClick={() => event({
                    action: 'click',
                    category: 'Contact',
                    label: 'Telegram Channel'
                  })}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.121.57-.44.71-.89.44l-2.46-1.81-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.56 4.57-4.13c.2-.18-.04-.28-.31-.1l-5.64 3.55-2.43-.76c-.53-.16-.54-.53.11-.79l9.52-3.67c.44-.16.83.1.69.79z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Business Hours</h3>
              <p className="text-sm text-muted-foreground mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-sm text-muted-foreground mb-2">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-sm text-muted-foreground">Sunday: Closed</p>
            </div>
          </div>

          {/* Support Types */}
          <div className="bg-card rounded-2xl p-8 sm:p-12 mb-12 sm:mb-16 border border-border">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How We Can Help You
              </h2>
              <p className="text-lg text-muted-foreground">
                Our support team assists with various aspects of your learning journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 bg-gray-500/10 dark:bg-gray-400/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Course Help</h3>
                <p className="text-sm text-muted-foreground">Get assistance with course content and assignments</p>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Technical Issues</h3>
                <p className="text-sm text-muted-foreground">Resolve platform and access problems</p>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Career Guidance</h3>
                <p className="text-sm text-muted-foreground">Get advice on career paths and opportunities</p>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">General Inquiries</h3>
                <p className="text-sm text-muted-foreground">Ask questions about our platform and services</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-r from-gray-500/10 via-purple-500/10 to-white/10 rounded-2xl p-8 sm:p-12 border border-border/50">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                About Our Support
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                At Unlocked Coding, we believe in providing exceptional support to help you succeed in your programming journey. 
                Our dedicated team of experienced developers and educators is committed to answering your questions, 
                resolving technical issues, and providing guidance throughout your learning process.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-500/10 dark:bg-gray-400/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">24-hour response guarantee</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Expert Support</h3>
                  <p className="text-sm text-muted-foreground">Industry professionals</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
                  <p className="text-sm text-muted-foreground">Peer support network</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">44,000+</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Free Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
