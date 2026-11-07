import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book, Status, Bookmark } from "../types";
import { dummyBooks } from "../data/dummyData";

export interface BooksState {
  books: Book[];
}

const initialState: BooksState = {
  books: dummyBooks,
};

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      const exists = state.books.some(
        (b) =>
          b.id === action.payload.id ||
          b.title.toLowerCase().trim() === action.payload.title.toLowerCase().trim(),
      );
      if (!exists) {
        state.books.unshift(action.payload);
      }
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
    },
    updateBookStatus: (
      state,
      action: PayloadAction<{ id: string; status: Status }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.status = action.payload.status;
      }
    },
    toggleLikeBook: (state, action: PayloadAction<string>) => {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        book.liked = !book.liked;
      }
    },
    updateBookRating: (
      state,
      action: PayloadAction<{ id: string; rating: number }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.rating = action.payload.rating;
      }
    },
    updateBookNote: (
      state,
      action: PayloadAction<{ id: string; note: string }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.note = action.payload.note;
      }
    },
    addBookmark: (
      state,
      action: PayloadAction<{ bookId: string; bookmark: Bookmark }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.bookId);
      if (book) {
        book.bookmarks.push(action.payload.bookmark);
      }
    },
    deleteBookmark: (
      state,
      action: PayloadAction<{ bookId: string; bookmarkId: string }>,
    ) => {
      const book = state.books.find((b) => b.id === action.payload.bookId);
      if (book) {
        book.bookmarks = book.bookmarks.filter(
          (bm) => bm.id !== action.payload.bookmarkId,
        );
      }
    },
  },
});

export const {
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
