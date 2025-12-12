import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { ICategory } from '../../lib/dataUtils';
import { getAllCategories } from '../../lib/dataUtils';

interface CategoriesPageProps {
  categories: ICategory[];
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  // Sort categories: non-zero courses first (descending), then zero courses
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.totalcourse === 0 && b.totalcourse === 0) return 0;
    if (a.totalcourse === 0) return 1;
    if (b.totalcourse === 0) return -1;
    return b.totalcourse - a.totalcourse;
  });

  // Calculate statistics
  const totalCourses = categories.reduce((sum, cat) => sum + cat.totalcourse, 0);
  const categoriesWithCourses = categories.filter(cat => cat.totalcourse > 0).length;
  const topCategory = sortedCategories.find(cat => cat.totalcourse > 0);
  const averageCoursesPerCategory = categoriesWithCourses > 0 
    ? Math.round(totalCourses / categoriesWithCourses) 
    : 0;

  return (
    <>
      <Head>
        <title>All Course Categories | Unlocked Coding</title>
        <meta name="description" content={`Browse ${categories.length} categories of free programming courses including web development, DSA, system design, machine learning, and more.`} />
        <link rel="canonical" href="https://unlockedcoding.com/r" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="All Course Categories | Unlocked Coding" />
        <meta property="og:description" content="Browse all programming course categories. Find the perfect course to advance your skills." />
        <meta property="og:url" content="https://unlockedcoding.com/r" />
        <meta property="og:type" content="website" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Programming Course Categories",
              "description": `Browse ${categories.length} categories of free programming courses`,
              "url": "https://unlockedcoding.com/r",
              "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": categories.length,
                "itemListElement": sortedCategories.map((category, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Course",
                    "name": category.category,
                    "description": category.des,
                    "url": `https://unlockedcoding.com/r/${category.category.toLowerCase()}`
                  }
                }))
              }
            })
          }}
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Course Categories
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Explore {categories.length} specialized categories of free programming courses. 
              From web development to machine learning, find the perfect learning path for your career goals.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{totalCourses}+</div>
                <div className="text-sm text-muted-foreground">Total Courses</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{categoriesWithCourses}</div>
                <div className="text-sm text-muted-foreground">Active Categories</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{averageCoursesPerCategory}</div>
                <div className="text-sm text-muted-foreground">Avg per Category</div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedCategories.map((category) => (
                <div 
                  key={category.category}
                  className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border group"
                >
                  <Link 
                    href={`/r/${category.category.toLowerCase()}`}
                    className="block"
                  >
                    <div className="relative">
                      <img 
                        src={category.imageofcategory} 
                        alt={category.category}
                        className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-card-foreground capitalize mb-2 group-hover:text-primary transition-colors">
                      {category.category.replace(/-/g, ' ')}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                      {category.des}
                    </p>
                    
                    {/* Category-specific information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span>{category.totalcourse} {category.totalcourse === 1 ? 'course' : 'courses'} available</span>
                        </div>
                        {category.totalcourse > 0 && (
                          <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Self-paced learning</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Industry-relevant skills</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Free access forever</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {category.totalcourse} courses
                      </span>
                      <Link 
                        href={`/r/${category.category.toLowerCase()}`}
                        className="text-xs sm:text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Explore Courses
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories Section */}
          {topCategory && (
            <div className="mb-8 sm:mb-12 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-white/10 rounded-2xl p-6 sm:p-8 border border-border/50">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Most Popular Category
                </h2>
                <p className="text-muted-foreground">
                  Start with our most comprehensive category
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <Link 
                  href={`/r/${topCategory.category.toLowerCase()}`}
                  className="block bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={topCategory.imageofcategory} 
                      alt={topCategory.category}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2 capitalize">
                        {topCategory.category.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {topCategory.des}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary font-semibold">
                          {topCategory.totalcourse} courses
                        </span>
                        <span className="text-muted-foreground">→ Explore</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-card p-6 sm:p-8 rounded-lg border border-border text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Choose any category above to explore courses tailored to your learning goals. 
              All courses are completely free and designed by industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/all" 
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View All Courses
              </a>
              <a 
                href="/blog" 
                className="bg-card border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
              >
                Read Our Blog
              </a>
              <a 
                href="/" 
                className="bg-card border border-border text-foreground px-8 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
              >
                Back to Home
              </a>
            </div>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-xl">No categories found.</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const categories = getAllCategories();
    
    return {
      props: {
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        categories: [],
      },
    };
  }
};
