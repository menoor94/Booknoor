import {
  IoBookOutline,
  IoRefresh,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

import type { Book, Status } from "../../types";
import { useAppSelector } from "../../store";
import Button from "../../UI/Button";
import SearchResultItem from "./SearchResultItem";

type SearchResultsProps = {
  books: Book[];
  query: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  addedIds: Set<string>;
  statuses: Record<string, Status>;
  onStatusChange: (bookId: string, status: Status) => void;
  onAddBook: (book: Book, status: Status) => void;
  currentPage?: number;
  totalPages?: number;
  numFound?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
};

function getPaginationItems(
  current: number,
  total: number,
): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function SearchResults({
  books,
  query,
  isLoading,
  isError,
  error,
  onRetry,
  addedIds,
  statuses,
  onStatusChange,
  onAddBook,
  currentPage = 1,
  totalPages = 1,
  numFound = 0,
  limit = 20,
  onPageChange,
}: SearchResultsProps) {
  const libraryBooks = useAppSelector((state) => state.books.books);

  const startIdx = (currentPage - 1) * limit + 1;
  const endIdx = Math.min(currentPage * limit, numFound || books.length);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <section className="mt-6" aria-live="polite">
      {/* Results Summary Header */}
      {query && !isLoading && !isError && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
          <h2 className="text-sm sm:text-base font-semibold text-ink">
            {numFound > 0 ? (
              <>
                Showing{" "}
                <span className="font-bold text-ink">
                  {startIdx.toLocaleString()}–{endIdx.toLocaleString()}
                </span>{" "}
                of{" "}
                <span className="font-bold text-ink">
                  {numFound.toLocaleString()}
                </span>{" "}
                results for{" "}
              </>
            ) : (
              <>
                {books.length} {books.length === 1 ? "result" : "results"} for{" "}
              </>
            )}
            <span className="font-serif italic dark:text-brand-400 text-brand-900">
              “{query}”
            </span>
          </h2>

          {totalPages > 1 && (
            <span className="text-xs font-medium text-muted">
              Page {currentPage} of {totalPages.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="my-8 rounded-xl bg-rose-50 border border-rose-200 p-5 text-center">
          <p className="text-sm font-semibold text-rose-800">
            Failed to load results from Open Library
          </p>
          <p className="mt-1 text-xs text-rose-600">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please check your internet connection and try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-xs gap-1.5"
            onClick={onRetry}
          >
            <IoRefresh className="text-sm" /> Try again
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-3.5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-card rounded-xl border border-line p-3.5 sm:p-4 shadow-2xs flex items-center gap-4 animate-pulse"
            >
              <div className="w-14 sm:w-16 h-20 sm:h-22 bg-stone-200 dark:bg-stone-800 rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 sm:h-5 bg-stone-200 dark:bg-stone-800 rounded w-2/3" />
                <div className="h-3 bg-stone-100 dark:bg-stone-800/60 rounded w-1/3" />
              </div>
              <div className="h-8 w-24 bg-stone-100 dark:bg-stone-800/60 rounded-full hidden sm:block shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state: No query yet */}
      {!query && !isLoading && (
        <div className="my-16 text-center py-10 px-4 max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-brand-50 border border-brand-100 text-brand-700 dark:bg-brand-900/30 dark:border-brand-800 dark:text-brand-300 flex items-center justify-center text-2xl mb-4 shadow-2xs">
            <IoBookOutline />
          </div>
          <h2 className="text-lg font-bold text-ink font-serif">
            Discover your next read
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
            Search Open Library by title, author name, or subject to add books
            directly to your reading list.
          </p>
        </div>
      )}

      {/* Empty state: Query returned 0 results */}
      {query && !isLoading && !isError && books.length === 0 && (
        <div className="my-16 text-center py-12 px-4 max-w-md mx-auto">
          <p className="text-base font-semibold text-ink">
            No books found for “{query}”
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-muted">
            Try checking the spelling, searching for a different title, or using
            an author's last name.
          </p>
        </div>
      )}

      {/* Results List */}
      {query && !isLoading && !isError && books.length > 0 && (
        <div className="space-y-3">
          {books.map((book, idx) => {
            const inLibrary =
              addedIds.has(book.id) ||
              libraryBooks.some(
                (lib) =>
                  (book.id && lib.id === book.id) ||
                  lib.title.toLowerCase().trim() ===
                    book.title.toLowerCase().trim(),
              );
            const currentStatus = statuses[book.id] || "want";

            return (
              <SearchResultItem
                key={book.id || `${book.title}-${idx}`}
                book={book}
                index={idx}
                inLibrary={inLibrary}
                currentStatus={currentStatus}
                onStatusChange={(newStatus) =>
                  onStatusChange(book.id, newStatus)
                }
                onAdd={(status) => onAddBook(book, status)}
              />
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {query && !isLoading && !isError && totalPages > 1 && (
        <nav
          className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-6 border-t border-line/70"
          aria-label="Search results pagination"
        >
          {/* Previous Page Button */}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full border border-line bg-card text-ink hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs cursor-pointer"
            aria-label="Go to previous page"
          >
            <IoChevronBack className="text-sm" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {paginationItems.map((p, idx) => {
              if (typeof p === "string") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-xs sm:text-sm text-muted font-mono select-none"
                  >
                    …
                  </span>
                );
              }
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange?.(p)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-semibold rounded-full transition flex items-center justify-center cursor-pointer shadow-2xs ${
                    isActive
                      ? "bg-brand-700 text-white shadow-xs"
                      : "border border-line bg-card text-ink hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Next Page Button */}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full border border-line bg-card text-ink hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs cursor-pointer"
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Next</span>
            <IoChevronForward className="text-sm" />
          </button>
        </nav>
      )}

      {/* Open Library Disclaimer */}
      <footer className="mt-12 text-center text-xs text-stone-400 font-medium pb-8 border-t border-line/60 pt-6">
        Results from Open Library. Some books have no cover or rating.
      </footer>
    </section>
  );
}

export default SearchResults;
