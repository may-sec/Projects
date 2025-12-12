import { useState, useEffect } from 'react';
import Link from 'next/link';
import CourseSkeleton from './CourseSkeleton';
import { ICourse, ILightCourse } from '../lib/dataUtils';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { shouldUsePagination } from '../lib/seoUtils';

interface HybridCourseListProps {
  courses: ICourse[] | ILightCourse[];
  coursesPerPage?: number;
}

export default function HybridCourseList({ 
  courses, 
  coursesPerPage = 12 
}: HybridCourseListProps) {
  const [usePagination, setUsePagination] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    // Check if we should use pagination (for crawlers)
    setUsePagination(shouldUsePagination());
  }, []);

  // Infinite scroll hook for regular users
  const {
    displayedItems: infiniteScrollCourses,
    hasMore,
    isLoading,
    loadMore
  } = useInfiniteScroll(courses, {
    itemsPerPage: coursesPerPage,
    totalItems: courses.length,
    threshold: 300
  });

  // Pagination logic for crawlers
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const paginatedCourses = courses.slice(startIndex, endIndex);

  const displayedCourses = usePagination ? paginatedCourses : infiniteScrollCourses;

  const renderCourseCard = (course: ICourse | ILightCourse) => {
    if (course.videoType === 'redirect' && course.redirecturl) {
      return (
        <Link
          key={`${course.coursecategory}-${course.courseName}`}
          href={`/teacher/${encodeURIComponent(course.instructorSlug)}/${encodeURIComponent(course.courseName)}`}
          className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-border group block"
        >
          <div className="relative">
            <img 
              src={course.imageofcourse} 
              alt={course.courseName}
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
              <img
                src={course.imageofinstructur}
                alt={course.instructorDisplayName}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2 flex-shrink-0 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted rounded-full mr-2 flex-shrink-0 hidden"></div>
              <span className="text-xs sm:text-sm text-muted-foreground truncate">
                {course.instructorDisplayName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">
              {course.des}
            </p>

            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-foreground mb-2">What you'll learn:</h4>
                <ul className="space-y-1">
                  {course.whatYouWillLearn.slice(0, 2).map((item: string, index: number) => (
                    <li key={index} className="flex items-start text-xs text-muted-foreground">
                      <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="line-clamp-2">{item}</span>
                    </li>
                  ))}
                  {course.whatYouWillLearn.length > 2 && (
                    <li className="text-xs text-primary font-medium">
                      +{course.whatYouWillLearn.length - 2} more learning outcomes
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-2 gap-2">
                {course.duration && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.language && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>{course.language}</span>
                  </div>
                )}
              </div>

              {course.studentsEnrolled && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{typeof course.studentsEnrolled === 'number' ? course.studentsEnrolled.toLocaleString() : course.studentsEnrolled} students enrolled</span>
                </div>
              )}

              {course.lastUpdated && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Updated {course.lastUpdated}</span>
                </div>
              )}
            </div>

            {course.requirements && course.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-foreground mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {course.requirements.slice(0, 2).map((req: string, index: number) => (
                    <li key={index} className="flex items-start text-xs text-muted-foreground">
                      <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="line-clamp-2">{req}</span>
                    </li>
                  ))}
                  {course.requirements.length > 2 && (
                    <li className="text-xs text-primary font-medium">
                      +{course.requirements.length - 2} more requirements
                    </li>
                  )}
                </ul>
              </div>
            )}

            {course.features && course.features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-foreground mb-2">Course Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {course.features.slice(0, 3).map((feature: string, index: number) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {course.features.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{course.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

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
        </Link>
      );
    }

    return (
      <Link
        key={`${course.coursecategory}-${course.courseName}`}
        href={`/teacher/${encodeURIComponent(course.instructorSlug)}/${encodeURIComponent(course.courseName)}`}
        className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-border group block"
      >
        <div className="relative">
          <img 
            src={course.imageofcourse} 
            alt={course.courseName}
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
            <img
              src={course.imageofinstructur}
              alt={course.instructorDisplayName}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2 flex-shrink-0 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted rounded-full mr-2 flex-shrink-0 hidden"></div>
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              {course.instructorDisplayName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">
            {course.des}
          </p>
          
          {/* What You'll Learn Preview */}
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-foreground mb-2">What you'll learn:</h4>
              <ul className="space-y-1">
                {course.whatYouWillLearn.slice(0, 2).map((item: string, index: number) => (
                  <li key={index} className="flex items-start text-xs text-muted-foreground">
                    <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="line-clamp-2">{item}</span>
                  </li>
                ))}
                {course.whatYouWillLearn.length > 2 && (
                  <li className="text-xs text-primary font-medium">
                    +{course.whatYouWillLearn.length - 2} more learning outcomes
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Enhanced course details */}
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-2">
              {course.duration && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.duration}</span>
                </div>
              )}
              {course.language && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{course.language}</span>
                </div>
              )}
            </div>
            
            {course.studentsEnrolled && (
              <div className="flex items-center text-xs text-muted-foreground">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{typeof course.studentsEnrolled === 'number' ? course.studentsEnrolled.toLocaleString() : course.studentsEnrolled} students enrolled</span>
              </div>
            )}
            
            {course.lastUpdated && (
              <div className="flex items-center text-xs text-muted-foreground">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Updated {course.lastUpdated}</span>
              </div>
            )}
          </div>

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-foreground mb-2">Requirements:</h4>
              <ul className="space-y-1">
                {course.requirements.slice(0, 2).map((req: string, index: number) => (
                  <li key={index} className="flex items-start text-xs text-muted-foreground">
                    <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="line-clamp-2">{req}</span>
                  </li>
                ))}
                {course.requirements.length > 2 && (
                  <li className="text-xs text-primary font-medium">
                    +{course.requirements.length - 2} more requirements
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Features */}
          {course.features && course.features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-foreground mb-2">Course Features:</h4>
              <div className="flex flex-wrap gap-1">
                {course.features.slice(0, 3).map((feature: string, index: number) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
                {course.features.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{course.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

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
      </Link>
    );
  };

  return (
    <>
      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayedCourses.map(renderCourseCard)}
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-xl">No courses found.</p>
        </div>
      )}

      {/* Pagination for Crawlers */}
      {usePagination && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} • {courses.length} courses total
            </p>
          </div>
        </div>
      )}

      {/* Infinite Scroll for Users */}
      {!usePagination && (
        <>
          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
              {Array.from({ length: coursesPerPage }, (_, i) => (
                <CourseSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && (
            <div className="mt-8 flex flex-col items-center space-y-4">
              <button
                onClick={loadMore}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Load More Courses
              </button>
              <p className="text-sm text-muted-foreground text-center">
                Showing {infiniteScrollCourses.length} of {courses.length} courses
              </p>
            </div>
          )}
          
          {!hasMore && infiniteScrollCourses.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                You've reached the end! All {courses.length} courses are loaded.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
