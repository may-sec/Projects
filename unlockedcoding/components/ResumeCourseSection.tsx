import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCourseProgress, CourseProgress, clearAllCourseProgress } from '../lib/utils';

interface CourseWithProgress {
  courseName: string;
  progress: CourseProgress;
  totalVideos: number;
  completedVideos: number;
}

export default function ResumeCourseSection() {
  const [coursesToShow, setCoursesToShow] = useState<CourseWithProgress[]>([]);

  const loadCourses = () => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const progressList = getAllCourseProgress();
      
      // Group progress by course name
      const courseMap = new Map<string, CourseProgress[]>();
      
      progressList.forEach(progress => {
        if (!courseMap.has(progress.courseName)) {
          courseMap.set(progress.courseName, []);
        }
        courseMap.get(progress.courseName)!.push(progress);
      });
      
      // Create course list with latest progress
      const courses: CourseWithProgress[] = Array.from(courseMap.entries()).map(([courseName, progressList]) => {
        // Get the most recent progress for this course
        const latestProgress = progressList.sort((a, b) => b.timestamp - a.timestamp)[0];
        
        return {
          courseName,
          progress: latestProgress,
          totalVideos: 0, // We don't have total videos count, so we'll use completed count
          completedVideos: progressList.length,
        };
      });
      
      // Sort by most recent activity and limit to 6
      const sortedCourses = courses
        .sort((a, b) => (b.progress.timestamp || 0) - (a.progress.timestamp || 0))
        .slice(0, 6);
      
      setCoursesToShow(sortedCourses);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleClearResume = () => {
    if (typeof window !== 'undefined') {
      if (confirm('Are you sure you want to clear all your resume progress? This action cannot be undone.')) {
        clearAllCourseProgress();
        setCoursesToShow([]);
      }
    }
  };

  if (coursesToShow.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 sm:py-16 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Resume Your Learning
            </h2>
            <button
              onClick={handleClearResume}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-md hover:bg-muted border border-border hover:border-foreground/20 self-start sm:self-auto"
              title="Clear all resume progress"
            >
              Clear Resume
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {coursesToShow.map(({ courseName, progress, completedVideos }) => {
              const teacherSlug = progress.teacherSlug || '';
              const courseUrl = progress.courseUrl || `/teacher/${encodeURIComponent(teacherSlug)}/${encodeURIComponent(courseName)}/play`;
              
              // Calculate progress percentage (using completed videos as indicator)
              // Since we don't have total videos, we'll show a visual indicator
              const progressPercentage = Math.min((completedVideos * 10), 100); // Approximate

              return (
                <Link
                  key={`${progress.pageName}_${progress.title}`}
                  href={courseUrl}
                  className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-primary"
                >
                  <div className="mb-4">
                    {progress.courseImage && (
                      <img
                        src={progress.courseImage}
                        alt={courseName}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {courseName}
                    </h3>
                    {progress.courseDescription && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {progress.courseDescription}
                      </p>
                    )}
                  </div>

                  {/* Progress Indicator */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-card-foreground">
                        Videos Completed
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {completedVideos} video{completedVideos !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Last Watched Video */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">Last: {progress.title}</span>
                  </div>

                  {/* Resume Button */}
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                      Resume Course
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

