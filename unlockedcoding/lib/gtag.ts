// Google Analytics utility functions

export const GA_TRACKING_ID = 'G-N90CFT21QV';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Course-specific tracking events
export const trackCourseView = (courseName: string, category: string) => {
  event({
    action: 'course_view',
    category: 'Course',
    label: `${category}/${courseName}`,
  });
};

export const trackVideoPlay = (courseName: string, videoTitle: string, videoIndex: number) => {
  event({
    action: 'video_play',
    category: 'Video',
    label: `${courseName}/${videoTitle}`,
    value: videoIndex,
  });
};

export const trackCategoryView = (categoryName: string) => {
  event({
    action: 'category_view',
    category: 'Navigation',
    label: categoryName,
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
    dataLayer: any[];
  }
}
