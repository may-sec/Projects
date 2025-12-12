import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  itemsPerPage: number;
  totalItems: number;
  threshold?: number; // Distance from bottom to trigger load
}

interface UseInfiniteScrollReturn<T> {
  displayedItems: T[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  reset: () => void;
}

export function useInfiniteScroll<T>(
  items: T[],
  options: UseInfiniteScrollOptions
): UseInfiniteScrollReturn<T> {
  const { itemsPerPage, totalItems, threshold = 200 } = options;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasMore = currentPage < totalPages;
  
  const displayedItems = items.slice(0, currentPage * itemsPerPage);
  
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }, 800);
  }, [hasMore, isLoading]);
  
  const reset = useCallback(() => {
    setCurrentPage(1);
    setIsLoading(false);
  }, []);
  
  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= docHeight - threshold && hasMore && !isLoading) {
        loadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, threshold, loadMore]);
  
  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    reset
  };
}
