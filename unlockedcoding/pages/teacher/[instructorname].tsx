import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { getAllCourses, ICourse, ITeacherDetail, getTeacherDetails, loadTeacherData } from '../../lib/dataUtils';

interface InstructorPageProps {
  instructorName: string;
  courses: ICourse[];
  instructorImage: string;
  teacherDetails?: ITeacherDetail | null;
  similarTeachers?: ITeacherDetail[];
}

export default function InstructorPage({ instructorName, courses, instructorImage, teacherDetails, similarTeachers = [] }: InstructorPageProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unlocked Coding';
  const hasRestrictedCourses = courses.some(course => course.copyright);

  return (
    <>
      <Head>
        <title>{`${instructorName} - Courses by ${instructorName} | ${siteName}`}</title>
        <meta name="description" content={`Explore all programming courses by ${instructorName}. Learn from industry experts with hands-on projects and real-world applications.`} />
        <meta name="keywords" content={`${instructorName}, programming courses, coding tutorials, web development, software engineering`} />
        <link rel="canonical" href={`https://unlockedcoding.com/teacher/${encodeURIComponent(instructorName)}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${instructorName} - Courses by ${instructorName}`} />
        <meta property="og:description" content={`Explore all programming courses by ${instructorName}. Learn from industry experts.`} />
        <meta property="og:image" content={instructorImage} />
        <meta property="og:url" content={`https://unlockedcoding.com/teacher/${encodeURIComponent(instructorName)}`} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${instructorName} - Courses by ${instructorName}`} />
        <meta name="twitter:description" content={`Explore all programming courses by ${instructorName}.`} />
        <meta name="twitter:image" content={instructorImage} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": instructorName,
              "url": `https://unlockedcoding.com/teacher/${encodeURIComponent(instructorName)}`,
              "image": instructorImage,
              "jobTitle": "Programming Instructor",
              "worksFor": {
                "@type": "Organization",
                "name": siteName,
                "url": "https://unlockedcoding.com"
              },
              "teaches": courses.map(course => ({
                "@type": "Course",
                "name": course.courseName,
                "description": course.des,
                "url": `https://unlockedcoding.com/teacher/${encodeURIComponent(course.instructorSlug || course.teacherId || instructorName)}/${encodeURIComponent(course.courseName)}`
              }))
            })
          }}
        />
      </Head>
      
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {hasRestrictedCourses && (
            <div className="mb-8 rounded-2xl border border-amber-400 bg-amber-50 p-5 text-amber-900 shadow-sm">
              <p className="text-lg font-semibold">This teacher content is not available anymore.</p>
              <p className="text-sm opacity-80">
                Due to copyright restrictions, course playback and downloads have been disabled.
              </p>
            </div>
          )}
          {/* Part 1: Instructor Header - Name, Image, Specialization, Stats */}
          <div className="flex flex-col lg:flex-row items-start gap-8 mb-12">
            {/* Left Side - Teacher Image */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <Image
                src={teacherDetails?.image || instructorImage}
                alt={teacherDetails?.name || instructorName}
                width={224}
                height={224}
                className="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl object-cover shadow-xl border-4 border-primary"
                priority
              />
            </div>
            
            {/* Right Side - Teacher Basic Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  {teacherDetails?.name || instructorName}
                </h1>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <p className="text-xl sm:text-2xl text-primary font-semibold">
                  {teacherDetails?.specialization || 'Programming Instructor & Industry Expert'}
                </p>
                
                {/* Expertise Tags - Next to Specialization */}
                {teacherDetails?.expertise && (
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {teacherDetails.expertise.map((skill, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="text-xl font-bold text-primary mb-1">{courses.length}</div>
                  <div className="text-xs text-muted-foreground">Courses</div>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="text-xl font-bold text-primary mb-1">
                    {courses.reduce((total, course) => total + (course.videos?.length || 0), 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Videos</div>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="text-xl font-bold text-primary mb-1">
                    {new Set(courses.map(course => course.coursecategory)).size}
                  </div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
                {teacherDetails?.experience && (
                  <div className="bg-card rounded-lg p-3 border border-border">
                    <div className="text-xl font-bold text-primary mb-1">{teacherDetails.experience}</div>
                    <div className="text-xs text-muted-foreground">Experience</div>
                  </div>
                )}
                {teacherDetails?.studentsHelped && (
                  <div className="bg-card rounded-lg p-3 border border-border">
                    <div className="text-xl font-bold text-primary mb-1">{teacherDetails.studentsHelped}</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Part 2: Courses Grid */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
              Courses by {teacherDetails?.name || instructorName}
            </h2>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const isRestrictedCourse = Boolean(course.copyright);
                  const cardContent = (
                    <>
                      <div className="relative">
                        <Image 
                          src={course.imageofcourse} 
                          alt={course.courseName}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        {isRestrictedCourse && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-4 text-center text-sm font-semibold uppercase tracking-wide text-amber-300">
                            Course unavailable
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center space-x-2">
                            <Image 
                              src={course.imageofinstructur} 
                              alt={teacherDetails?.displayName || teacherDetails?.name || course.instructorDisplayName || course.instructorSlug}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                            />
                            <span className="text-white text-sm font-medium">
                              {teacherDetails?.displayName || teacherDetails?.name || course.instructorDisplayName || course.instructorSlug}
                            </span>
                          </div>
                        </div>
                        {course.videoType === 'redirect' && course.redirecturl && (
                          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full shadow">
                            External
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-primary font-medium capitalize bg-primary/10 px-2 py-1 rounded-full">
                            {course.coursecategory}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★★★★★</span>
                            <span className="text-sm text-muted-foreground">4.8/5</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {course.des}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {course.videoType === 'redirect' && course.redirecturl ? (
                              <>
                                <span className="text-xs text-muted-foreground">🌐 External</span>
                                <span className="text-xs text-muted-foreground">Partner Access</span>
                              </>
                            ) : (
                              <>
                                <span className="text-xs text-muted-foreground">🎥</span>
                                <span className="text-xs text-muted-foreground">{course.videos?.length || 0} videos</span>
                              </>
                            )}
                          </div>
                          <span className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isRestrictedCourse ? 'bg-gray-300 text-gray-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                            {isRestrictedCourse ? 'Unavailable' : course.videoType === 'redirect' && course.redirecturl ? 'Access Course' : 'View Details'}
                          </span>
                        </div>
                      </div>
                    </>
                  );

                  return (
                    <div key={`${course.coursecategory}-${course.courseName}`} className={`group ${isRestrictedCourse ? 'cursor-not-allowed' : ''}`}>
                      {isRestrictedCourse ? (
                        <div
                          className="block bg-card rounded-xl shadow-lg transition-all duration-300 overflow-hidden border border-border opacity-70 pointer-events-none"
                          aria-disabled="true"
                        >
                          {cardContent}
                        </div>
                      ) : (
                        <Link
                          href={`/teacher/${encodeURIComponent(course.instructorSlug || course.teacherId || instructorName)}/${encodeURIComponent(course.courseName)}`}
                          className="block bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:scale-102"
                        >
                          {cardContent}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No courses found for this instructor.</p>
              </div>
            )}
          </div>

          {/* Part 3: Teacher Description/Bio */}
          {teacherDetails?.bio && (
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">
                About {teacherDetails?.name || instructorName}
              </h2>
              <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {teacherDetails.bio}
                </p>
              </div>
            </div>
          )}

          {/* Part 4: Notable Achievements */}
          {teacherDetails && teacherDetails.achievements && teacherDetails.achievements.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
                Notable Achievements
              </h2>
              <div className="bg-card rounded-xl p-8 border border-border">
                <ul className="space-y-4">
                  {teacherDetails.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-muted-foreground text-lg">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Part 5: Social Links */}
          {teacherDetails?.socialLinks && (
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">
                Connect with {teacherDetails?.name || instructorName}
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {teacherDetails.socialLinks.telegram && (
                  <a
                    href={teacherDetails.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    Telegram
                  </a>
                )}
                {teacherDetails.socialLinks.linkedin && (
                  <a
                    href={teacherDetails.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                {teacherDetails.socialLinks.github && (
                  <a
                    href={teacherDetails.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {teacherDetails.socialLinks.instagram && (
                  <a
                    href={teacherDetails.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                    </svg>
                    Instagram
                  </a>
                )}
                {teacherDetails.socialLinks.youtube && (
                  <a
                    href={teacherDetails.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>
                )}
                {teacherDetails.socialLinks.website && (
                  <a
                    href={teacherDetails.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Similar Teachers */}
          {similarTeachers && similarTeachers.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
                Similar Teachers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarTeachers.map((teacher) => (
                  <Link
                    key={teacher.id}
                    href={`/teacher/${encodeURIComponent(teacher.name)}`}
                    className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {teacher.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {teacher.specialization}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {teacher.bio.substring(0, 120)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.expertise.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = getAllCourses();
  const instructorNames = new Set<string>();
  
  courses.forEach(course => {
    if (course.instructorname) {
      instructorNames.add(course.instructorname);
    }
  });

  const paths = Array.from(instructorNames).map(instructorName => ({
    params: { instructorname: instructorName }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const instructorName = params?.instructorname as string;
  const allCourses = getAllCourses();
  
  // Filter courses by instructor name
  const instructorCourses = allCourses.filter(course => 
    course.instructorname === instructorName
  );

  // Get instructor image from first course
  const instructorImage = instructorCourses.length > 0 
    ? instructorCourses[0].imageofinstructur 
    : '/default-instructor.jpg';

  // Get teacher details if available
  const teacherDetails = getTeacherDetails(instructorName);

  // Get similar teachers based on expertise or specialization
  const allTeachers = loadTeacherData();
  const similarTeachers = allTeachers
    .filter(teacher => 
      teacher.id !== teacherDetails?.id && 
      teacherDetails && (
        teacher.specialization.toLowerCase().includes(teacherDetails.specialization.toLowerCase()) ||
        teacherDetails.specialization.toLowerCase().includes(teacher.specialization.toLowerCase()) ||
        teacher.expertise.some(skill => 
          teacherDetails.expertise.some(detailSkill => 
            skill.toLowerCase().includes(detailSkill.toLowerCase()) ||
            detailSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      )
    )
    .slice(0, 3);

  return {
    props: {
      instructorName,
      courses: instructorCourses,
      instructorImage,
      teacherDetails,
      similarTeachers
    },
  };
};
