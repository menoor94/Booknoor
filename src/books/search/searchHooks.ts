import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Book } from "../../types";
import { fetchBooks } from "../../api/openLibrary";

/**
 * Low-level React Query hook for searching books from Open Library.
 *
 * @param query - Search term (title, author, keyword)
 * @param limit - Maximum books to retrieve (default: 12)
 */
export function useSearchBooksQuery(query: string, limit: number = 12) {
  const trimmed = query.trim();

  const queryResult = useQuery<Book[]>({
    queryKey: ["openLibrarySearch", trimmed, limit],
    queryFn: ({ signal }) => fetchBooks(trimmed, limit, signal),
    enabled: Boolean(trimmed),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    ...queryResult,
    books: queryResult.data ?? [],
  };
}

/**
 * Custom hook that manages the entire search workflow:
 * - URL search params synchronization (?q=...)
 * - Input state and external sync
 * - Debounced auto-search while typing
 * - Instant execution via executeSearch / form submit / suggestion click
 * - React Query data fetching, caching, loading, error, and refetch
 */
export function useSearchBooks(limit: number = 12, debounceMs: number = 450) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [inputVal, setInputVal] = useState(queryParam);
  const [prevQuery, setPrevQuery] = useState(queryParam);

  // Sync inputVal when URL query param changes externally (e.g. back/forward navigation)
  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam);
    setInputVal(queryParam);
  }

  // Fetch books from Open Library using React Query
  const queryResult = useSearchBooksQuery(queryParam, limit);

  const executeSearch = (termToSearch: string) => {
    const trimmed = termToSearch.trim();
    if (trimmed) {
      if (trimmed === queryParam) {
        queryResult.refetch();
      } else {
        setSearchParams({ q: trimmed });
      }
    } else {
      setSearchParams({});
    }
  };

  // Debounced auto-search while typing
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
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputVal, queryParam, setSearchParams, debounceMs]);

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

  return {
    queryParam,
    inputVal,
    setInputVal,
    executeSearch,
    handleSearchSubmit,
    handleSuggestionClick,
    handleClear,
    ...queryResult,
  };
}

export const useBookSearch = useSearchBooks;
export default useSearchBooks;
