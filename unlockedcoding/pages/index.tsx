import Layout from '../components/Layout';
import Head from 'next/head';
import Image from 'next/image';
import HomepageCarousel from '../components/HomepageCarousel';
import ReviewsSection from '../components/ReviewsSection';
import MeetYourTeachers from '../components/MeetYourTeachers';
import ResumeCourseSection from '../components/ResumeCourseSection';
import { getHomepageCourses, getReviewsData, getUniqueTeachers, ICourse, IReviewsData, ITeacher } from '../lib/dataUtils';
import { GetStaticProps } from 'next';
import { useTheme } from '../contexts/ThemeContext';

interface HomeProps {
  homepageCourses: ICourse[];
  reviewsData: IReviewsData;
  teachers: ITeacher[];
}

export default function Home({ homepageCourses, reviewsData, teachers }: HomeProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unlocked Coding';
  const { theme } = useTheme();
  
  // Ensure homepageCourses is always an array
  const safeHomepageCourses = Array.isArray(homepageCourses) ? homepageCourses : [];
  
  // Theme-based image URLs from public folder
  const heroImageUrl = theme === 'dark' 
    ? '/darktheme.webp'
    : '/whitetheme.webp';
  
  return (
    <>
      <Head>
        <title>Unlocked Coding - Free Programming Courses & Tutorials</title>
        <meta name="description" content="Master programming with free comprehensive courses. Learn web development, data structures, algorithms, system design, and more from industry experts." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://unlockedcoding.com/" />
        <meta property="og:title" content="Unlocked Coding - Free Programming Courses" />
        <meta property="og:description" content="Master programming with free comprehensive courses. Learn web development, DSA, system design, and more." />
        <meta property="og:url" content="https://unlockedcoding.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unlocked Coding - Free Programming Courses" />
        <meta name="twitter:description" content="Master programming with free comprehensive courses." />
      </Head>
      <Layout>
      <div className="min-h-screen flex flex-col">
        {/* New Hero Section */}
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
            {/* Left Side - Branding and Messages */}
            <div className="flex-1 w-full">
              {/* Branding */}
              <div className="text-left mb-6 lg:mb-8">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight mb-2">
                  UNLOCKED CODING
                </h1>
              </div>

              {/* Message Section - Wide, starts from left */}
              <div className="w-full space-y-2 sm:space-y-3 text-left">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  become a 100xdev without selling ur kidney
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-semibold">
                  enjoy lots of free stuff
                </p>
              </div>
            </div>

            {/* Middle - Hero Image */}
            <div className="flex justify-center items-center w-full lg:w-auto">
              <Image 
                src={heroImageUrl} 
                alt="Hero illustration" 
                width={350}
                height={397}
                sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, (max-width: 1024px) 300px, 350px"
                className="max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] h-auto rounded-lg"
                priority
                fetchPriority="high"
              />
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full sm:w-auto lg:w-auto lg:mt-0">
              <a 
                href="/all" 
                className="group bg-card border-2 border-foreground text-foreground px-8 py-4 rounded-lg hover:bg-foreground hover:text-background transition-all duration-300 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center active:bg-foreground active:text-background"
              >
                <span className="flex items-center justify-center gap-2">
                  VIEW ALL COURSES
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a 
                href="/teacher" 
                className="group bg-card border-2 border-foreground text-foreground px-8 py-4 rounded-lg hover:bg-foreground hover:text-background transition-all duration-300 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center active:bg-foreground active:text-background"
              >
                <span className="flex items-center justify-center gap-2">
                  VIEW ALL TEACHERS
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </a>
              <a 
                href="/r" 
                className="group bg-card border-2 border-foreground text-foreground px-8 py-4 rounded-lg hover:bg-foreground hover:text-background transition-all duration-300 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center active:bg-foreground active:text-background"
              >
                <span className="flex items-center justify-center gap-2">
                  VIEW ALL CATEGORY
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Resume Course Section */}
        <ResumeCourseSection />

        {/* Featured Courses Carousel - Mobile Optimized */}
        {safeHomepageCourses && safeHomepageCourses.length > 0 && (
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <HomepageCarousel courses={safeHomepageCourses} />
          </div>
        )}

        {/* Reviews Section */}
        <ReviewsSection reviewsData={reviewsData} />

        {/* Meet Your Teachers Section */}
        <MeetYourTeachers teachers={teachers} />

        {/* Why Choose Section */}
        <div className="w-full py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12">
                Why Choose Unlocked Coding?
              </h2>
              
              <div className="space-y-10 mb-16">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                    Industry-Standard Curriculum
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-4xl">
                    Our courses are designed by industry experts and cover the latest technologies and best practices used in top tech companies.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                    Hands-On Learning
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-4xl">
                    Learn by building real projects that you can showcase in your portfolio. Every course includes practical exercises and assignments.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-border pt-12">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Mission: Democratizing Programming Education
                </h3>
                <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-5xl">
                  <p>
                    At Unlocked Coding, we believe that high-quality programming education should be accessible to everyone, regardless of their financial background. Our platform was founded with the vision of breaking down barriers in tech education and empowering individuals to pursue their dreams in software development.
                  </p>
                  <p>
                    We've curated the best programming courses from renowned instructors and made them completely free. From data structures and algorithms to full-stack web development, system design, and machine learning - our comprehensive curriculum covers everything you need to become a successful developer.
                  </p>
                  <p>
                    Join our community of over 44,000 learners who are already transforming their careers through our platform. Whether you're a complete beginner or looking to advance your skills, we provide the resources, support, and guidance you need to succeed in the competitive tech industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full py-12 sm:py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <p className="text-base sm:text-lg text-muted-foreground">
                Unlocked Coding by UNLOCKED - 3RD YEAR - SDE - straight from pahad
              </p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const homepageCourses = getHomepageCourses();
    const reviewsData = getReviewsData();
    const teachers = getUniqueTeachers();
    
    // Ensure we always return valid data
    const safeHomepageCourses = Array.isArray(homepageCourses) ? homepageCourses : [];
    const safeReviewsData = reviewsData || { reviews: [], averageRating: 0, totalReviews: 0 };
    const safeTeachers = Array.isArray(teachers) ? teachers : [];
    
    return {
      props: {
        homepageCourses: safeHomepageCourses,
        reviewsData: safeReviewsData,
        teachers: safeTeachers,
      },
    };
  } catch (error) {
    return {
      props: {
        homepageCourses: [],
        reviewsData: { reviews: [], averageRating: 0, totalReviews: 0 },
        teachers: [],
      },
    };
  }
};
