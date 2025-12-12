import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ICourse } from '../lib/dataUtils';

interface HomepageCarouselProps {
  courses: ICourse[];
}

export default function HomepageCarousel({ courses }: HomepageCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);

  // Continuous smooth scrolling animation
  useEffect(() => {
    const animate = () => {
      if (scrollContainerRef.current) {
        scrollPositionRef.current += 0.5; // Adjust speed here (lower = slower)
        scrollContainerRef.current.scrollLeft = scrollPositionRef.current;
        
        // Reset position when we've scrolled past all content
        const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
        if (scrollPositionRef.current >= maxScroll) {
          scrollPositionRef.current = 0;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [courses.length]);

  const renderCourseCard = (course: ICourse, index: number) => {
    if (course.videoType === 'redirect' && course.redirecturl) {
      return (
        <Link
          key={`${course.coursecategory}-${course.courseName}`}
          href={`/teacher/${encodeURIComponent(course.instructorSlug)}/${encodeURIComponent(course.courseName)}`}
          className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-border flex-shrink-0 w-80 hover:scale-102"
        >
          <div className="relative">
            <Image 
              src={course.imageofcourse} 
              alt={course.courseName}
              width={320}
              height={192}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image 
                    src={course.imageofinstructur} 
                    alt={course.instructorDisplayName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                  <span className="text-white text-sm font-medium">
                    {course.instructorDisplayName}
                  </span>
                </div>
              </div>
            </div>
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full shadow">
              External
            </span>
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
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {course.des}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">🌐</span>
                <span className="text-xs text-muted-foreground">{course.audio || 'English'}</span>
              </div>
              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                Access Course
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
        className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-border flex-shrink-0 w-80 hover:scale-102"
      >
        <div className="relative">
          <Image 
            src={course.imageofcourse} 
            alt={course.courseName}
            width={320}
            height={192}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image 
                  src={course.imageofinstructur} 
                  alt={course.instructorDisplayName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                />
                <span className="text-white text-sm font-medium">
                  {course.instructorDisplayName}
                </span>
              </div>
            </div>
          </div>
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
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {course.des}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">🌐</span>
              <span className="text-xs text-muted-foreground">{course.audio || 'English'}</span>
            </div>
            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
              View Details
            </span>
          </div>
        </div>
      </Link>
    );
  };

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Carousel Container */}
      <div className="relative">
        {/* Spotlight gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        
        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-hidden scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Duplicate courses for seamless loop */}
          {courses.map((course, index) => renderCourseCard(course, index))}
          {courses.map((course, index) => renderCourseCard(course, index))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
