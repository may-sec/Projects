export default function CourseSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-32 sm:h-40 md:h-48 bg-muted"></div>
      
      <div className="p-4 sm:p-6">
        {/* Category and price skeleton */}
        <div className="flex justify-between items-start mb-2">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-4 w-12 bg-muted rounded"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="h-6 w-3/4 bg-muted rounded mb-3"></div>
        
        {/* Instructor skeleton */}
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 bg-muted rounded-full mr-2"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-muted rounded"></div>
          <div className="h-3 w-2/3 bg-muted rounded"></div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-muted rounded"></div>
          <div className="h-3 w-12 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}
