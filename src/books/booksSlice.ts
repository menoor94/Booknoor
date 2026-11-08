import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book, Status, Bookmark } from "../types";
import { loadUserBooks, saveUserBooks } from "./booksStorage";
import { getStoredUser } from "../services/apiAuth";
import {
  addBookToSupabase,
  updateBookInSupabase,
  deleteBookFromSupabase,
  addBookmarkToSupabase,
  deleteBookmarkFromSupabase,
} from "../services/apiBooks";

export interface BooksState {
  books: Book[];
}

const initialUser = getStoredUser();

const initialState: BooksState = {
  books: loadUserBooks(initialUser?.id),
};

const persistState = (books: Book[]) => {
  const user = getStoredUser();
  saveUserBooks(books, user?.id);
};

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
      persistState(state.books);
    },
    clearBooks: (state) => {
      state.books = [];
      persistState([]);
    },
    addBook: (state, action: PayloadAction<Book>) => {
      const exists = state.books.some(
        (b) =>
          b.id === action.payload.id ||
          b.title.toLowerCase().trim() ===
            action.payload.title.toLowerCase().trim(),
      );
      if (!exists) {
        state.books.unshift(action.payload);
        persistState(state.books);

        const user = getStoredUser();
        if (user?.id) {
          addBookToSupabase(action.payload, user.id).catch(() => {});
        }
      }
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
      persistState(state.books);

      deleteBookFromSupabase(action.payload).catch(() => {});
    },
    updateBookStatus: (
      state,
      action: PayloadAction<{ id: string; status: Status }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.status = action.payload.status;
        persistState(state.books);

        updateBookInSupabase(action.payload.id, {
          status: action.payload.status,
        }).catch(() => {});
      }
    },
    toggleLikeBook: (state, action: PayloadAction<string>) => {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        book.liked = !book.liked;
        persistState(state.books);

        updateBookInSupabase(action.payload, { liked: book.liked }).catch(
          () => {},
        );
      }
    },
    updateBookRating: (
      state,
      action: PayloadAction<{ id: string; rating: number }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.rating = action.payload.rating;
        persistState(state.books);

        updateBookInSupabase(action.payload.id, {
          rating: action.payload.rating,
        }).catch(() => {});
      }
    },
    updateBookNote: (
      state,
      action: PayloadAction<{ id: string; note: string }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.note = action.payload.note;
        persistState(state.books);

        updateBookInSupabase(action.payload.id, {
          note: action.payload.note,
        }).catch(() => {});
      }
    },
    addBookmark: (
      state,
      action: PayloadAction<{ bookId: string; bookmark: Bookmark }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.bookId);
      if (book) {
        if (!book.bookmarks) {
          book.bookmarks = [];
        }
        book.bookmarks.push(action.payload.bookmark);
        persistState(state.books);

        addBookmarkToSupabase(
          action.payload.bookId,
          action.payload.bookmark,
        ).catch(() => {});
      }
    },
    deleteBookmark: (
      state,
      action: PayloadAction<{ bookId: string; bookmarkId: string }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.bookId);
      if (book && book.bookmarks) {
        book.bookmarks = book.bookmarks.filter(
          (bm) => bm.id !== action.payload.bookmarkId,
        );
        persistState(state.books);

        deleteBookmarkFromSupabase(action.payload.bookmarkId).catch(() => {});
      }
    },
  },
});

export const {
  setBooks,
  clearBooks,
  addBook,
  removeBook,
  updateBookStatus,
  toggleLikeBook,
  updateBookRating,
  updateBookNote,
  addBookmark,
  deleteBookmark,
} = booksSlice.actions;

export default booksSlice.reducer;
