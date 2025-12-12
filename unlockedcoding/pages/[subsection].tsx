import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import { ILightCourse, getLightweightCoursesBySubsection, getAllSubsections, ITeacherDetail, getTeacherDetails, loadTeacherData } from '../lib/dataUtils';
import { normalizeKey } from '../lib/utils';

interface SubsectionPageProps {
  courses: ILightCourse[];
  subsectionName: string;
  teachers: ITeacherDetail[];
  teachersWithCourses: Array<{
    teacher: ITeacherDetail;
    courses: ILightCourse[];
  }>;
}

export default function SubsectionPage({ courses, subsectionName, teachers, teachersWithCourses }: SubsectionPageProps) {
  if (!courses || courses.length === 0) {
    return (
      <>
        <Head>
          <title>Subsection Not Found | Unlocked Coding</title>
          <meta name="robots" content="noindex, follow" />
        </Head>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Subsection Not Found
              </h1>
              <p className="text-muted-foreground mb-8">
                The subsection you're looking for doesn't exist.
              </p>
              <Link 
                href="/r" 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to Categories
              </Link>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  const subsectionDisplayName = subsectionName.charAt(0).toUpperCase() + subsectionName.slice(1);
  const totalVideos = courses.reduce((sum, course) => sum + (course.videos?.length || 0), 0);
  const uniqueCategories = Array.from(new Set(courses.map(c => c.coursecategory)));

  return (
    <>
      <Head>
        <title>{subsectionName.toUpperCase()} Courses | Unlocked Coding</title>
        <meta 
          name="description" 
          content={`Explore ${subsectionName.toUpperCase()} courses with comprehensive video tutorials and hands-on projects.`} 
        />
        <link rel="canonical" href={`https://unlockedcoding.com/${encodeURIComponent(subsectionName)}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${subsectionName.toUpperCase()} Courses | Unlocked Coding`} />
        <meta property="og:description" content={`Explore ${subsectionName.toUpperCase()} courses with comprehensive video tutorials and hands-on projects.`} />
        <meta property="og:url" content={`https://unlockedcoding.com/${encodeURIComponent(subsectionName)}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${subsectionName.toUpperCase()} Courses | Unlocked Coding`} />
        <meta name="twitter:description" content={`Explore ${subsectionName.toUpperCase()} courses with comprehensive video tutorials.`} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${subsectionName.toUpperCase()} Courses`,
              "description": `Explore ${subsectionName.toUpperCase()} courses with comprehensive video tutorials and hands-on projects.`,
              "url": `https://unlockedcoding.com/${encodeURIComponent(subsectionName)}`,
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
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {subsectionDisplayName} Courses
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Comprehensive video tutorials and hands-on projects
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span>{courses.length} course{courses.length !== 1 ? 's' : ''} available</span>
              <span>•</span>
              <span>{totalVideos} video{totalVideos !== 1 ? 's' : ''} total</span>
              <span>•</span>
              <span>{teachers.length} expert instructor{teachers.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Teachers with Courses - Side by Side Layout */}
          {teachersWithCourses.length > 0 && (
            <div className="mb-12 space-y-12">
              {teachersWithCourses.map(({ teacher, courses: teacherCourses }) => (
                <div key={teacher.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Side - About Teacher */}
                    <aside className="lg:w-1/3 bg-background p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border">
                      <div className="sticky top-4">
                        <div className="flex flex-col items-center lg:items-start mb-6">
                          <img
                            src={teacher.image}
                            alt={teacher.name}
                            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover mb-4 border-4 border-primary/20"
                          />
                          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 text-center lg:text-left">
                            {teacher.name}
                          </h2>
                          <p className="text-primary font-semibold text-lg mb-4 text-center lg:text-left">
                            {teacher.specialization || 'Expert Instructor'}
                          </p>
                        </div>

                        {teacher.bio && (
                          <div className="mb-6">
                            <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                              About Instructor
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {teacher.bio}
                            </p>
                          </div>
                        )}

                        {teacher.expertise && teacher.expertise.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                              Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {teacher.expertise.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3 mb-6">
                          {teacher.experience && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground font-medium">Experience:</span>
                              <span className="text-foreground">{teacher.experience}</span>
                            </div>
                          )}
                          {teacher.studentsHelped && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground font-medium">Students Helped:</span>
                              <span className="text-foreground">{teacher.studentsHelped}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground font-medium">Courses in this subsection:</span>
                            <span className="text-foreground font-semibold">{teacherCourses.length}</span>
                          </div>
                        </div>

                        <Link
                          href={`/teacher/${encodeURIComponent(teacher.id || teacher.name)}`}
                          className="inline-block w-full text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
                        >
                          View All Courses by {teacher.name.split(' ')[0]} →
                        </Link>
                      </div>
                    </aside>

                    {/* Right Side - Teacher's Courses */}
                    <div className="lg:w-2/3 p-6 lg:p-8">
                      <h3 className="text-xl font-bold text-foreground mb-6">
                        Courses by {teacher.name.split(' ')[0]}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {teacherCourses.map((course) => (
                          <Link
                            key={course._id}
                            href={`/teacher/${encodeURIComponent(course.instructorSlug)}/${encodeURIComponent(course.courseName)}`}
                            className="group bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            <div className="relative">
                              <img
                                src={course.imageofcourse}
                                alt={course.courseName}
                                className="w-full h-40 object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {course.courseName}
                              </h4>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {course.des}
                              </p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {course.videos?.length || 0} video{(course.videos?.length || 0) !== 1 ? 's' : ''}
                                </span>
                                {course.cost === 0 && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                    Free
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* About Subsection Section */}
          <div className="mb-12 bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About {subsectionDisplayName} Courses
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Welcome to our comprehensive collection of {subsectionDisplayName.toLowerCase()} courses! Our curated selection features {courses.length} carefully chosen courses designed to help you master {subsectionDisplayName.toLowerCase()} concepts, from fundamentals to advanced topics. With over {totalVideos} video lessons, you'll have access to extensive learning materials created by industry experts and experienced instructors.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our {subsectionDisplayName.toLowerCase()} courses cover a wide range of topics{uniqueCategories.length > 0 ? ` including ${uniqueCategories.slice(0, 3).join(', ')}${uniqueCategories.length > 3 ? ' and more' : ''}` : ''}. Each course is structured to provide hands-on experience through real-world projects, practical examples, and comprehensive tutorials. Whether you're a beginner looking to start your journey or an experienced developer wanting to deepen your knowledge, you'll find courses suited to your skill level.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              All our courses feature high-quality video content, detailed explanations, and practical exercises to ensure you gain not just theoretical knowledge, but also the skills needed to apply what you learn in real-world scenarios. Many courses include additional resources like code samples, project files, and community support to enhance your learning experience.
            </p>
          </div>

          {/* Why Choose Our Courses Section */}
          <div className="mb-12 bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Why Choose Our {subsectionDisplayName} Courses?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Comprehensive Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Our courses cover everything from fundamentals to advanced topics, ensuring you have a complete understanding of {subsectionDisplayName.toLowerCase()} concepts.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">👨‍🏫</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Expert Instructors</h3>
                <p className="text-sm text-muted-foreground">
                  Learn from industry professionals with years of experience who have helped thousands of students master {subsectionDisplayName.toLowerCase()} concepts and advance their careers.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Hands-On Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Every course includes practical projects and real-world examples to help you apply what you learn immediately.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Extensive Content</h3>
                <p className="text-sm text-muted-foreground">
                  With over {totalVideos} video lessons across {courses.length} courses, you'll have access to extensive learning materials.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Career-Ready Skills</h3>
                <p className="text-sm text-muted-foreground">
                  Our courses are designed to help you build skills that are directly applicable in real-world projects and job interviews.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Flexible Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Learn at your own pace, access courses anytime, and revisit content whenever you need to reinforce your understanding.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Categories */}
          <div className="text-center mt-12">
            <Link 
              href="/r" 
              className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              ← Back to All Categories
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all unique subsections from course data
  const allSubsections = getAllSubsections();
  
  const paths = allSubsections.map((subsection) => ({
    params: { subsection },
  }));

  return {
    paths,
    fallback: false, // All pages are pre-rendered at build time
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const subsectionName = params?.subsection as string;
    
    if (!subsectionName) {
      return {
        props: {
          courses: [],
          subsectionName: '',
          teachers: [],
          teachersWithCourses: [],
        },
      };
    }

    const courses = getLightweightCoursesBySubsection(subsectionName);
    
    // Get unique teacher IDs from courses
    const teacherIds = new Set<string>();
    courses.forEach(course => {
      const teacherId = normalizeKey(course.instructorSlug || course.teacherId || '');
      if (teacherId) {
        teacherIds.add(teacherId);
      }
    });

    // Load all teacher data
    const allTeachers = loadTeacherData();
    
    // Get teachers that match the course instructors
    const teachers: ITeacherDetail[] = [];
    const teacherMap = new Map<string, ITeacherDetail>();
    
    allTeachers.forEach(teacher => {
      const normalizedId = normalizeKey(teacher.id || teacher.name || '');
      if (teacherIds.has(normalizedId)) {
        teachers.push(teacher);
        teacherMap.set(normalizedId, teacher);
      }
    });

    // Group courses by teacher
    const teachersWithCourses: Array<{ teacher: ITeacherDetail; courses: ILightCourse[] }> = [];
    teachers.forEach(teacher => {
      const normalizedId = normalizeKey(teacher.id || teacher.name || '');
      const teacherCourses = courses.filter(course => {
        const courseTeacherId = normalizeKey(course.instructorSlug || course.teacherId || '');
        return courseTeacherId === normalizedId;
      });
      
      if (teacherCourses.length > 0) {
        teachersWithCourses.push({
          teacher,
          courses: teacherCourses,
        });
      }
    });

    // Sort teachers by number of courses (most courses first)
    teachersWithCourses.sort((a, b) => b.courses.length - a.courses.length);

    return {
      props: {
        courses,
        subsectionName,
        teachers,
        teachersWithCourses,
      },
    };
  } catch (error) {
    console.error('Error fetching subsection courses:', error);
    return {
      props: {
        courses: [],
        subsectionName: params?.subsection as string || '',
        teachers: [],
        teachersWithCourses: [],
      },
    };
  }
};
