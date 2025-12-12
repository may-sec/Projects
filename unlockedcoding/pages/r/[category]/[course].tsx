import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAllCourses, getCourseByName } from '../../../lib/dataUtils';

interface LegacyCourseRedirectProps {
  destination: string | null;
}

export default function LegacyCourseRedirect({ destination }: LegacyCourseRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (destination) {
      router.replace(destination).catch(() => {
        // Swallow navigation errors (e.g. route not ready), static export will still render fallback below
      });
    }
  }, [destination, router]);

  if (!destination) {
    return null;
  }

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      </Head>
      Redirecting...
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const courses = getAllCourses();

    const paths = courses.map((course) => ({
      params: {
        category: course.coursecategory.toLowerCase(),
        course: course.courseName,
      },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error generating static paths for legacy course redirects:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<LegacyCourseRedirectProps> = async ({ params }) => {
  try {
    const categoryName = (params?.category as string).toLowerCase();
    const courseName = params?.course as string;

    const course = getCourseByName(categoryName, courseName);

    if (!course) {
      return {
        notFound: true,
      };
    }

    const teacherSlug = course.instructorSlug || course.teacherId || course.instructorname;

    const destination = `/teacher/${encodeURIComponent(teacherSlug)}/${encodeURIComponent(course.courseName)}`;

    return {
      props: {
        destination,
      },
    };
  } catch (error) {
    console.error('Error handling legacy course redirect:', error);
    return {
      notFound: true,
    };
  }
};

