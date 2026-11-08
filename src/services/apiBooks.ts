import { supabase } from "./supabase";
import type { Book, Bookmark, Status } from "../types";

export interface SupabaseBookRow {
  id: number;
  title: string;
  author: string;
  status: Status;
  liked: boolean;
  rating?: number | null;
  note?: string | null;
  created_at?: string;
  user_id?: number | null;
}

export interface SupabaseBookmarkRow {
  id: number | string;
  book_id: number | string;
  page: number;
  note?: string | null;
  created_at?: string;
}

/**
 * Fetches all books for a specific user from Supabase.
 */
export async function fetchBooksFromSupabase(
  userId: number | string,
): Promise<Book[]> {
  try {
    const { data: booksData, error: booksError } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (booksError) {
      console.warn("Supabase fetch books error:", booksError.message);
      return [];
    }

    if (!booksData || booksData.length === 0) {
      return [];
    }

    // Fetch bookmarks for these books
    const bookIds = booksData.map((b) => b.id);
    const { data: bookmarksData } = await supabase
      .from("bookmarks")
      .select("*")
      .in("book_id", bookIds);

    const bookmarksByBookId: Record<string, Bookmark[]> = {};
    if (bookmarksData) {
      for (const bm of bookmarksData) {
        const bId = String(bm.book_id);
        if (!bookmarksByBookId[bId]) bookmarksByBookId[bId] = [];
        bookmarksByBookId[bId].push({
          id: String(bm.id),
          page: bm.page,
          note: bm.note ?? undefined,
        });
      }
    }

    return booksData.map((b) => ({
      id: String(b.id),
      title: b.title,
      author: b.author,
      status: (b.status as Status) || "want",
      liked: Boolean(b.liked),
      rating: b.rating ?? undefined,
      note: b.note ?? undefined,
      bookmarks: bookmarksByBookId[String(b.id)] || [],
    }));
  } catch (err) {
    console.warn("Could not fetch books from Supabase:", err);
    return [];
  }
}

/**
 * Adds a book to Supabase for the specified user.
 */
export async function addBookToSupabase(
  book: Book,
  userId: number | string,
): Promise<Book | null> {
  try {
    const numericUserId =
      typeof userId === "number" ? userId : parseInt(String(userId), 10);

    const payload: Partial<SupabaseBookRow> = {
      title: book.title,
      author: book.author,
      status: book.status,
      liked: book.liked,
      rating: book.rating ?? null,
      note: book.note ?? null,
      user_id: isNaN(numericUserId) ? null : numericUserId,
    };

    const { data, error } = await supabase
      .from("books")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      console.warn("Supabase addBook error:", error.message);
      return null;
    }

    return {
      ...book,
      id: String(data.id),
    };
  } catch (err) {
    console.warn("Failed to add book to Supabase:", err);
    return null;
  }
}

/**
 * Updates an existing book in Supabase.
 */
export async function updateBookInSupabase(
  bookId: string | number,
  updates: Partial<Book>,
): Promise<boolean> {
  try {
    const numericId = parseInt(String(bookId), 10);
    if (isNaN(numericId)) return false;

    const payload: Record<string, unknown> = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.liked !== undefined) payload.liked = updates.liked;
    if (updates.rating !== undefined) payload.rating = updates.rating;
    if (updates.note !== undefined) payload.note = updates.note;

    const { error } = await supabase
      .from("books")
      .update(payload)
      .eq("id", numericId);

    if (error) {
      console.warn("Supabase updateBook error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to update book in Supabase:", err);
    return false;
  }
}

/**
 * Deletes a book from Supabase.
 */
export async function deleteBookFromSupabase(
  bookId: string | number,
): Promise<boolean> {
  try {
    const numericId = parseInt(String(bookId), 10);
    if (isNaN(numericId)) return false;

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", numericId);

    if (error) {
      console.warn("Supabase deleteBook error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to delete book from Supabase:", err);
    return false;
  }
}

/**
 * Adds a bookmark for a book in Supabase.
 */
export async function addBookmarkToSupabase(
  bookId: string | number,
  bookmark: Bookmark,
): Promise<boolean> {
  try {
    const numericBookId = parseInt(String(bookId), 10);
    if (isNaN(numericBookId)) return false;

    const { error } = await supabase.from("bookmarks").insert([
      {
        book_id: numericBookId,
        page: bookmark.page,
        note: bookmark.note ?? null,
      },
    ]);

    if (error) {
      console.warn("Supabase addBookmark error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to add bookmark to Supabase:", err);
    return false;
  }
}

/**
 * Deletes a bookmark from Supabase.
 */
export async function deleteBookmarkFromSupabase(
  bookmarkId: string | number,
): Promise<boolean> {
  try {
    const numericId = parseInt(String(bookmarkId), 10);
    if (isNaN(numericId)) return false;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", numericId);

    if (error) {
      console.warn("Supabase deleteBookmark error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to delete bookmark from Supabase:", err);
    return false;
  }
}

export default {
  fetchBooksFromSupabase,
  addBookToSupabase,
  updateBookInSupabase,
  deleteBookFromSupabase,
  addBookmarkToSupabase,
  deleteBookmarkFromSupabase,
};
