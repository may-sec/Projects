import fs from 'fs';
import path from 'path';
import { normalizeKey } from './utils';

function parseJsonFragments<T>(rawContent: string): T[] {
  const trimmed = rawContent.trim();
  if (!trimmed) {
    return [];
  }

  const candidates = Array.from(
    new Set([
      trimmed,
      trimmed.replace(/,\s*$/, ''),
      `[${trimmed}]`,
      `[${trimmed.replace(/,\s*$/, '')}]`
    ])
  );

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) {
        return parsed as T[];
      }
      if (parsed && typeof parsed === 'object') {
        return [parsed as T];
      }
    } catch (error) {
      // Try next candidate
    }
  }

  return [];
}

// Define interfaces for video data
export interface IVideo {
  title: string;
  url: string;
}

// Define interfaces for course data
export interface ICourse {
  courseName: string;
  coursecategory: string;
  viewtype: 'mobile' | 'laptop' | 'both';
  des: string;
  copyright?: boolean;
  teacherId: string;
  instructorSlug: string;
  instructorname: string;
  instructorDisplayName: string;
  teacherImage: string;
  imageofinstructur: string;
  imageofcourse: string;
  audio: 'english' | 'hindi';
  cost: number;
  videoType: 'hls' | 'wistia' | 'youtube' | 'internetarchive' | 'redirect';
  redirecturl?: string;
  redirectsyllabus?: string[];
  subsection?: string | string[] | null;
  videos: IVideo[];
  rank: 'high' | 'mid' | 'medium' | 'low';
  homepage?: boolean;
  _id: string;
  __v: number;
  // New fields for enhanced course info
  syllabus?: ISyllabusItem[];
  whatYouWillLearn?: string[];
  requirements?: string[];
  rating?: IRating;
  duration?: string;
  level?: string;
  language?: string;
  studentsEnrolled?: number;
  lastUpdated?: string;
  features?: string[];
}

export interface ISyllabusItem {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

export interface IRating {
  average: number;
  count: number;
  breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Define interfaces for category data
export interface ICategory {
  category: string;
  des: string;
  imageofcategory: string;
  totalcourse: number;
  rank: 'high' | 'mid' | 'medium' | 'low';
  _id: string;
  __v: number;
}

// Define interfaces for JSON data structure
interface JsonCourse {
  courseName: string;
  coursecategory: string;
  viewtype?: 'mobile' | 'laptop' | 'both';
  des: string;
  copyright?: boolean;
  teacherId?: string;
  instructorname?: string;
  imageofinstructur?: string;
  imageofcourse: string;
  audio?: 'english' | 'hindi';
  cost?: number;
  videoType: 'hls' | 'wistia' | 'youtube' | 'internetarchive' | 'redirect';
  redirecturl?: string;
  redirectsyllabus?: string[];
  subsection?: string | string[];
  videos: IVideo[];
  rank?: 'high' | 'mid' | 'medium' | 'low';
  homepage?: boolean;
  // New fields for enhanced course info
  syllabus?: ISyllabusItem[];
  whatYouWillLearn?: string[];
  requirements?: string[];
  rating?: IRating;
  duration?: string;
  level?: string;
  language?: string;
  studentsEnrolled?: number;
  lastUpdated?: string;
  features?: string[];
}

interface JsonCategory {
  category: string;
  des: string;
  imageofcategory: string;
  rank?: 'high' | 'mid' | 'medium' | 'low';
}

// Helper function to get data directory path
function getDataPath(): string {
  const newPath = path.join(process.cwd(), 'data', 'category');
  if (fs.existsSync(newPath)) {
    return newPath;
  }

  // Backward compatibility for legacy structure
  return path.join(process.cwd(), 'category');
}

function getCoursesPath(): string {
  const newPath = path.join(process.cwd(), 'data', 'courses');
  if (fs.existsSync(newPath)) {
    return newPath;
  }

  // Backward compatibility for legacy structure
  return path.join(process.cwd(), 'courses');
}

// Read all categories from JSON files
export function getAllCategories(): ICategory[] {
  try {
    const dataPath = getDataPath();
    const files = fs.readdirSync(dataPath);
    
    // Get all courses to calculate counts
    const allCourses = getAllCourses();
    
    // Create a map of category counts
    const categoryCounts: { [key: string]: number } = {};
    allCourses.forEach(course => {
      const category = course.coursecategory.toLowerCase();
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const categories: any[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Skip empty files
        if (fileContent.trim() === '') {
          continue;
        }
        
        try {
          const jsonData: JsonCategory = JSON.parse(fileContent);
          
          // Transform to category format compatible with ICategory
          const category = {
            category: jsonData.category,
            des: jsonData.des,
            imageofcategory: jsonData.imageofcategory,
            totalcourse: categoryCounts[jsonData.category.toLowerCase()] || 0,
            rank: jsonData.rank || 'mid',
            _id: file.replace('.json', ''),
            __v: 0
          };
          
          categories.push(category);
        } catch (parseError) {
          console.error(`Error parsing category file ${file}:`, parseError);
        }
      }
    }
    
    // Sort categories by rank and name
    categories.sort((a, b) => {
      const rankOrder: { [key: string]: number } = { high: 0, mid: 1, medium: 1, low: 2 };
      const rankDiff = rankOrder[a.rank] - rankOrder[b.rank];
      return rankDiff !== 0 ? rankDiff : a.category.localeCompare(b.category);
    });
    
    return categories as ICategory[];
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

// Cache for courses to avoid repeated file reads
let coursesCache: ICourse[] | null = null;
let coursesCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Read all courses from JSON files with caching
export function getAllCourses(): ICourse[] {
  const now = Date.now();
  
  // Return cached data if still valid
  if (coursesCache && (now - coursesCacheTime) < CACHE_DURATION) {
    return coursesCache;
  }
  
  try {
    const coursesPath = getCoursesPath();
    const files = fs.readdirSync(coursesPath);
    const teacherDetails = loadTeacherData();
    const teacherMap = new Map<string, ITeacherDetail>();

    teacherDetails.forEach(detail => {
      const keys = [detail.id, detail.displayName, detail.name]
        .filter(Boolean)
        .map(value => normalizeKey(value!));

      keys.forEach(key => {
        if (key && !teacherMap.has(key)) {
          teacherMap.set(key, detail);
        }
      });
    });
    
    const courses: any[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(coursesPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        try {
          const jsonData: JsonCourse = JSON.parse(fileContent);

          const teacherIdRaw = jsonData.teacherId || jsonData.instructorname || '';
          const teacherId = teacherIdRaw ? normalizeKey(teacherIdRaw) : 'unknown-teacher';
          const teacherDetail = teacherId ? teacherMap.get(teacherId) : undefined;
          const instructorSlug = teacherId;
          const instructorDisplayName = teacherDetail?.name || teacherDetail?.displayName || (jsonData.instructorname ? jsonData.instructorname.replace(/[-_]+/g, ' ') : teacherId || 'Instructor');
          const teacherImage = teacherDetail?.image || jsonData.imageofinstructur || '';

          // Transform to course format compatible with ICourse
          const course = {
            courseName: jsonData.courseName,
            coursecategory: jsonData.coursecategory.toLowerCase(),
            viewtype: jsonData.viewtype || 'both',
            des: jsonData.des,
            copyright: jsonData.copyright || false,
            teacherId,
            instructorSlug,
            instructorname: instructorSlug,
            instructorDisplayName,
            teacherImage,
            imageofinstructur: teacherImage,
            imageofcourse: jsonData.imageofcourse,
            audio: jsonData.audio || 'english',
            cost: jsonData.cost || 0,
            videoType: jsonData.videoType,
            redirecturl: jsonData.redirecturl,
            redirectsyllabus: jsonData.redirectsyllabus || [],
            subsection: jsonData.subsection || null,
            videos: jsonData.videos || [],
            rank: jsonData.rank || 'mid',
            homepage: jsonData.homepage || false,
            _id: file.replace('.json', ''),
            __v: 0,
            // New fields
            syllabus: jsonData.syllabus || [],
            whatYouWillLearn: jsonData.whatYouWillLearn || [],
            requirements: jsonData.requirements || [],
            rating: jsonData.rating || { average: 4.5, count: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
            duration: jsonData.duration || 'N/A',
            level: jsonData.level || 'Beginner',
            language: jsonData.language || 'English',
            studentsEnrolled: jsonData.studentsEnrolled || 0,
            lastUpdated: jsonData.lastUpdated || new Date().toISOString().split('T')[0],
            features: jsonData.features || []
          };
          
          courses.push(course);
        } catch (parseError) {
          console.error(`Error parsing course file ${file}:`, parseError);
        }
      }
    }
    
    // Sort courses by rank and name
    courses.sort((a, b) => {
      const rankOrder: { [key: string]: number } = { high: 0, mid: 1, medium: 1, low: 2 };
      const rankDiff = rankOrder[a.rank] - rankOrder[b.rank];
      return rankDiff !== 0 ? rankDiff : a.courseName.localeCompare(b.courseName);
    });
    
    // Cache the result
    coursesCache = courses as ICourse[];
    coursesCacheTime = now;
    
    return courses as ICourse[];
  } catch (error) {
    console.error('Error reading courses:', error);
    return [];
  }
}

// Get courses by category
export function getCoursesByCategory(categoryName: string): ICourse[] {
  const allCourses = getAllCourses();
  return allCourses.filter(course => 
    course.coursecategory.toLowerCase() === categoryName.toLowerCase()
  );
}

// Get a specific course by category and course name
export function getCourseByName(categoryName: string, courseName: string): ICourse | null {
  const allCourses = getAllCourses();
  return allCourses.find(course => 
    course.coursecategory.toLowerCase() === categoryName.toLowerCase() &&
    course.courseName === courseName
  ) || null;
}

export function getCourseByTeacherAndName(teacherSlug: string, courseName: string): ICourse | null {
  const allCourses = getAllCourses();
  const normalizedTeacher = normalizeKey(teacherSlug);

  return (
    allCourses.find(course => 
      normalizeKey(course.instructorSlug || course.teacherId || course.instructorname) === normalizedTeacher &&
      course.courseName === courseName
    ) || null
  );
}

// Get courses by subsection
export function getCoursesBySubsection(subsectionName: string): ICourse[] {
  const allCourses = getAllCourses();
  return allCourses.filter(course => {
    if (!course.subsection) return false;
    
    // Handle both string and array subsections
    if (Array.isArray(course.subsection)) {
      return course.subsection.some(sub => 
        sub.toLowerCase() === subsectionName.toLowerCase()
      );
    } else {
      return course.subsection.toLowerCase() === subsectionName.toLowerCase();
    }
  });
}

// Get all unique subsections
export function getAllSubsections(): string[] {
  const allCourses = getAllCourses();
  const subsections = new Set<string>();
  
  allCourses.forEach(course => {
    if (course.subsection) {
      if (Array.isArray(course.subsection)) {
        course.subsection.forEach(sub => subsections.add(sub.toLowerCase()));
      } else {
        subsections.add(course.subsection.toLowerCase());
      }
    }
  });
  
  return Array.from(subsections).sort();
}

// Get categories by rank
export function getCategoriesByRank(rank: 'high' | 'mid' | 'medium' | 'low'): ICategory[] {
  const allCategories = getAllCategories();
  return allCategories.filter(category => category.rank === rank);
}

// Get courses for homepage carousel
export function getHomepageCourses(): ICourse[] {
  const allCourses = getAllCourses();
  return allCourses.filter(course => course.homepage === true);
}

// Lightweight course interface for list pages (reduces bundle size)
export interface ILightCourse {
  courseName: string;
  coursecategory: string;
  des: string;
  imageofinstructur: string;
  instructorname: string;
  instructorSlug: string;
  instructorDisplayName: string;
  teacherId: string;
  imageofcourse: string;
  audio: 'english' | 'hindi';
  cost: number;
  videoType: 'hls' | 'wistia' | 'youtube' | 'internetarchive' | 'redirect';
  redirecturl?: string;
  redirectsyllabus?: string[];
  subsection?: string | string[] | null;
  videos: { length: number }; // Only store length, not full video data
  rank: 'high' | 'mid' | 'medium' | 'low';
  homepage?: boolean;
  _id: string;
  __v: number;
  // Optional enhanced fields for UI display
  rating?: IRating;
  level?: string;
  whatYouWillLearn?: string[];
  duration?: string;
  language?: string;
  studentsEnrolled?: number;
  lastUpdated?: string;
  requirements?: string[];
  features?: string[];
}

// Get lightweight courses for list pages (reduces data size significantly)
export function getLightweightCourses(): ILightCourse[] {
  const allCourses = getAllCourses();
  return allCourses.map(course => ({
    courseName: course.courseName,
    coursecategory: course.coursecategory,
    des: course.des,
    imageofinstructur: course.teacherImage,
    instructorname: course.instructorname,
    instructorDisplayName: course.instructorDisplayName,
    imageofcourse: course.imageofcourse,
    audio: course.audio,
    cost: course.cost,
    videoType: course.videoType,
    redirecturl: course.redirecturl,
    redirectsyllabus: course.redirectsyllabus,
    subsection: course.subsection,
    videos: { length: course.videos.length }, // Only store length
    rank: course.rank,
    homepage: course.homepage,
    teacherId: course.teacherId,
    instructorSlug: course.instructorSlug,
    _id: course._id,
    __v: course.__v,
    // Include optional enhanced fields
    rating: course.rating,
    level: course.level,
    whatYouWillLearn: course.whatYouWillLearn,
    duration: course.duration,
    language: course.language,
    studentsEnrolled: course.studentsEnrolled,
    lastUpdated: course.lastUpdated,
    requirements: course.requirements,
    features: course.features,
  }));
}

// Get lightweight courses by category
export function getLightweightCoursesByCategory(categoryName: string): ILightCourse[] {
  const allCourses = getLightweightCourses();
  return allCourses.filter(course => 
    course.coursecategory.toLowerCase() === categoryName.toLowerCase()
  );
}

// Get lightweight courses by subsection
export function getLightweightCoursesBySubsection(subsectionName: string): ILightCourse[] {
  const allCourses = getLightweightCourses();
  return allCourses.filter(course => {
    if (!course.subsection) return false;
    
    // Handle both string and array subsections
    if (Array.isArray(course.subsection)) {
      return course.subsection.some(sub => 
        sub.toLowerCase() === subsectionName.toLowerCase()
      );
    } else {
      return course.subsection.toLowerCase() === subsectionName.toLowerCase();
    }
  });
}

// Define interfaces for reviews data
export interface IReview {
  id: number;
  name: string;
  rating: number;
  review: string;
  course: string;
  location: string;
}

export interface IReviewsData {
  reviews: IReview[];
  averageRating: number;
  totalReviews: number;
}

// Define interfaces for placements data
export interface IPlacement {
  id: number;
  company: string;
  logo: string;
  studentsPlaced: number;
  averagePackage: string;
  roles: string[];
}

export interface IPlacementsData {
  placements: IPlacement[];
  totalStudentsPlaced: number;
  averagePackage: string;
}

// Helper function to get data directory path
function getDataDirectoryPath(): string {
  return path.join(process.cwd(), 'data');
}

// Read reviews data from JSON file
export function getReviewsData(): IReviewsData {
  try {
    const dataPath = getDataDirectoryPath();
    const filePath = path.join(dataPath, 'reviews.json');
    
    if (!fs.existsSync(filePath)) {
      console.warn('Reviews data file not found, returning empty data');
      return {
        reviews: [],
        averageRating: 0,
        totalReviews: 0
      };
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const reviewsData: IReviewsData = JSON.parse(fileContent);
    
    return reviewsData;
  } catch (error) {
    console.error('Error reading reviews data:', error);
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0
    };
  }
}

// Read placements data from JSON file
export function getPlacementsData(): IPlacementsData {
  try {
    const dataPath = getDataDirectoryPath();
    const filePath = path.join(dataPath, 'placements.json');
    
    if (!fs.existsSync(filePath)) {
      console.warn('Placements data file not found, returning empty data');
      return {
        placements: [],
        totalStudentsPlaced: 0,
        averagePackage: '₹0 LPA'
      };
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const placementsData: IPlacementsData = JSON.parse(fileContent);
    
    return placementsData;
  } catch (error) {
    console.error('Error reading placements data:', error);
    return {
      placements: [],
      totalStudentsPlaced: 0,
      averagePackage: '₹0 LPA'
    };
  }
}

// Define interface for teacher data
export interface ITeacher {
  name: string;
  image: string;
  courseCount: number;
  categories: string[];
}

// Enhanced teacher interface for detailed teacher data
export interface ITeacherDetail {
  id: string;
  name: string;
  displayName: string;
  bio: string;
  expertise: string[];
  experience: string;
  studentsHelped: string;
  specialization: string;
  teachingStyle: string;
  achievements: string[];
  image: string;
  socialLinks: {
    youtube?: string;
    telegram?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    website?: string;
  };
}

export interface IBlogLink {
  name: string;
  url: string;
}

export interface IBlogFAQ {
  question: string;
  answer: string;
}

export interface IBlogPost {
  id: string;
  name: string;
  description: string;
  image: string;
  content?: string;
  requirements: string[];
  youtubeTutorialLink?: string;
  steps: string[];
  links: IBlogLink[];
  category: string;
  tags: string[];
  featured?: boolean;
  // Enhanced fields
  benefits?: string[];
  useCases?: string[];
  troubleshooting?: { issue: string; solution: string }[];
  faqs?: IBlogFAQ[];
  relatedResources?: IBlogLink[];
  estimatedTime?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  lastUpdated?: string;
  author?: string;
  readingTime?: string;
}

// Load teacher data from JSON file
export function loadTeacherData(): ITeacherDetail[] {
  try {
    const teachersDir = path.join(process.cwd(), 'data', 'teachers');

    if (fs.existsSync(teachersDir)) {
      const files = fs
        .readdirSync(teachersDir)
        .filter(file => file.toLowerCase().endsWith('.json'));

      const teachers: ITeacherDetail[] = [];
      const seenIds = new Set<string>();

      files.forEach(file => {
        const filePath = path.join(teachersDir, file);

        try {
          const rawContent = fs.readFileSync(filePath, 'utf8');
          const teacherEntries = parseJsonFragments<ITeacherDetail>(rawContent);

          teacherEntries.forEach(entry => {
            if (entry) {
              const normalizedId = normalizeKey(entry.id || entry.displayName || entry.name);
              if (!normalizedId || seenIds.has(normalizedId)) {
                return;
              }

              const teacherEntry = {
                ...entry,
                id: normalizedId,
                displayName: entry.displayName || entry.name || normalizedId,
                name: entry.name || entry.displayName || normalizedId,
              } as ITeacherDetail;

              teachers.push(teacherEntry);
              seenIds.add(teacherEntry.id);
            }
          });
        } catch (fileError) {
          console.error(`Error reading teacher file ${file}:`, fileError);
        }
      });

      if (teachers.length > 0) {
        return teachers;
      }
    }

    const legacyTeachersPath = path.join(process.cwd(), 'data', 'teachers.json');
    if (fs.existsSync(legacyTeachersPath)) {
      const legacyTeachers = JSON.parse(fs.readFileSync(legacyTeachersPath, 'utf8'));
      return legacyTeachers;
    }

    return [];
  } catch (error) {
    console.error('Error loading teacher data:', error);
    return [];
  }
}

// Load blog posts from JSON files
export function loadBlogPosts(): IBlogPost[] {
  try {
    const blogsDir = path.join(process.cwd(), 'data', 'blog');
    const posts: IBlogPost[] = [];
    const seenIds = new Set<string>();

    if (fs.existsSync(blogsDir)) {
      const files = fs
        .readdirSync(blogsDir)
        .filter(file => file.toLowerCase().endsWith('.json'));

      files.forEach(file => {
        const filePath = path.join(blogsDir, file);

        try {
          const rawContent = fs.readFileSync(filePath, 'utf8');
          const blogEntries = parseJsonFragments<IBlogPost>(rawContent);

          blogEntries.forEach(entry => {
            if (!entry || !entry.id) {
              return;
            }

            if (seenIds.has(entry.id)) {
              return;
            }

            posts.push({
              ...entry,
              requirements: entry.requirements || [],
              steps: entry.steps || [],
              links: entry.links || [],
              tags: entry.tags || [],
              benefits: entry.benefits || [],
              useCases: entry.useCases || [],
              troubleshooting: entry.troubleshooting || [],
              faqs: entry.faqs || [],
              relatedResources: entry.relatedResources || [],
              estimatedTime: entry.estimatedTime,
              difficulty: entry.difficulty,
              lastUpdated: entry.lastUpdated,
              author: entry.author,
              readingTime: entry.readingTime,
            });
            seenIds.add(entry.id);
          });
        } catch (fileError) {
          console.error(`Error reading blog file ${file}:`, fileError);
        }
      });

      if (posts.length > 0) {
        return posts;
      }
    }

    const legacyBlogsPath = path.join(process.cwd(), 'data', 'blogs.json');
    if (fs.existsSync(legacyBlogsPath)) {
      const legacyContent = fs.readFileSync(legacyBlogsPath, 'utf8');
      try {
        const legacyPosts = JSON.parse(legacyContent);
        if (Array.isArray(legacyPosts)) {
          return legacyPosts as IBlogPost[];
        }
      } catch (legacyError) {
        console.error('Error parsing legacy blogs.json:', legacyError);
      }
    }

    return [];
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export function getBlogPostById(id: string): IBlogPost | null {
  const posts = loadBlogPosts();
  return posts.find(post => post.id === id) || null;
}

// Get teacher details by instructor name
export function getTeacherDetails(instructorName: string): ITeacherDetail | null {
  try {
    const teachers = loadTeacherData();
    
    // Try to find teacher by exact name match first
    const normalizedName = instructorName.toLowerCase();
    let teacher = teachers.find(t => 
      t.id?.toLowerCase() === normalizedName ||
      t.name.toLowerCase() === normalizedName ||
      t.displayName.toLowerCase() === normalizedName
    );
    
    // If not found, try partial matching
    if (!teacher) {
      teacher = teachers.find(t => 
        t.name.toLowerCase().includes(normalizedName) ||
        t.displayName.toLowerCase().includes(normalizedName) ||
        normalizedName.includes(t.name.toLowerCase()) ||
        normalizedName.includes(t.displayName.toLowerCase()) ||
        (t.id ? normalizedName.includes(t.id.toLowerCase()) : false)
      );
    }
    
    return teacher || null;
  } catch (error) {
    console.error('Error getting teacher details:', error);
    return null;
  }
}

// Get unique teachers from all courses
export function getUniqueTeachers(): ITeacher[] {
  try {
    const allCourses = getAllCourses();
    const teacherDetails = loadTeacherData();
    const teacherDetailMap = new Map<string, ITeacherDetail>();

    teacherDetails.forEach(detail => {
      const keys = [detail.id, detail.displayName, detail.name]
        .filter(Boolean)
        .map(value => normalizeKey(value!));

      keys.forEach(key => {
        if (key && !teacherDetailMap.has(key)) {
          teacherDetailMap.set(key, detail);
        }
      });
    });

    const teacherMap = new Map<string, ITeacher>();
    
    allCourses.forEach(course => {
      const teacherId = course.teacherId || normalizeKey(course.instructorSlug || course.instructorname);
      const detail = teacherDetailMap.get(teacherId);
      const teacherName = teacherId || 'unknown-teacher';
      const teacherImage = detail?.image || course.teacherImage || course.imageofinstructur || '';
      const category = course.coursecategory;
      
      if (teacherMap.has(teacherName)) {
        const existingTeacher = teacherMap.get(teacherName)!;
        existingTeacher.courseCount += 1;
        if (!existingTeacher.categories.includes(category)) {
          existingTeacher.categories.push(category);
        }
      } else {
        teacherMap.set(teacherName, {
          name: teacherName,
          image: teacherImage,
          courseCount: 1,
          categories: [category]
        });
      }
    });
    
    // Convert map to array and sort by course count (most courses first)
    const teachers = Array.from(teacherMap.values())
      .sort((a, b) => b.courseCount - a.courseCount)
      .slice(0, 8); // Limit to top 8 teachers
    
    return teachers;
  } catch (error) {
    console.error('Error getting unique teachers:', error);
    return [];
  }
}

// Get similar courses in the same category (excluding the current course)
export function getSimilarCourses(categoryName: string, currentCourseName: string, limit: number = 4): ILightCourse[] {
  try {
    const allCourses = getLightweightCourses();
    const similarCourses = allCourses.filter(course => 
      course.coursecategory.toLowerCase() === categoryName.toLowerCase() &&
      course.courseName !== currentCourseName
    );
    
    // Sort by rank and rating, then limit results
    return similarCourses
      .sort((a, b) => {
        const rankOrder: { [key: string]: number } = { high: 0, mid: 1, medium: 1, low: 2 };
        const rankDiff = rankOrder[a.rank] - rankOrder[b.rank];
        if (rankDiff !== 0) return rankDiff;
        
        // If ranks are equal, sort by rating
        const aRating = a.rating?.average || 0;
        const bRating = b.rating?.average || 0;
        return bRating - aRating;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting similar courses:', error);
    return [];
  }
}

