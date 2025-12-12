import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {
  ICourse,
  ITeacherDetail,
  getAllCourses,
  loadTeacherData,
} from '../../lib/dataUtils';

interface TeacherListItem {
  slug: string;
  displayName: string;
  image: string;
  courseCount: number;
  categories: string[];
  specialization?: string;
  expertise?: string[];
  experience?: string;
  studentsHelped?: string;
  bio?: string;
  hasProfile: boolean;
}

interface TeachersPageProps {
  teachers: TeacherListItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  'web-development': 'Web Development',
  dsa: 'Data Structures & Algorithms',
  'ai-ml-ds': 'AI / ML / Data Science',
  'system-design': 'System Design',
  programming: 'Programming',
  devops: 'DevOps',
  'cyber-security': 'Cyber Security',
  'data-analytics': 'Data Analytics',
  'data-engineering': 'Data Engineering',
  networking: 'Networking',
  'app-development': 'App Development',
  gate: 'GATE Preparation',
  aptitude: 'Aptitude',
  'government-exam': 'Government Exams',
  'defence-exam': 'Defence Exams',
  skills: 'Skills Development',
};

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[@&]/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatDisplayName(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || formatDisplayName(category);
}

export default function TeachersPage({ teachers }: TeachersPageProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unlocked Coding';

  return (
    <>
      <Head>
        <title>All Teachers | {siteName}</title>
        <meta
          name="description"
          content="Explore all expert instructors on Unlocked Coding. Discover their specializations, experience, and courses they teach."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://unlockedcoding.com/teacher" />
        <meta property="og:title" content={`All Teachers | ${siteName}`} />
        <meta
          property="og:description"
          content="Browse all expert instructors on Unlocked Coding."
        />
        <meta property="og:url" content="https://unlockedcoding.com/teacher" />
        <meta property="og:type" content="website" />
      </Head>

      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Meet All Our Instructors
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn from industry experts with real-world experience across system
              design, web development, data science, programming, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {teachers.map(teacher => (
              <article
                key={teacher.slug}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
                    {teacher.image ? (
                      <img
                        src={teacher.image}
                        alt={teacher.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      teacher.displayName.charAt(0)
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {teacher.displayName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {teacher.specialization || 'Expert Instructor'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {teacher.courseCount} course{teacher.courseCount === 1 ? '' : 's'} •{' '}
                      {teacher.experience || 'Experience unavailable'}
                    </p>
                  </div>
                </div>

                {teacher.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {teacher.bio}
                  </p>
                )}

                {teacher.expertise && teacher.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {teacher.expertise.slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {teacher.expertise.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{teacher.expertise.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {teacher.categories.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {teacher.categories.slice(0, 4).map(category => (
                        <span
                          key={category}
                          className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs"
                        >
                          {getCategoryLabel(category)}
                        </span>
                      ))}
                      {teacher.categories.length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +{teacher.categories.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-2">
                  {teacher.hasProfile ? (
                    <Link
                      href={`/teacher/${encodeURIComponent(teacher.slug)}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
                    >
                      View Profile
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                      Profile coming soon
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {teachers.length === 0 && (
            <div className="text-center text-muted-foreground mt-12">
              No teachers available at the moment. Please check back later.
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const teacherDetails = loadTeacherData();
    const allCourses = getAllCourses();

    const detailMap = new Map<string, ITeacherDetail>();
    teacherDetails.forEach(detail => {
      const keys = [detail.id, detail.displayName, detail.name]
        .filter(Boolean)
        .map(normalizeKey);

      keys.forEach(key => {
        if (!detailMap.has(key)) {
          detailMap.set(key, detail);
        }
      });
    });

    const teacherAccumulator = new Map<
      string,
      {
        slug: string;
        displayName: string;
        image: string;
        courseCount: number;
        categories: Set<string>;
        detail?: ITeacherDetail;
      }
    >();

    const formatNameFromCourse = (courseInstructor: string) =>
      formatDisplayName(courseInstructor);

    const registerCourseTeacher = (course: ICourse) => {
      const instructor = course.instructorname;
      if (!instructor) {
        return;
      }

      const slug = instructor;
      const key = normalizeKey(instructor);
      const existing = teacherAccumulator.get(key);

      const detail = detailMap.get(key);
      const displayName = detail?.name || formatNameFromCourse(instructor);
      const image = detail?.image || course.imageofinstructur || '';

      if (existing) {
        existing.courseCount += 1;
        if (course.coursecategory) {
          existing.categories.add(course.coursecategory.toLowerCase());
        }

        if (!existing.detail && detail) {
          existing.detail = detail;
        }
      } else {
        teacherAccumulator.set(key, {
          slug,
          displayName,
          image,
          courseCount: 1,
          categories: new Set(
            course.coursecategory ? [course.coursecategory.toLowerCase()] : []
          ),
          detail,
        });
      }
    };

    allCourses.forEach(registerCourseTeacher);

    // Add teachers that exist only in detailed JSON but not yet associated with a course
    teacherDetails.forEach(detail => {
      const key = normalizeKey(detail.id || detail.displayName || detail.name);
      if (!teacherAccumulator.has(key)) {
        teacherAccumulator.set(key, {
          slug: detail.id || normalizeKey(detail.displayName || detail.name),
          displayName: detail.name,
          image: detail.image,
          courseCount: 0,
          categories: new Set<string>(),
          detail,
        });
      }
    });

    const teachers = Array.from(teacherAccumulator.values())
      .map(teacher => ({
        slug: teacher.slug,
        displayName: teacher.displayName,
        image: teacher.image || '',
        courseCount: teacher.courseCount,
        categories: Array.from(teacher.categories),
        specialization: teacher.detail?.specialization ?? null,
        expertise: teacher.detail?.expertise ?? [],
        experience: teacher.detail?.experience ?? null,
        studentsHelped: teacher.detail?.studentsHelped ?? null,
        bio: teacher.detail?.bio ?? null,
        hasProfile: teacher.courseCount > 0,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    return {
      props: {
        teachers,
      },
    };
  } catch (error) {
    console.error('Error loading teacher list:', error);
    return {
      props: {
        teachers: [],
      },
    };
  }
}

