import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  review: string;
  course: string;
  location: string;
}

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

interface ReviewsSectionProps {
  reviewsData: ReviewsData;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviewsData }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Students Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {renderStars(reviewsData.averageRating)}
            </div>
            <span className="text-2xl font-bold text-primary">
              {reviewsData.averageRating}
            </span>
            <span className="text-muted-foreground">
              ({reviewsData.totalReviews.toLocaleString()} reviews)
            </span>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful developers who transformed their careers with Unlocked Coding
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsData.reviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="bg-card text-card-foreground rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {renderStars(review.rating)}
                <span className="text-sm font-semibold text-primary ml-2">
                  {review.rating}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{review.review}"
              </p>

              {/* Student Info */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{review.name}</h3>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{review.course}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
