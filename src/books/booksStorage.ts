import type { Book } from "../types";

export function getUserBooksStorageKey(
  userId?: number | string | null,
): string {
  if (userId !== undefined && userId !== null && String(userId).trim() !== "") {
    return `booknoor_books_user_${userId}`;
  }
  return "booknoor_books_guest";
}

export function loadUserBooks(userId?: number | string | null): Book[] {
  try {
    const key = getUserBooksStorageKey(userId);
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as Book[];
  } catch (err) {
    console.warn("Failed to load user books from storage:", err);
    return [];
  }
}

export function saveUserBooks(
  books: Book[],
  userId?: number | string | null,
): void {
  try {
    const key = getUserBooksStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(books));
  } catch (err) {
    console.warn("Failed to save user books to storage:", err);
  }
}

export default {
  getUserBooksStorageKey,
  loadUserBooks,
  saveUserBooks,
};
