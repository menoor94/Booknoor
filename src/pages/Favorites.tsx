import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  IoChevronDown,
  IoBookmarkOutline,
  IoHeart,
  IoHeartOutline,
} from "react-icons/io5";

import type { Status } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleLikeBook } from "../books/booksSlice";
import { randomColorCover } from "../utils/coverColor";
import Rating from "../UI/Rating";

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

function Favorites() {
  const dispatch = useAppDispatch();
  const [sortBy, setSortBy] = useState("recent");
  const books = useAppSelector((state) => state.books.books);

  const favoriteBooks = useMemo(() => {
    const liked = books.filter((b) => b.liked);

    if (sortBy === "title") {
      return [...liked].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "author") {
      return [...liked].sort((a, b) => a.author.localeCompare(b.author));
    }

    return liked;
  }, [books, sortBy]);

  const totalLiked = favoriteBooks.length;

  return (
    <div className="relative min-h-full max-w-5xl mx-auto pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-ink tracking-tight">
            Favorites
          </h1>
          <p className="text-sm sm:text-base text-muted mt-1 font-medium">
            {totalLiked}{" "}
            {totalLiked === 1 ? "book you've liked" : "books you've liked"}
          </p>
        </div>

        {/* Sort Filter - only visible when there are favorites */}
        {totalLiked > 0 && (
          <div className="relative self-start sm:self-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none py-2 pl-4 pr-10 border border-line bg-card rounded-full cursor-pointer text-xs sm:text-sm font-medium text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs"
              aria-label="Sort favorites"
            >
              <option value="recent">Recently liked</option>
              <option value="title">Title (A-Z)</option>
              <option value="author">Author (A-Z)</option>
            </select>
            <IoChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-xs" />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {totalLiked > 0 ? (
        <div className="space-y-4">
          {favoriteBooks.map((book) => {
            const { bg, fg } = randomColorCover(book.id || book.title);
            const bookmarkCount = book.bookmarks?.length ?? 0;

            return (
              <article
                key={book.id}
                className="bg-card rounded-2xl border border-line p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left Side: Cover + Info */}
                <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                  <Link
                    to={`/book/${book.id}`}
                    className="relative w-14 sm:w-16 h-20 sm:h-22 rounded-lg overflow-hidden shrink-0 shadow-2xs border border-line bg-card block group"
                  >
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full p-2 flex flex-col justify-end relative overflow-hidden transition-transform duration-200 group-hover:scale-105"
                        style={{ backgroundColor: bg }}
                      >
                        <div className="w-1 h-full absolute left-0 top-0 bg-black/15" />
                        <span
                          className="font-serif font-bold text-[10px] leading-tight line-clamp-3"
                          style={{ color: fg }}
                        >
                          {book.title}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/book/${book.id}`}
                      className="font-serif font-bold text-base sm:text-lg text-ink hover:text-brand-600 dark:hover:text-brand-400 transition truncate block"
                      title={book.title}
                    >
                      {book.title}
                    </Link>
                    <p className="text-xs sm:text-sm text-muted font-medium truncate mt-0.5">
                      {book.author}
                    </p>

                    {/* Metadata Row: Status, Rating & Bookmarks */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusBadgeStyles[book.status] || "bg-card text-muted"}`}
                      >
                        {statusLabels[book.status] || book.status}
                      </span>

                      {book.rating ? (
                        <Rating rating={book.rating} size="sm" readonly />
                      ) : (
                        <span className="text-muted text-xs">
                          Not rated yet
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-muted text-xs">
                        <IoBookmarkOutline className="text-sm" />
                        <span>
                          {bookmarkCount > 0
                            ? `${bookmarkCount} bookmark${bookmarkCount === 1 ? "" : "s"}`
                            : "No bookmarks"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: View Button & Liked Heart */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-line/60 w-full sm:w-auto justify-end">
                  <Link
                    to={`/book/${book.id}`}
                    className="px-5 py-1.5 rounded-full border border-stone-800 dark:border-stone-400 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => dispatch(toggleLikeBook(book.id))}
                    className="p-1 text-like hover:scale-110 active:scale-95 transition cursor-pointer"
                    aria-label="Remove from favorites"
                    title="Remove from favorites"
                  >
                    <IoHeart className="text-2xl text-like" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="border border-dashed border-stone-300 dark:border-stone-700 rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-center mt-6 min-h-[380px] bg-card/40">
          <div className="w-16 h-16 rounded-full bg-noor-100 dark:bg-noor-400/20 flex items-center justify-center mb-4">
            <IoHeartOutline className="text-rose-500 text-3xl stroke-2" />
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink tracking-tight">
            No favorites yet
          </h2>

          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-2 max-w-sm">
            Tap the heart on any book to save it here.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center px-6 py-2.5 rounded-full bg-brand-700 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-medium text-sm transition shadow-xs"
          >
            Go to your library
          </Link>
        </div>
      )}
    </div>
  );
}

export default Favorites;
