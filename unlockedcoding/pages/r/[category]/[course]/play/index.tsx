import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAllCourses, getCourseByName } from '../../../../../lib/dataUtils';

interface LegacyCoursePlayRedirectProps {
  destination: string | null;
}

export default function LegacyCoursePlayRedirect({ destination }: LegacyCoursePlayRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (destination) {
      router.replace(destination).catch(() => {
        // Ignore navigation errors during static export fallback rendering
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
    console.error('Error generating static paths for legacy course play redirects:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<LegacyCoursePlayRedirectProps> = async ({ params }) => {
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

    const destination = `/teacher/${encodeURIComponent(teacherSlug)}/${encodeURIComponent(course.courseName)}/play`;

    return {
      props: {
        destination,
      },
    };
  } catch (error) {
    console.error('Error handling legacy course play redirect:', error);
    return {
      notFound: true,
    };
  }
};

