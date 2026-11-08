import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks, type SearchBooksResult } from "../../api/openLibrary";

/**
 * Low-level React Query hook for searching books from Open Library with pagination.
 *
 * @param query - Search term (title, author, keyword)
 * @param limit - Books per page (default: 20)
 * @param page - Current page number (1-indexed, default: 1)
 */
export function useSearchBooksQuery(
  query: string,
  limit: number = 20,
  page: number = 1,
) {
  const trimmed = query.trim();
  const validPage = Math.max(1, page);

  const queryResult = useQuery<SearchBooksResult>({
    queryKey: ["openLibrarySearch", trimmed, limit, validPage],
    queryFn: ({ signal }) => fetchBooks(trimmed, limit, validPage, signal),
    enabled: Boolean(trimmed),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    ...queryResult,
    books: queryResult.data?.books ?? [],
    numFound: queryResult.data?.numFound ?? 0,
    totalPages: queryResult.data?.totalPages ?? 0,
    currentPage: queryResult.data?.page ?? validPage,
    limit: queryResult.data?.limit ?? limit,
  };
}

/**
 * Custom hook managing the entire search workflow:
 * - URL search params synchronization (?q=...&page=...)
 * - Input state and debouncing
 * - Pagination state and smooth navigation
 * - Query execution and caching via TanStack React Query
 */
export function useSearchBooks(limit: number = 20, debounceMs: number = 450) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const [inputVal, setInputVal] = useState(queryParam);
  const [prevQuery, setPrevQuery] = useState(queryParam);

  // Sync inputVal when URL query param changes externally (e.g. back/forward navigation)
  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam);
    setInputVal(queryParam);
  }

  // Fetch books from Open Library using React Query
  const queryResult = useSearchBooksQuery(queryParam, limit, currentPage);

  const setPage = (newPage: number) => {
    const next = Math.max(1, newPage);
    const updated = new URLSearchParams(searchParams);
    if (next <= 1) {
      updated.delete("page");
    } else {
      updated.set("page", String(next));
    }
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const executeSearch = (termToSearch: string) => {
    const trimmed = termToSearch.trim();
    if (trimmed) {
      if (trimmed === queryParam && currentPage === 1) {
        queryResult.refetch();
      } else {
        // Reset to page 1 on new search query
        setSearchParams({ q: trimmed });
      }
    } else {
      setSearchParams({});
    }
  };

  // Debounced auto-search while typing (resets page on new text)
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
    ...queryResult,
    queryParam,
    inputVal,
    setInputVal,
    currentPage,
    setPage,
    executeSearch,
    handleSearchSubmit,
    handleSuggestionClick,
    handleClear,
  };
}

export const useBookSearch = useSearchBooks;
export default useSearchBooks;
