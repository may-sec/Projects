import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { ILightCourse } from '../../lib/dataUtils';
import { getAllCategories, getLightweightCoursesByCategory } from '../../lib/dataUtils';
import { trackCategoryView } from '../../lib/gtag';

// Dynamic import for better code splitting
const HybridCourseList = dynamic(() => import('../../components/HybridCourseList'), {
  loading: () => <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {Array.from({ length: 9 }, (_, i) => (
      <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden border border-border animate-pulse">
        <div className="w-full h-32 sm:h-40 md:h-48 bg-muted"></div>
        <div className="p-4 sm:p-6">
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-6 bg-muted rounded mb-3"></div>
          <div className="h-3 bg-muted rounded mb-2"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
});

interface CategoryPageProps {
  courses: ILightCourse[];
  categoryName: string;
}

// Helper function to render a course card
const renderCourseCard = (course: ILightCourse) => {
  if (course.videoType === 'redirect' && course.redirecturl) {
    return (
      <div
        key={`${course.coursecategory}-${course.courseName}`}
        className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-border group"
      >
        <Link
          href={`/teacher/${encodeURIComponent(course.instructorSlug)}/${encodeURIComponent(course.courseName)}`}
          className="block"
        >
          <div className="relative">
            <Image 
              src={course.imageofcourse} 
              alt={course.courseName}
              width={400}
              height={192}
              className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {course.rating && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <span>★</span>
                <span>{course.rating.average}</span>
                <span>({course.rating.count})</span>
              </div>
            )}
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded shadow">
              External
            </span>
          </div>
        </Link>
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs sm:text-sm text-primary font-medium capitalize bg-primary/10 px-2 py-1 rounded">
              {course.coursecategory}
            </span>
            <div className="flex items-center gap-2">
              {course.level && (
                <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-2 py-1 rounded">
                  {course.level}
                </span>
              )}
              <span className="text-xs sm:text-sm text-green-600 font-semibold">
                ₹{course.cost?.toLocaleString?.() ?? course.cost ?? '0'}
              </span>
            </div>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.courseName}
          </h3>
          <div className="flex items-center mb-3">
            <Image
              src={course.imageofinstructur}
              alt={course.instructorDisplayName}
              width={20}
              height={20}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2 flex-shrink-0 object-cover"
            />
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted rounded-full mr-2 flex-shrink-0 hidden"></div>
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              {course.instructorDisplayName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">
            {course.des}
          </p>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="text-primary font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Access course
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {course.audio || 'English'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={`${course.coursecategory}-${course.courseName}`}
      className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-border group"
    >
      <Link
        href={`/teacher/${encodeURIComponent(course.instructorSlug)}/${encodeURIComponent(course.courseName)}`}
        className="block"
        aria-label={`View ${course.courseName} course`}
      >
        <div className="relative">
          <Image 
            src={course.imageofcourse} 
            alt={course.courseName}
            width={400}
            height={192}
            className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {course.rating && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <span>★</span>
              <span>{course.rating.average}</span>
              <span>({course.rating.count})</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs sm:text-sm text-primary font-medium capitalize bg-primary/10 px-2 py-1 rounded">
            {course.coursecategory}
          </span>
          <div className="flex items-center gap-2">
            {course.level && (
              <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-2 py-1 rounded">
                {course.level}
              </span>
            )}
            <span className="text-xs sm:text-sm text-green-600 font-semibold">
              ${course.cost || '0'}
            </span>
          </div>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.courseName}
        </h3>
        <div className="flex items-center mb-3">
          <Image
            src={course.imageofinstructur}
            alt={course.instructorDisplayName}
            width={20}
            height={20}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2 flex-shrink-0 object-cover"
          />
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted rounded-full mr-2 flex-shrink-0 hidden"></div>
          <span className="text-xs sm:text-sm text-muted-foreground truncate">
            {course.instructorDisplayName}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">
          {course.des}
        </p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {'length' in course.videos ? course.videos.length : (course.videos as any)?.length || 0} videos
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {course.audio || 'English'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function CategoryPage({ courses, categoryName }: CategoryPageProps) {
  const canonicalUrl = `https://unlockedcoding.com/r/${encodeURIComponent(categoryName.toLowerCase())}`;
  const pageTitle = `${categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Courses | Unlocked Coding`;
  const pageDescription = `Browse ${courses.length} free ${categoryName} courses. Learn with high-quality video tutorials from top instructors.`;

  // Split courses into initial display and remaining courses
  const INITIAL_COURSES_COUNT = 6;
  const initialCourses = courses.slice(0, INITIAL_COURSES_COUNT);
  const remainingCourses = courses.slice(INITIAL_COURSES_COUNT);

  // Track category view on mount
  useEffect(() => {
    trackCategoryView(categoryName);
  }, [categoryName]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${categoryName} Courses`,
              "description": pageDescription,
              "url": canonicalUrl,
              "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": courses.length,
                "itemListElement": courses.slice(0, 50).map((course, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Course",
                    "name": course.courseName,
                    "description": course.des,
                    "url": `https://unlockedcoding.com/teacher/${encodeURIComponent(course.instructorSlug)}/${encodeURIComponent(course.courseName)}`
                  }
                }))
              }
            })
          }}
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <Link 
              href="/r" 
              className="text-sm sm:text-base text-primary hover:opacity-80 mb-3 sm:mb-4 inline-block transition-opacity"
            >
              ← Back to Categories
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground capitalize">
              {categoryName.replace(/-/g, ' ')} Courses
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {courses.length} courses available
            </p>
          </div>

          {/* Initial Course Cards */}
          {initialCourses.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {initialCourses.map(renderCourseCard)}
              </div>
            </div>
          )}

          {/* Category Overview */}
          <div className="bg-gradient-to-r from-gray-500/5 via-purple-500/5 to-white/5 rounded-2xl p-6 sm:p-8 mb-8 border border-border/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              About {categoryName.replace(/-/g, ' ')} Development
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {categoryName.replace(/-/g, ' ')} is one of the most in-demand skills in today's technology landscape. 
                  This field offers exciting career opportunities and the chance to work on cutting-edge projects that shape the digital world.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our comprehensive curriculum covers everything from fundamental concepts to advanced implementation, 
                  ensuring you have the knowledge and practical skills needed to succeed in this competitive field.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="font-semibold text-foreground mb-2">Career Opportunities</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Software Developer</li>
                    <li>• Senior Developer</li>
                    <li>• Technical Lead</li>
                    <li>• Solutions Architect</li>
                  </ul>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="font-semibold text-foreground mb-2">Average Salary Range</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹6-25 LPA (Entry to Senior Level)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Courses */}
          {remainingCourses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                All {categoryName.replace(/-/g, ' ')} Courses
              </h2>
              <HybridCourseList courses={remainingCourses} coursesPerPage={9} />
            </div>
          )}

          {/* Learning Path */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 mb-8 border border-border">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Recommended Learning Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-500/10 dark:bg-gray-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-foreground font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Foundation</h3>
                <p className="text-sm text-muted-foreground">
                  Start with basic concepts and fundamental principles. Build a strong foundation for advanced learning.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-500 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Intermediate</h3>
                <p className="text-sm text-muted-foreground">
                  Apply your knowledge through hands-on projects and real-world applications.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-500 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Advanced</h3>
                <p className="text-sm text-muted-foreground">
                  Master advanced concepts and specialize in specific areas of expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const categories = getAllCategories();
    
    const paths = categories.map((category) => ({
      params: {
        category: category.category.toLowerCase(), // Normalize to lowercase
      },
    }));

    return {
      paths,
      fallback: false, // All pages are pre-rendered at build time
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    // Normalize category to lowercase for case-insensitive matching
    const categoryName = (params?.category as string).toLowerCase();
    
    const courses = getLightweightCoursesByCategory(categoryName);

    return {
      props: {
        courses,
        categoryName,
      },
    };
  } catch (error) {
    console.error('Error fetching category courses:', error);
    return {
      props: {
        courses: [],
        categoryName: params?.category as string || '',
      },
    };
  }
};