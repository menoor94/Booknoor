import { useState } from "react";

import type { Status, Book } from "../types";
import { useAppDispatch } from "../store";
import { addBook } from "../books/booksSlice";
import { useSearchBooks } from "../books/search/searchHooks";
import SearchHeader from "../books/search/SearchHeader";
import SearchResults from "../books/search/SearchResults";

function Search() {
  const dispatch = useAppDispatch();
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const {
    queryParam,
    inputVal,
    setInputVal,
    handleSearchSubmit,
    handleSuggestionClick,
    handleClear,
    books,
    numFound,
    totalPages,
    currentPage,
    limit,
    setPage,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchBooks();

  const handleStatusChange = (bookId: string, status: Status) => {
    setStatuses((prev) => ({ ...prev, [bookId]: status }));
  };

  const handleAddBook = (book: Book, status: Status) => {
    const bookToAdd: Book = {
      ...book,
      id: book.id || `book-${Date.now()}`,
      status,
      liked: false,
      bookmarks: [],
    };

    dispatch(addBook(bookToAdd));
    setAddedIds((prev) => new Set(prev).add(bookToAdd.id));
  };

  return (
    <div className="relative min-h-full max-w-4xl mx-auto pb-16">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-8 -left-16 h-80 w-80 rounded-full bg-noor-200/50 dark:bg-noor-400/20 blur-3xl opacity-70 dark:opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-32 -right-16 h-96 w-96 rounded-full bg-brand-100/40 dark:bg-brand-500/20 blur-3xl opacity-60 dark:opacity-15"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <SearchHeader
          inputVal={inputVal}
          onInputChange={setInputVal}
          onSubmit={handleSearchSubmit}
          onClear={handleClear}
          onSuggestionClick={handleSuggestionClick}
          activeSuggestion={queryParam}
          isLoading={isLoading || isFetching}
        />

        <SearchResults
          books={books}
          query={queryParam}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          addedIds={addedIds}
          statuses={statuses}
          onStatusChange={handleStatusChange}
          onAddBook={handleAddBook}
          currentPage={currentPage}
          totalPages={totalPages}
          numFound={numFound}
          limit={limit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default Search;
