import Rating from "../../UI/Rating";

type BookRatingsProps = {
  rating: number;
  onRate: (rating: number) => void;
  communityAverage?: string;
  ratingsCount?: string;
};

function BookRatings({
  rating,
  onRate,
  communityAverage = "[average]",
  ratingsCount = "[count]",
}: BookRatingsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Your Rating */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
        <div className="text-xs font-medium text-stone-500 mb-2">
          Your rating
        </div>
        <Rating rating={rating} onRate={onRate} size="md" />
        <div className="text-xs text-stone-400 mt-2">
          {rating > 0 ? `${rating} out of 5` : "Not rated yet"}
        </div>
      </div>

      {/* Community Rating */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
        <div className="text-xs font-medium text-stone-500 mb-1">
          Community rating
        </div>
        <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
          {communityAverage}
        </div>
        <div className="text-xs text-stone-400 mt-1">
          {ratingsCount} ratings on Open Library
        </div>
      </div>
    </div>
  );
}

export default BookRatings;
