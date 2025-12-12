import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../../../../../components/Layout';
import { useAuth } from '../../../../../contexts/AuthContext';
import { ICourse, getAllCourses, getCourseByTeacherAndName } from '../../../../../lib/dataUtils';
import { trackCourseView } from '../../../../../lib/gtag';
import { generateOptimizedCourseStructuredData } from '../../../../../lib/structuredData';

const VideoPlayer = dynamic(() => import('../../../../../components/VideoPlayer'), {
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  ),
});

interface TeacherCoursePlayPageProps {
  course: ICourse | null;
  categoryName: string;
  courseName: string;
  teacherSlug: string;
}

export default function TeacherCoursePlayPage({
  course,
  categoryName,
  courseName,
  teacherSlug,
}: TeacherCoursePlayPageProps) {
  const router = useRouter();
  const { user, isReady, login } = useAuth();
  const [guestMode, setGuestMode] = useState(false);
  const encodedTeacherSlug = encodeURIComponent(teacherSlug);
  const encodedCourseName = encodeURIComponent(courseName);

  const isRestrictedCourse = Boolean(course?.copyright);

  useEffect(() => {
    if (!course || isRestrictedCourse) return;
    if (course.videoType === 'redirect' && course.redirecturl) {
      window.location.href = course.redirecturl;
    }
  }, [course, isRestrictedCourse]);

  useEffect(() => {
    if (course && course.courseName) {
      trackCourseView(course.courseName, categoryName);
    }
  }, [course, categoryName]);

  if (!course) {
    return (
      <>
        <Head>
          <title>Course Not Found | Unlocked Coding</title>
          <meta name="robots" content="noindex, follow" />
        </Head>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold text-foreground">Course Not Found</h1>
              <p className="mb-8 text-muted-foreground">
                The course you're looking for doesn't exist.
              </p>
              <Link
                href={`/teacher/${encodedTeacherSlug}`}
                className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-90"
              >
                Back to Teacher
              </Link>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  if (!isRestrictedCourse && course.videoType === 'redirect' && course.redirecturl) {
    return (
      <>
        <Head>
          <title>{course.courseName} | Unlocked Coding</title>
          <meta name="description" content={course.des} />
          <link
            rel="canonical"
            href={`https://unlockedcoding.com/teacher/${encodedTeacherSlug}/${encodedCourseName}/play`}
          />
          <meta name="robots" content="noindex, follow" />
        </Head>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <h1 className="mb-4 text-2xl font-bold text-foreground">Redirecting...</h1>
              <p className="mb-8 text-muted-foreground">
                You are being redirected to the external course.
              </p>
              <p className="text-sm text-muted-foreground">
                If you are not redirected automatically,
                <a
                  href={course.redirecturl}
                  className="ml-1 text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here
                </a>
              </p>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  const structuredData = generateOptimizedCourseStructuredData(course, categoryName, courseName, {
    teacherSlug: course?.instructorSlug || teacherSlug,
  });
  const instructorDisplayName =
    course.instructorDisplayName || course.instructorSlug || course.teacherId || course.instructorname || 'Instructor';
  const requiresLogin = course.videoType === 'hls';
  const showLoginGate = requiresLogin && isReady && !user && !guestMode;
  const showGuestMode = requiresLogin && isReady && !user && guestMode;
  const showLoadingState = requiresLogin && !isReady;

  const handleLogin = () => {
    const redirectPath = router.asPath || `/teacher/${teacherSlug}/${courseName}/play`;
    login(redirectPath);
  };

  const handleGuestMode = () => {
    setGuestMode(true);
  };

  if (isRestrictedCourse) {
    return (
      <>
        <Head>
          <title>{`${course.courseName} | Unavailable`}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Layout>
          <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-amber-400 bg-amber-50 p-8 text-center text-amber-900 shadow">
              <h1 className="mb-3 text-3xl font-bold">This course is not available anymore.</h1>
              <p className="mx-auto mb-6 max-w-2xl text-sm sm:text-base opacity-90">
                Due to copyright restrictions we can no longer stream this content. Please explore other material from the
                instructor instead.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/teacher/${encodedTeacherSlug}/${encodedCourseName}`}
                  className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                >
                  Back to course info
                </Link>
                <Link
                  href={`/teacher/${encodedTeacherSlug}`}
                  className="inline-flex items-center justify-center rounded-lg border border-amber-400 px-6 py-3 text-base font-semibold text-amber-900 hover:bg-amber-100"
                >
                  More from this teacher
                </Link>
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${course.courseName} - ${instructorDisplayName || 'Free Course'} | Unlocked Coding`}</title>
        <meta name="description" content={course.des} />
        <link
          rel="canonical"
          href={`https://unlockedcoding.com/teacher/${encodedTeacherSlug}/${encodedCourseName}/play`}
        />

        <meta property="og:title" content={course.courseName} />
        <meta property="og:description" content={course.des} />
        <meta property="og:image" content={course.imageofcourse} />
        <meta
          property="og:url"
          content={`https://unlockedcoding.com/teacher/${encodedTeacherSlug}/${encodedCourseName}/play`}
        />
        <meta property="og:type" content="video.course" />
        <meta property="og:site_name" content="Unlocked Coding" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={course.courseName} />
        <meta name="twitter:description" content={course.des} />
        <meta name="twitter:image" content={course.imageofcourse} />

        <meta property="video:duration" content="3600" />
        <meta property="video:release_date" content={new Date().toISOString()} />
        <meta property="video:tag" content={course.coursecategory} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-4 sm:mb-6">
            <Link
              href={`/teacher/${encodedTeacherSlug}/${encodedCourseName}`}
              className="mb-3 inline-block text-sm text-primary transition-opacity hover:opacity-80 sm:text-base"
            >
              ← Back to Course Info
            </Link>
          </div>

          {showLoadingState ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center shadow-lg">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Preparing your video experience…</p>
            </div>
          ) : showLoginGate ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-card-foreground">Login Required</h2>
              <p className="mb-6 text-muted-foreground">
                Please sign in with Google to continue watching this course.
              </p>
              <button
                onClick={handleLogin}
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-foreground px-7 py-3 text-base font-semibold text-background transition-colors duration-200 shadow-md hover:opacity-90 sm:w-auto"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background font-bold text-foreground">
                  G
                </span>
                <span>Continue with Google</span>
              </button>
              <button
                onClick={handleGuestMode}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border px-7 py-3 text-base font-semibold text-card-foreground transition-colors duration-200 hover:bg-muted/60 sm:w-auto"
              >
                Continue in Guest Mode
              </button>
            </div>
          ) : showGuestMode ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-8 text-center shadow-lg">
                <h2 className="mb-3 text-2xl font-semibold text-card-foreground">Guest Mode Enabled</h2>
                <p className="mx-auto mb-5 max-w-xl text-sm text-muted-foreground sm:text-base">
                  You are browsing as a guest. You can keep watching, but sign in to save progress and personalise your
                  experience.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-5 py-2 text-sm font-semibold text-background transition-colors duration-200 shadow hover:opacity-90"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground">
                      G
                    </span>
                    <span>Sign in with Google</span>
                  </button>
                  <Link
                    href={`/teacher/${encodedTeacherSlug}/${encodedCourseName}`}
                    className="inline-flex items-center justify-center rounded-md bg-muted px-5 py-2 text-sm font-semibold text-card-foreground transition-colors duration-200 hover:bg-secondary"
                  >
                    View Course Details
                  </Link>
                </div>
              </div>
              <VideoPlayer course={course} />
            </div>
          ) : (
            <VideoPlayer course={course} />
          )}
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const courses = getAllCourses();

    const paths = courses.map((course) => ({
      params: {
        instructorname: course.instructorSlug || course.teacherId || course.instructorname,
        course: course.courseName,
      },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error generating static paths for teacher course play pages:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const teacherSlug = params?.instructorname as string;
    const courseName = params?.course as string;

    const course = getCourseByTeacherAndName(teacherSlug, courseName);

    if (!course) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        course,
        categoryName: course.coursecategory,
        courseName,
        teacherSlug: course.instructorSlug || teacherSlug,
      },
    };
  } catch (error) {
    console.error('Error fetching teacher course play page:', error);
    return {
      props: {
        course: null,
        categoryName: '',
        courseName: params?.course as string,
        teacherSlug: params?.instructorname as string,
      },
    };
  }
};

