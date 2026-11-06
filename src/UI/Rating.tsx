import { useState } from "react";
import { IoStar } from "react-icons/io5";

type RatingSize = "sm" | "md" | "lg";

type RatingProps = {
  rating: number; // 0 to maxRating
  maxRating?: number; // default: 5
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: RatingSize;
  className?: string;
  showText?: boolean;
  emptyText?: string;
};

const sizeStyles: Record<RatingSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

function Rating({
  rating,
  maxRating = 5,
  onRate,
  readonly = !onRate,
  size = "md",
  className = "",
  showText = false,
  emptyText = "Not rated yet",
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const isInteractive = !readonly && typeof onRate === "function";
  const activeRating = hoverRating !== null ? hoverRating : rating;

  const handleClick = (value: number) => {
    if (!isInteractive || !onRate) return;
    // Clicking the same star toggles it off
    onRate(value === rating ? 0 : value);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="inline-flex items-center gap-0.5"
        onMouseLeave={() => isInteractive && setHoverRating(null)}
        role={isInteractive ? "radiogroup" : "img"}
        aria-label={`Rating: ${rating} out of ${maxRating}`}
      >
        {Array.from({ length: maxRating }, (_, idx) => {
          const starValue = idx + 1;
          const isFilled = starValue <= activeRating;

          const starIcon = (
            <IoStar
              className={`${sizeStyles[size]} transition-colors duration-150 ${
                isFilled
                  ? "text-noor-400 fill-noor-400"
                  : "text-stone-400 fill-stone-400"
              }`}
            />
          );

          if (isInteractive) {
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => handleClick(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                className="cursor-pointer transition-transform hover:scale-110 p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700/30 rounded"
                aria-label={`Rate ${starValue} of ${maxRating} stars`}
                role="radio"
                aria-checked={starValue === rating}
              >
                {starIcon}
              </button>
            );
          }

          return (
            <span key={starValue} className="inline-block p-0.5">
              {starIcon}
            </span>
          );
        })}
      </div>

      {showText && (
        <span className="text-xs text-stone-500 font-medium ml-1">
          {rating > 0 ? `${rating} out of ${maxRating}` : emptyText}
        </span>
      )}
    </div>
  );
}

export default Rating;
