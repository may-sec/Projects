// Enhanced SEO utilities for better search engine optimization

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noindex?: boolean;
  structuredData?: any;
}

export function generateSEOMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  keywords,
  noindex = false,
  structuredData
}: SEOProps) {
  const baseUrl = 'https://unlockedcoding.com';
  const fullOgImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`) : `${baseUrl}/images.png`;

  return {
    title: `${title} | Unlocked Coding`,
    description,
    canonical: canonicalUrl,
    robots: noindex ? 'noindex, follow' : 'index, follow',
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: ogType,
      image: fullOgImage,
      siteName: 'Unlocked Coding'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: fullOgImage
    },
    keywords,
    structuredData
  };
}

export function generateCourseStructuredData(course: any, categoryName: string, courseName: string) {
  const instructorDisplayName = course.instructorDisplayName || course.instructorname || 'Instructor';
  const teacherSlug = course.instructorSlug || course.teacherId || course.instructorname;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.courseName,
    "description": course.des,
    "provider": {
      "@type": "Organization",
      "name": "Unlocked Coding",
      "url": "https://unlockedcoding.com"
    },
    "instructor": {
      "@type": "Person",
      "name": instructorDisplayName
    },
    "courseMode": "online",
    "educationalLevel": course.level || "Beginner",
    "inLanguage": course.language || "English",
    "timeRequired": course.duration || "N/A",
    "url": `https://unlockedcoding.com/teacher/${encodeURIComponent(teacherSlug)}/${encodeURIComponent(courseName)}`,
    "image": course.imageofcourse,
    "offers": {
      "@type": "Offer",
      "price": course.cost || 0,
      "priceCurrency": "INR"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "instructor": {
        "@type": "Person",
        "name": instructorDisplayName
      }
    }
  };
}

export function generateCategoryStructuredData(categoryName: string, courses: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} Courses`,
    "description": `Browse ${courses.length} free ${categoryName} courses. Learn with high-quality video tutorials from top instructors.`,
    "url": `https://unlockedcoding.com/r/${encodeURIComponent(categoryName.toLowerCase())}`,
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
          "url": `https://unlockedcoding.com/teacher/${encodeURIComponent(course.instructorSlug || course.teacherId || course.instructorname)}/${encodeURIComponent(course.courseName)}`
        }
      }))
    }
  };
}

export function generateInstructorStructuredData(instructorName: string, courses: any[], instructorImage: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": instructorName,
    "url": `https://unlockedcoding.com/teacher/${encodeURIComponent(instructorName)}`,
    "image": instructorImage,
    "jobTitle": "Programming Instructor",
    "worksFor": {
      "@type": "Organization",
      "name": "Unlocked Coding",
      "url": "https://unlockedcoding.com"
    },
    "teaches": courses.map(course => ({
      "@type": "Course",
      "name": course.courseName,
      "description": course.des,
      "url": `https://unlockedcoding.com/teacher/${encodeURIComponent(course.instructorSlug || course.teacherId || instructorName)}/${encodeURIComponent(course.courseName)}`
    }))
  };
}

export function validateStructuredData(structuredData: any): boolean {
  try {
    // Basic validation - check if it's a valid JSON-LD structure
    if (!structuredData || typeof structuredData !== 'object') {
      return false;
    }
    
    if (!structuredData['@context'] || !structuredData['@type']) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Structured data validation error:', error);
    return false;
  }
}

export function generateBreadcrumbStructuredData(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
