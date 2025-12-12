import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import Layout from '../../components/Layout';
import { event } from '../../lib/gtag';
import { IBlogPost, loadBlogPosts } from '../../lib/dataUtils';

interface BlogProps {
  posts: IBlogPost[];
}

export default function Blog({ posts }: BlogProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unlocked Coding';

  // Track blog page view
  useEffect(() => {
    event({
      action: 'page_view',
      category: 'Blog',
      label: 'Blog Page',
    });
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": `${siteName} Blog`,
    "description": "Educational guides, tutorials, and resources for students and developers. Learn about free tools, student programs, and developer resources.",
    "url": "https://unlockedcoding.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "url": "https://unlockedcoding.com"
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.name,
      "description": post.description,
      "image": post.image,
      "datePublished": new Date().toISOString(),
      "url": `https://unlockedcoding.com/blog/${post.id}`
    }))
  };

  return (
    <>
      <Head>
        <title>Blog - Student Resources & Developer Guides | {siteName}</title>
        <meta name="description" content="Discover free student resources, developer tools, and educational guides. Learn about GitHub Student Pack, JetBrains licenses, cloud credits, and more." />
        <link rel="canonical" href="https://unlockedcoding.com/blog" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`Blog - Student Resources & Developer Guides | ${siteName}`} />
        <meta property="og:description" content="Discover free student resources, developer tools, and educational guides for students and developers." />
        <meta property="og:url" content="https://unlockedcoding.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Blog - Student Resources & Developer Guides | ${siteName}`} />
        <meta name="twitter:description" content="Discover free student resources, developer tools, and educational guides." />
        
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
              Student Resources Blog
            </h1>
          </div>

          {/* All Posts */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <Link 
                    href={`/blog/${post.id}`}
                    className="block"
                    onClick={() => event({
                      action: 'click',
                      category: 'Blog',
                      label: `Blog Post - ${post.name}`
                    })}
                  >
                    <div className="relative">
                      <img 
                        src={post.image} 
                        alt={post.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        {post.difficulty && (
                          <span className="bg-yellow-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {post.difficulty}
                          </span>
                        )}
                        {post.featured && (
                          <span className="bg-purple-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="p-6 flex-1 flex flex-col">
                    <Link 
                      href={`/blog/${post.id}`}
                      onClick={() => event({
                        action: 'click',
                        category: 'Blog',
                        label: `Blog Post - ${post.name}`
                      })}
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {post.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                      {post.description}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-muted-foreground">
                      {post.readingTime && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {post.readingTime}
                        </div>
                      )}
                      {post.estimatedTime && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.estimatedTime}
                        </div>
                      )}
                      {post.lastUpdated && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          {new Date(post.lastUpdated).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {/* Requirements Preview */}
                    {post.requirements && post.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Requirements:
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {post.requirements.slice(0, 3).map((req, index) => (
                            <span key={index} className="bg-muted/80 text-muted-foreground px-2 py-1 rounded-md text-xs">
                              {req}
                            </span>
                          ))}
                          {post.requirements.length > 3 && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                              +{post.requirements.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Benefits Preview */}
                    {post.benefits && post.benefits.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                          <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Key Benefits:
                        </h4>
                        <ul className="space-y-1">
                          {post.benefits.slice(0, 2).map((benefit, index) => (
                            <li key={index} className="text-xs text-muted-foreground line-clamp-1 flex items-start gap-1.5">
                              <span className="text-green-500 mt-0.5">•</span>
                              {benefit}
                            </li>
                          ))}
                          {post.benefits.length > 2 && (
                            <li className="text-xs text-primary font-medium">
                              +{post.benefits.length - 2} more benefits
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Use Cases Preview */}
                    {post.useCases && post.useCases.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                          <svg className="w-3 h-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Use Cases:
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {post.useCases.slice(0, 2).map((useCase, index) => (
                            <span key={index} className="bg-gray-500/10 dark:bg-gray-400/10 text-foreground px-2 py-1 rounded-md text-xs line-clamp-1">
                              {useCase}
                            </span>
                          ))}
                          {post.useCases.length > 2 && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                              +{post.useCases.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* YouTube Link */}
                    {post.youtubeTutorialLink && (
                      <div className="mb-4">
                        <a
                          href={post.youtubeTutorialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-xs font-medium w-full justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            event({
                              action: 'click',
                              category: 'Blog',
                              label: `YouTube Tutorial - ${post.name}`
                            });
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          Watch Tutorial Video
                        </a>
                      </div>
                    )}

                    {/* Links Preview */}
                    {post.links && post.links.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-foreground mb-2">Quick Links:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {post.links.slice(0, 2).map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                event({
                                  action: 'click',
                                  category: 'Blog',
                                  label: `External Link - ${link.name}`
                                });
                              }}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {link.name.length > 20 ? link.name.substring(0, 20) + '...' : link.name}
                            </a>
                          ))}
                          {post.links.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{post.links.length - 2} more links
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 4 && (
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                            +{post.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Author */}
                    {post.author && (
                      <div className="mt-auto pt-4 border-t border-border flex items-center gap-2">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs text-muted-foreground">By {post.author}</span>
                      </div>
                    )}

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${post.id}`}
                      className="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold w-full"
                      onClick={() => event({
                        action: 'click',
                        category: 'Blog',
                        label: `Read More - ${post.name}`
                      })}
                    >
                      Read Full Article
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-white/10 rounded-2xl p-8 sm:p-12 border border-border/50">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Stay Updated
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get the latest student resources, developer tools, and educational guides delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  onClick={() => event({
                    action: 'click',
                    category: 'Newsletter',
                    label: 'Subscribe Button'
                  })}
                >
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Join our community of 44,000+ learners
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const posts = loadBlogPosts();

    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.error('Error loading blog data:', error);

    return {
      props: {
        posts: [],
      },
    };
  }
}
