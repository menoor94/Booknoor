import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

import type { Status, Book } from "../types";
import { addBookToLibrary } from "../data/dummyData";
import { useSearchBooks } from "../books/search/searchHooks";
import SearchHeader from "../books/search/SearchHeader";
import SearchResults from "../books/search/SearchResults";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [inputVal, setInputVal] = useState(queryParam);
  const [prevQuery, setPrevQuery] = useState(queryParam);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Adjust inputVal when URL query param changes externally (e.g. navigation)
  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam);
    setInputVal(queryParam);
  }

  // Fetch books from Open Library using custom hook
  const {
    books,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchBooks(queryParam);

  // Debounced auto-search while typing (450ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = inputVal.trim();
      if (trimmed !== queryParam) {
        if (trimmed) {
          setSearchParams({ q: trimmed }, { replace: true });
        } else {
          setSearchParams({}, { replace: true });
        }
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [inputVal, queryParam, setSearchParams]);

  const executeSearch = (termToSearch: string) => {
    const trimmed = termToSearch.trim();
    if (trimmed) {
      if (trimmed === queryParam) {
        refetch();
      } else {
        setSearchParams({ q: trimmed });
      }
    } else {
      setSearchParams({});
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(inputVal);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputVal(suggestion);
    executeSearch(suggestion);
  };

  const handleClear = () => {
    setInputVal("");
    setSearchParams({});
  };

  const handleStatusChange = (bookId: string, status: Status) => {
    setStatuses((prev) => ({ ...prev, [bookId]: status }));
  };

  const handleAddBook = (book: Book, status: Status) => {
    const bookToAdd: Book = {
      ...book,
      status,
      liked: false,
      bookmarks: [],
    };

    addBookToLibrary(bookToAdd);
    setAddedIds((prev) => new Set(prev).add(book.id));
  };

  return (
    <div className="relative min-h-full max-w-4xl mx-auto pb-16">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-8 -left-16 h-80 w-80 rounded-full bg-noor-200/50 blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-32 -right-16 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl opacity-60"
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
        />
      </div>
    </div>
  );
}

export default Search;
