import { useState } from "react";
import { Link } from "react-router";
import { CiBookmark } from "react-icons/ci";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";

import type { Book } from "../types";
import { randomColorCover } from "../utils/coverColor";
import Rating from "../UI/Rating";
import Button from "../UI/Button";

type BooksRenderProps = {
  book: Book;
  index?: number;
};

function BooksRender({ book, index = 0 }: BooksRenderProps) {
  const { id, cover, title, author, status, rating, bookmarks } = book;
  const { bg, fg } = randomColorCover(id);
  const [isLiked, setIsLiked] = useState(book.liked ?? false);

  const statusStyles = {
    want: "text-brand-700 bg-brand-50 border-brand-100",
    reading: "text-noor-800 bg-noor-100 border-noor-200",
    finished: "text-finished bg-finished-bg border-emerald-200",
  };

  const statusLabels = {
    want: "Want to read",
    reading: "Reading",
    finished: "Finished",
  };

  return (
    <div
      style={{
        animationDelay: `${Math.min(index * 45, 360)}ms`,
      }}
      className="animate-book-card group relative w-full max-w-[320px] sm:max-w-[220px] mx-auto flex flex-col bg-white rounded-xl border border-stone-200/80 p-3.5 sm:p-3 shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-200"
    >
      {/* Book Cover */}
      <Link
        to={`/book/${id}`}
        className="relative block w-full aspect-[3/4] rounded-lg overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]"
      >
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full p-4 sm:p-3 flex flex-col justify-between relative overflow-hidden"
            style={{ backgroundColor: bg }}
          >
            {/* Subtle decorative spine shadow */}
            <div className="w-1.5 h-full absolute left-0 top-0 bg-black/15" />

            <div />
            <div>
              <h3
                className="font-serif font-bold text-base sm:text-sm leading-snug line-clamp-3"
                style={{ color: fg }}
              >
                {title}
              </h3>
              <p
                className="text-xs sm:text-[11px] opacity-80 mt-1 truncate font-medium"
                style={{ color: fg }}
              >
                {author}
              </p>
            </div>
          </div>
        )}

        {/* Like Button */}
        <Button
          variant="outline"
          size="icon"
          rounded="full"
          className="absolute top-2.5 right-2.5 sm:top-2 sm:right-2 bg-white/85 hover:bg-white hover:scale-110 shadow-xs backdrop-blur-xs p-2 sm:p-1.5"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          aria-label={isLiked ? "Unlike book" : "Like book"}
        >
          {isLiked ? <FcLike /> : <FcLikePlaceholder />}
        </Button>
      </Link>

      {/* Book Metadata */}
      <div className="mt-3 sm:mt-2.5 flex flex-col flex-1 justify-between">
        <div>
          <Link
            to={`/book/${id}`}
            className="block text-base sm:text-sm font-semibold text-stone-900 truncate hover:text-brand-700 transition"
            title={title}
          >
            {title}
          </Link>
          <p className="text-sm sm:text-xs text-stone-500 truncate mt-0.5">
            {author}
          </p>
        </div>

        {/* Status & Rating */}
        <div className="flex items-center justify-between w-full mt-3 sm:mt-2.5 pt-2 border-t border-stone-100 text-xs">
          <span
            className={`text-xs sm:text-[10px] font-medium px-2.5 sm:px-2 py-0.5 rounded-full border ${statusStyles[status] || "bg-stone-100 text-stone-600"}`}
          >
            {statusLabels[status] || status}
          </span>

          {rating ? (
            <Rating rating={rating} size="sm" readonly />
          ) : (
            <span className="text-[11px] text-stone-400">Not rated yet</span>
          )}
        </div>

        {/* Bookmarks */}
        <div className="flex items-center gap-1.5 sm:gap-1 mt-2 text-xs sm:text-[11px] text-stone-500">
          <CiBookmark className="text-sm text-stone-400" />
          <span>
            {bookmarks && bookmarks.length > 0
              ? `${bookmarks.length} Bookmark${bookmarks.length > 1 ? "s" : ""}`
              : "No bookmarks"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BooksRender;
