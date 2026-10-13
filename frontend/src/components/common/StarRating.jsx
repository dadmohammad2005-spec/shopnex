import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, reviewCount = null, size = 'sm', showValue = false }) => {
  const numericRating = Number(rating) || 0;
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              numericRating >= star
                ? 'fill-amber-400 text-amber-400'
                : numericRating >= star - 0.5
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-700">
          {numericRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className="text-xs text-slate-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default StarRating;
