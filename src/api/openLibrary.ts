import type { Book } from "../types";

export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  cover_edition_key?: string;
  edition_count?: number;
  isbn?: string[];
  number_of_pages_median?: number;
  language?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact?: boolean;
  docs: OpenLibraryDoc[];
}

export interface SearchBooksResult {
  books: Book[];
  numFound: number;
  start: number;
  page: number;
  totalPages: number;
  limit: number;
}

/**
 * Transforms an Open Library document into the Book format used across Booknoor.
 */
export function formatOpenLibraryBook(doc: OpenLibraryDoc): Book {
  const hasCoverId = typeof doc.cover_i === "number" && doc.cover_i > 0;
  const coverUrl = hasCoverId
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
    : doc.cover_edition_key
      ? `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg`
      : undefined;

  return {
    id: doc.key ? doc.key.replace(/^\/(works|books)\//, "") : "",
    title: doc.title || "Untitled",
    author: doc.author_name?.length ? doc.author_name.join(", ") : "Unknown Author",
    status: "want",
    liked: false,
    bookmarks: [],
    cover: coverUrl,
    coverId: hasCoverId ? doc.cover_i : undefined,
    firstPublishYear: doc.first_publish_year,
  };
}

/**
 * Fetches raw book search results from Open Library with pagination support.
 */
export async function fetchBooksRaw(
  query: string,
  limit: number = 20,
  page: number = 1,
  signal?: AbortSignal,
): Promise<OpenLibrarySearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { numFound: 0, start: 0, docs: [] };
  }

  const validPage = Math.max(1, page);
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    trimmed,
  )}&limit=${limit}&page=${validPage}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch books from Open Library: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Fetches books from Open Library matching the search query and returns them
 * formatted as Booknoor Book objects with pagination metadata.
 */
export async function fetchBooks(
  query: string,
  limit: number = 20,
  page: number = 1,
  signal?: AbortSignal,
): Promise<SearchBooksResult> {
  const data = await fetchBooksRaw(query, limit, page, signal);
  const books = data.docs.map(formatOpenLibraryBook);
  const totalPages = Math.ceil(data.numFound / limit);

  return {
    books,
    numFound: data.numFound,
    start: data.start,
    page: Math.max(1, page),
    totalPages,
    limit,
  };
}

export default fetchBooks;
