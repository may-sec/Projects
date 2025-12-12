/**
 * Normalizes a string key by converting it to lowercase,
 * replacing special characters, and standardizing separators.
 * This is a client-safe utility function.
 */
export function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[@&]/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Course progress utilities for localStorage
 */
export interface CourseProgress {
  pageName: string;
  title: string;
  courseName: string;
  courseUrl: string;
  videoIndex: number;
  timestamp: number;
  courseImage?: string;
  courseDescription?: string;
  teacherSlug?: string;
}

const PROGRESS_STORAGE_KEY = 'courseProgress';

export function markVideoAsDone(
  pageName: string, 
  title: string, 
  courseName: string, 
  courseUrl: string, 
  videoIndex: number,
  courseImage?: string,
  courseDescription?: string,
  teacherSlug?: string
): void {
  if (typeof window === 'undefined') return;
  
  const progress: CourseProgress = {
    pageName,
    title,
    courseName,
    courseUrl,
    videoIndex,
    timestamp: Date.now(),
    courseImage,
    courseDescription,
    teacherSlug,
  };
  
  const key = `${PROGRESS_STORAGE_KEY}_${pageName}_${title}`;
  localStorage.setItem(key, JSON.stringify(progress));
}

export function isVideoDone(pageName: string, title: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const key = `${PROGRESS_STORAGE_KEY}_${pageName}_${title}`;
  return localStorage.getItem(key) !== null;
}

export function getAllCourseProgress(): CourseProgress[] {
  if (typeof window === 'undefined') return [];
  
  const progressList: CourseProgress[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PROGRESS_STORAGE_KEY + '_')) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const progress = JSON.parse(value) as CourseProgress;
          progressList.push(progress);
        }
      } catch (e) {
        console.error('Error parsing course progress:', e);
      }
    }
  }
  
  // Sort by most recent first
  return progressList.sort((a, b) => b.timestamp - a.timestamp);
}

export function getLatestProgressForCourse(courseName: string): CourseProgress | null {
  const allProgress = getAllCourseProgress();
  const courseProgress = allProgress.filter(p => p.courseName === courseName);
  
  if (courseProgress.length === 0) return null;
  
  // Return the most recent progress for this course
  return courseProgress[0];
}

export function clearAllCourseProgress(): void {
  if (typeof window === 'undefined') return;
  
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PROGRESS_STORAGE_KEY + '_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

