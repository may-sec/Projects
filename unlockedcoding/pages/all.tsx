import { GetStaticProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { ILightCourse } from '../lib/dataUtils';
import { getLightweightCourses } from '../lib/dataUtils';

// Dynamic import for better code splitting
const HybridCourseList = dynamic(() => import('../components/HybridCourseList'), {
  loading: () => <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {Array.from({ length: 12 }, (_, i) => (
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

interface AllCoursesPageProps {
  courses: ILightCourse[];
}

export default function AllCoursesPage({ courses }: AllCoursesPageProps) {

  return (
    <>
      <Head>
        <title>All Courses - {courses.length} Free Programming Courses | Unlocked Coding</title>
        <meta name="description" content={`Browse all ${courses.length} free programming courses. Learn web development, DSA, system design, machine learning, and more from top instructors.`} />
        <link rel="canonical" href="https://unlockedcoding.com/all" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`All Courses - ${courses.length} Free Courses | Unlocked Coding`} />
        <meta property="og:description" content="Browse all free programming courses in one place. Find your perfect learning path." />
        <meta property="og:url" content="https://unlockedcoding.com/all" />
        <meta property="og:type" content="website" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "All Programming Courses",
              "description": `Browse all ${courses.length} free programming courses`,
              "url": "https://unlockedcoding.com/all",
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
            All Courses
          </h1>

          <HybridCourseList courses={courses} coursesPerPage={12} />
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const courses = getLightweightCourses();
    
    return {
      props: {
        courses,
      },
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return {
      props: {
        courses: [],
      },
    };
  }
};