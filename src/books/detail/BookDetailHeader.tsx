import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import type { Status } from "../../types";
import Button from "../../UI/Button";

type BookDetailHeaderProps = {
  title: string;
  author: string;
  status: Status;
  isLiked: boolean;
  onToggleLike: () => void;
};

const statusBadgeStyles: Record<Status, string> = {
  finished: "bg-finished-bg text-finished border-emerald-200",
  reading: "bg-noor-100 text-noor-800 border-noor-200",
  want: "bg-brand-50 text-brand-700 border-brand-100",
};

const statusLabels: Record<Status, string> = {
  finished: "Finished",
  reading: "Reading",
  want: "Want to read",
};

function BookDetailHeader({
  title,
  author,
  status,
  isLiked,
  onToggleLike,
}: BookDetailHeaderProps) {
  return (
    <div>
      <span
        className={`inline-block text-xs font-medium px-3 py-0.5 rounded-full border capitalize ${statusBadgeStyles[status]}`}
      >
        {statusLabels[status]}
      </span>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 mt-2 tracking-tight">
        {title}
      </h1>

      <p className="text-stone-600 text-sm sm:text-base mt-1 font-medium">
        {author}
      </p>

      {/* Liked Button */}
      <Button
        variant="outline"
        size="sm"
        className="mt-3 px-3.5"
        onClick={onToggleLike}
      >
        {isLiked ? (
          <>
            <MdFavorite className="text-like text-base" />
            <span>Liked</span>
          </>
        ) : (
          <>
            <MdFavoriteBorder className="text-stone-400 text-base" />
            <span>Like</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default BookDetailHeader;
