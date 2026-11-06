import { useQuery } from "@tanstack/react-query";
import type { Book } from "../../types";
import { fetchBooks } from "../../api/openLibrary";

/**
 * Custom React Query hook for searching books from Open Library.
 *
 * @param query - Search term entered by user (title, author, keyword)
 * @param limit - Maximum number of books to retrieve (default: 12)
 */
export function useSearchBooks(query: string, limit: number = 12) {
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

export const useBookSearch = useSearchBooks;
export default useSearchBooks;
