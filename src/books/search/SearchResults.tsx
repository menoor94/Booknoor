import { IoBookOutline, IoRefresh } from "react-icons/io5";

import type { Book, Status } from "../../types";
import { isBookInLibrary } from "../../data/dummyData";
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
};

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
}: SearchResultsProps) {
  return (
    <section className="mt-6" aria-live="polite">
      {/* Results Summary Header */}
      {query && !isLoading && !isError && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-stone-800">
            {books.length} {books.length === 1 ? "result" : "results"} for{" "}
            <span className="font-serif italic text-brand-900">“{query}”</span>
          </h2>
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
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200/80 p-3.5 sm:p-4 shadow-2xs flex items-center gap-4 animate-pulse"
            >
              <div className="w-14 sm:w-16 h-20 sm:h-22 bg-stone-200 rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 sm:h-5 bg-stone-200 rounded w-2/3" />
                <div className="h-3 bg-stone-100 rounded w-1/3" />
              </div>
              <div className="h-8 w-24 bg-stone-100 rounded-full hidden sm:block shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state: No query yet */}
      {!query && !isLoading && (
        <div className="my-16 text-center py-10 px-4 max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center text-2xl mb-4 shadow-2xs">
            <IoBookOutline />
          </div>
          <h2 className="text-lg font-bold text-stone-900 font-serif">
            Discover your next read
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-500 leading-relaxed">
            Search Open Library by title, author name, or subject to add books
            directly to your reading list.
          </p>
        </div>
      )}

      {/* Empty state: Query returned 0 results */}
      {query && !isLoading && !isError && books.length === 0 && (
        <div className="my-16 text-center py-12 px-4 max-w-md mx-auto">
          <p className="text-base font-semibold text-stone-800">
            No books found for “{query}”
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
            Try checking the spelling, searching for a different title, or using
            an author's last name.
          </p>
        </div>
      )}

      {/* Results List */}
      {query && !isLoading && !isError && books.length > 0 && (
        <div className="space-y-3">
          {books.map((book, idx) => {
            const inLibrary = addedIds.has(book.id) || isBookInLibrary(book);
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

      {/* Open Library Disclaimer */}
      <footer className="mt-12 text-center text-xs text-stone-400 font-medium pb-8 border-t border-stone-200/60 pt-6">
        Results from Open Library. Some books have no cover or rating.
      </footer>
    </section>
  );
}

export default SearchResults;
