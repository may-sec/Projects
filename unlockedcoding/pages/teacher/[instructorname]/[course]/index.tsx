import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../../../../components/Layout';
import {
  ICourse,
  ILightCourse,
  ITeacherDetail,
  getAllCourses,
  getCourseByTeacherAndName,
  getSimilarCourses,
  getTeacherDetails,
} from '../../../../lib/dataUtils';
import { trackCourseView, event } from '../../../../lib/gtag';

interface TeacherCoursePageProps {
  course: ICourse | null;
  categoryName: string;
  courseName: string;
  teacherSlug: string;
  similarCourses?: ILightCourse[];
  teacherDetails?: ITeacherDetail | null;
}

export default function TeacherCoursePage({
  course,
  categoryName,
  courseName,
  teacherSlug,
  similarCourses = [],
  teacherDetails,
}: TeacherCoursePageProps) {
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
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Course Not Found
              </h1>
              <p className="text-muted-foreground mb-8">
                The course you're looking for doesn't exist.
              </p>
              <Link
                href="/teacher"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Browse Teachers
              </Link>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  const encodedTeacherSlug = encodeURIComponent(teacherSlug);
  const encodedCourseName = encodeURIComponent(courseName);
  const canonicalUrl = `https://unlockedcoding.com/teacher/${encodedTeacherSlug}/${encodedCourseName}`;
  const instructorDisplayName =
    teacherDetails?.displayName ||
    teacherDetails?.name ||
    course.instructorDisplayName ||
    course.instructorSlug ||
    'Instructor';
  const specializationText = teacherDetails?.specialization
    ? teacherDetails.specialization.toLowerCase()
    : 'cutting-edge technology domains';
  const teachingStyleText = teacherDetails?.teachingStyle
    ? teacherDetails.teachingStyle.toLowerCase()
    : 'a blend of theory and practice';
  const expertiseChips = teacherDetails?.expertise?.slice(0, 3) || null;
  const isRestrictedCourse = Boolean(course.copyright);

  if (isRestrictedCourse) {
    return (
      <>
        <Head>
          <title>{`${course.courseName} | Unavailable`}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Layout>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="rounded-2xl border border-amber-400 bg-amber-50 p-8 text-center text-amber-900 shadow">
              <h1 className="mb-4 text-3xl font-bold">This course is no longer available.</h1>
              <p className="mx-auto mb-6 max-w-2xl text-sm sm:text-base opacity-90">
                Due to copyright restrictions this course cannot be viewed anymore. Please explore other courses by{' '}
                {instructorDisplayName}.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/teacher/${encodedTeacherSlug}`}
                  className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                >
                  Back to {instructorDisplayName}
                </Link>
                <Link
                  href={`/r/${categoryName.toLowerCase()}`}
                  className="inline-flex items-center justify-center rounded-lg border border-amber-400 px-6 py-3 text-base font-semibold text-amber-900 hover:bg-amber-100"
                >
                  Browse more {categoryName} courses
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
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content={course.courseName} />
        <meta property="og:description" content={course.des} />
        <meta property="og:image" content={course.imageofcourse} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Unlocked Coding" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={course.courseName} />
        <meta name="twitter:description" content={course.des} />
        <meta name="twitter:image" content={course.imageofcourse} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: course.courseName,
              description: course.des,
              provider: {
                '@type': 'Organization',
                name: 'Unlocked Coding',
                url: 'https://unlockedcoding.com',
              },
              instructor: {
                '@type': 'Person',
                name: instructorDisplayName || 'Instructor',
                url: `https://unlockedcoding.com/teacher/${encodedTeacherSlug}`,
              },
              courseMode: 'online',
              educationalLevel: course.level || 'Beginner',
              inLanguage: course.language || 'English',
              timeRequired: course.duration || 'N/A',
              url: canonicalUrl,
              image: course.imageofcourse,
              offers: {
                '@type': 'Offer',
                price: course.cost || 0,
                priceCurrency: 'INR',
              },
            }),
          }}
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Link
                href={`/teacher/${encodedTeacherSlug}`}
                className="text-primary hover:opacity-80 transition-opacity"
              >
                ← Back to {instructorDisplayName}
              </Link>
              <span className="hidden sm:block">•</span>
              <Link
                href={`/r/${categoryName.toLowerCase()}`}
                className="text-primary hover:opacity-80 transition-opacity"
              >
                Explore {categoryName} Courses
              </Link>
            </div>
            <Link
              href={`/teacher/${encodedTeacherSlug}/${encodedCourseName}/play`}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Watch Course →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="order-2 lg:order-1 lg:col-span-2">
              <div className="mb-8">
                <h1 className="mb-4 text-3xl font-bold text-foreground">{course.courseName}</h1>
                <p className="mb-6 text-lg text-muted-foreground">{course.des}</p>

                <div className="mb-6 rounded-lg border bg-card p-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={teacherDetails?.image || course.imageofinstructur}
                      alt={teacherDetails?.name || instructorDisplayName}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-semibold text-foreground">
                        Meet Your Instructor: {teacherDetails?.displayName || instructorDisplayName}
                      </h3>
                      <p className="mb-3 leading-relaxed text-muted-foreground">
                        {teacherDetails?.bio || `${instructorDisplayName} is an experienced software engineer and educator with expertise in modern web development technologies. With years of industry experience, ${instructorDisplayName} brings real-world knowledge and practical insights to every lesson. Known for clear explanations and hands-on teaching methods, ${instructorDisplayName} has helped thousands of students master programming concepts and advance their careers in technology.`}
                      </p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {expertiseChips && expertiseChips.length > 0 ? (
                          expertiseChips.map((skill, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-gray-500/10 dark:bg-gray-400/10 px-3 py-1 text-sm text-foreground"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="rounded-full bg-gray-500/10 dark:bg-gray-400/10 px-3 py-1 text-sm text-foreground">
                              Industry Expert
                            </span>
                            <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-500">
                              Experienced Educator
                            </span>
                            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-500">
                              Practical Focus
                            </span>
                          </>
                        )}
                      </div>
                      {teacherDetails && (
                        <div className="text-sm text-muted-foreground">
                          <p>
                            <strong>Experience:</strong> {teacherDetails.experience}
                          </p>
                          <p>
                            <strong>Students Helped:</strong> {teacherDetails.studentsHelped}
                          </p>
                          <p>
                            <strong>Specialization:</strong> {teacherDetails.specialization}
                          </p>
                          <div className="mt-3">
                            <Link
                              href={`/teacher/${encodedTeacherSlug}`}
                              className="text-sm font-medium text-primary hover:underline"
                              onClick={() =>
                                event({
                                  action: 'click',
                                  category: 'Course',
                                  label: `View Teacher Profile - ${teacherDetails.name}`,
                                })
                              }
                            >
                              View Full Profile →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-lg border border-border/50 bg-gradient-to-r from-gray-500/5 via-purple-500/5 to-white/5 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-foreground">Course Overview</h3>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    {teacherDetails
                      ? `This comprehensive course is designed to take you from foundational concepts to advanced implementation in ${specializationText}. You'll learn through ${teachingStyleText}, building real-world projects that demonstrate your skills and enhance your portfolio.`
                      : `This comprehensive course is designed to take you from foundational concepts to advanced implementation. You'll learn through a combination of theoretical understanding and hands-on practice, building real-world projects that demonstrate your skills and enhance your portfolio.`}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    Whether you're looking to start a new career in technology or advance your current skills, this course provides the structured learning path and practical experience you need to succeed in today's competitive tech industry.
                  </p>
                </div>
              </div>

              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Course Curriculum</h2>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <svg
                          className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {course.videoType === 'redirect' && course.redirectsyllabus && course.redirectsyllabus.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Course Syllabus</h2>
                  <div className="rounded-lg border bg-card">
                    {course.redirectsyllabus.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b p-4 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{topic}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {course.videos && course.videos.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Course Content</h2>
                  <div className="rounded-lg border bg-card">
                    {course.videos.map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b p-4 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{video.title}</h3>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">Video {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {course.requirements && course.requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Requirements</h2>
                  <ul className="list-inside list-disc space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="text-muted-foreground">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.features && course.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Course Features</h2>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="mr-3 h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <div className="sticky top-6 space-y-6">
                <div>
                  <Image
                    src={course.imageofcourse}
                    alt={course.courseName}
                    width={400}
                    height={192}
                    className="h-48 w-full rounded-lg object-cover shadow-lg"
                  />
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">
                      ₹{course.cost?.toLocaleString() || 'Free'}
                    </span>
                    {course.rating && (
                      <div className="flex items-center">
                        <div className="mr-2 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(course.rating!.average)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {course.rating.average} ({course.rating.count} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/teacher/${encodedTeacherSlug}/${encodedCourseName}/play`}
                    className="block rounded-lg bg-primary py-3 text-center font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    View Course
                  </Link>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 font-semibold text-foreground">Course Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="text-foreground">{course.duration || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="text-foreground">{course.level || 'Beginner'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="text-foreground">{course.language || 'English'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Students</span>
                      <span className="text-foreground">
                        {course.studentsEnrolled?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated</span>
                      <span className="text-foreground">{course.lastUpdated || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {similarCourses && similarCourses.length > 0 && (
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 font-semibold text-foreground">
                      Similar Courses in this Category
                    </h3>
                    <div className="space-y-4">
                      {similarCourses.map((similarCourse) => (
                        <Link
                          key={similarCourse._id}
                          href={`/teacher/${encodeURIComponent(similarCourse.instructorSlug)}/${encodeURIComponent(similarCourse.courseName)}`}
                          className="group block rounded-lg p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-start space-x-3">
                            <Image
                              src={similarCourse.imageofcourse}
                              alt={similarCourse.courseName}
                              width={64}
                              height={48}
                              className="h-12 w-16 flex-shrink-0 rounded-md object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-medium text-foreground transition-colors group-hover:text-primary line-clamp-2">
                                {similarCourse.courseName}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {similarCourse.des}
                              </p>
                              <div className="mt-2 flex items-center space-x-2">
                                <Image
                                  src={similarCourse.imageofinstructur}
                                  alt={similarCourse.instructorDisplayName || similarCourse.instructorSlug}
                                  width={16}
                                  height={16}
                                  className="h-4 w-4 rounded-full"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {similarCourse.instructorDisplayName || similarCourse.instructorSlug}
                                </span>
                                {similarCourse.rating && (
                                  <div className="flex items-center">
                                    <svg
                                      className="mr-1 h-3 w-3 text-yellow-400"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-xs text-muted-foreground">
                                      {similarCourse.rating.average.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
              <h3 className="mb-2 text-xl font-bold text-foreground">Ready to Start Learning?</h3>
              <p className="mb-4 text-muted-foreground">
                Join thousands of students who have already enrolled in this course.
              </p>
              <Link
                href={`/teacher/${encodedTeacherSlug}/${encodedCourseName}/play`}
                className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start Learning Now
              </Link>
            </div>
          </div>
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
    console.error('Error generating static paths for teacher course pages:', error);
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

    const teacherDetails = getTeacherDetails(course.teacherId || course.instructorSlug || course.instructorname);
    const similarCourses = getSimilarCourses(course.coursecategory, course.courseName, 4);

    return {
      props: {
        course,
        categoryName: course.coursecategory,
        courseName,
        teacherSlug: course.instructorSlug || teacherSlug,
        similarCourses,
        teacherDetails,
      },
    };
  } catch (error) {
    console.error('Error fetching teacher course page:', error);
    return {
      props: {
        course: null,
        categoryName: '',
        courseName: params?.course as string,
        teacherSlug: params?.instructorname as string,
        similarCourses: [],
        teacherDetails: null,
      },
    };
  }
};

