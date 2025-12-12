import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { event } from '../lib/gtag';

export default function About() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unlocked Coding';

  // Track about page view
  useEffect(() => {
    event({
      action: 'page_view',
      category: 'About',
      label: 'About Page',
    });
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": "https://unlockedcoding.com",
    "logo": "https://unlockedcoding.com/images.png",
    "description": "Your gateway to mastering programming and technology. Learn, build, and grow with our comprehensive courses.",
    "sameAs": [
      "https://github.com/unlockedcoding",
      "https://twitter.com/unlockedcoding"
    ],
    "foundingDate": "2024",
    "mission": "To democratize programming education and make high-quality coding courses accessible to everyone",
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Programming Courses",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Data Structures and Algorithms",
            "description": "Master DSA with comprehensive video tutorials"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Web Development",
            "description": "Learn full-stack web development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "System Design",
            "description": "High-level and low-level system design concepts"
          }
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>About Us - {siteName}</title>
        <meta name="description" content={`Learn more about ${siteName} - Your gateway to mastering programming and technology. Discover our mission to democratize coding education.`} />
        <link rel="canonical" href="https://unlockedcoding.com/about" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`About Us - ${siteName}`} />
        <meta property="og:description" content={`Learn more about ${siteName} - Your gateway to mastering programming and technology. Discover our mission to democratize coding education.`} />
        <meta property="og:url" content="https://unlockedcoding.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`About Us - ${siteName}`} />
        <meta name="twitter:description" content={`Learn more about ${siteName} - Your gateway to mastering programming and technology. Discover our mission to democratize coding education.`} />
        
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
              About {siteName}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Your gateway to mastering programming and technology. Learn, build, and grow with our comprehensive courses.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-white/5 rounded-2xl p-8 sm:p-12 mb-12 sm:mb-16 border border-border/50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
                We believe that programming education should be accessible to everyone, regardless of their background or financial situation. Our platform provides high-quality, comprehensive coding courses from industry experts, completely free of charge.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in April 2024, Unlocked Coding emerged from a simple yet powerful vision: to democratize access to world-class programming education. 
                We recognized that traditional coding bootcamps and expensive courses were creating barriers for talented individuals who couldn't afford premium education. 
                Our solution was to curate the best programming content from top instructors and make it freely available to everyone.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we're proud to serve a thriving community of over 44,000 learners through our Telegram channel (t.me/unlocked_coding), 
                providing not just courses but also mentorship, career guidance, and a supportive learning environment that helps students succeed in their tech journey.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-card rounded-2xl p-8 sm:p-12 mb-12 sm:mb-16 border border-border">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Passionate educators and industry professionals dedicated to your success
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-white/5 rounded-xl p-8 border border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    U
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Unlocked</h3>
                    <p className="text-primary font-semibold mb-3">Founder & Lead Educator</p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      A passionate Computer Science student with 3 years of experience in software development and education. 
                      Unlocked founded this platform with the vision of making quality programming education accessible to everyone. 
                      With expertise in full-stack development and a deep understanding of industry requirements, 
                      Unlocked ensures that our curriculum stays current with the latest technologies and best practices.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="bg-gray-500/10 dark:bg-gray-400/10 text-foreground px-3 py-1 rounded-full text-sm">Full-Stack Development</span>
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">System Design</span>
                      <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-sm">Education</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl p-8 sm:p-12 mb-12 sm:mb-16 border border-border/50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
                Our Story
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Unlocked Coding began as a small Telegram channel in April 2024, created by a Computer Science student who was frustrated 
                  by the high cost of quality programming education. What started as a way to share free resources with fellow students 
                  quickly grew into a comprehensive platform serving thousands of learners worldwide.
                </p>
                <p>
                  The journey wasn't easy. Building a platform that could handle thousands of users while maintaining high-quality content 
                  required countless hours of work, learning, and iteration. But the vision was clear: create a place where anyone, 
                  regardless of their financial situation, could access world-class programming education.
                </p>
                <p>
                  Today, we're proud to have helped thousands of students land their dream jobs in tech companies, from startups to Fortune 500 companies. 
                  Our success stories include students who went from complete beginners to senior developers, all through our free courses and community support.
                </p>
                <p>
                  Located in New Delhi, India, our team operates from the 100xDev School building, where we continue to develop new courses, 
                  improve our platform, and support our growing community of learners. We believe that education is the key to unlocking potential, 
                  and we're committed to making that key accessible to everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 sm:mb-16">
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-500/10 dark:bg-gray-400/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Comprehensive Courses</h3>
              <p className="text-muted-foreground">
                From beginner-friendly introductions to advanced system design concepts, we cover all aspects of programming and software development.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Expert Instructors</h3>
              <p className="text-muted-foreground">
                Learn from industry professionals and experienced educators who bring real-world knowledge to every lesson.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">100% Free</h3>
              <p className="text-muted-foreground">
                All our courses are completely free. No hidden fees, no premium tiers - just quality education for everyone.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Self-Paced Learning</h3>
              <p className="text-muted-foreground">
                Learn at your own pace with our flexible course structure. Access content anytime, anywhere.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Hands-On Projects</h3>
              <p className="text-muted-foreground">
                Apply what you learn through practical projects and real-world applications that build your portfolio.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Community Support</h3>
              <p className="text-muted-foreground">
                Join a vibrant community of learners and get support from peers and instructors throughout your journey.
              </p>
            </div>
          </div>

          {/* Course Categories */}
          <div className="bg-card rounded-2xl p-8 sm:p-12 mb-12 sm:mb-16 border border-border">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Course Categories
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore our diverse range of programming and technology courses
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Data Structures & Algorithms',
                'Web Development',
                'System Design',
                'Machine Learning',
                'Mobile Development',
                'DevOps',
                'Cybersecurity',
                'Programming Languages'
              ].map((category, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4 text-center hover:bg-muted transition-colors">
                  <span className="text-sm font-medium text-foreground">{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 sm:mb-16">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">32+</div>
              <div className="text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">5,555+</div>
              <div className="text-muted-foreground">Video Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Free Access</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Available</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-white/10 rounded-2xl p-8 sm:p-12 border border-border/50">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already mastering programming with our comprehensive courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/r"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                onClick={() => event({
                  action: 'click',
                  category: 'CTA',
                  label: 'Browse Courses - About Page'
                })}
              >
                Browse Courses
              </Link>
              <Link
                href="/all"
                className="bg-muted text-foreground px-8 py-3 rounded-lg hover:bg-muted/80 transition-colors font-semibold"
                onClick={() => event({
                  action: 'click',
                  category: 'CTA',
                  label: 'View All Courses - About Page'
                })}
              >
                View All Courses
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
