import { useParams, Link, useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";

import type { Status, Bookmark } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import {
  toggleLikeBook,
  addBookmark,
  deleteBookmark,
  updateBookStatus,
  updateBookRating,
  updateBookNote,
  removeBook,
} from "../books/booksSlice";

import BookDetailSidebar from "../books/detail/BookDetailSidebar";
import BookDetailHeader from "../books/detail/BookDetailHeader";
import BookRatings from "../books/detail/BookRatings";
import BookNotes from "../books/detail/BookNotes";
import BookBookmarks from "../books/detail/BookBookmarks";

function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Find book from Redux store
  const books = useAppSelector((state) => state.books.books);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold text-ink">Book not found</h2>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-brand-700 hover:underline"
        >
          <IoArrowBack /> Back to library
        </Link>
      </div>
    );
  }

  const handleToggleLike = () => {
    dispatch(toggleLikeBook(book.id));
  };

  const handleStatusChange = (newStatus: Status) => {
    dispatch(updateBookStatus({ id: book.id, status: newStatus }));
  };

  const handleRatingChange = (newRating: number) => {
    dispatch(updateBookRating({ id: book.id, rating: newRating }));
  };

  const handleNoteChange = (newNote: string) => {
    dispatch(updateBookNote({ id: book.id, note: newNote }));
  };

  const handleAddBookmark = (page: number, note?: string) => {
    if (page <= 0) return;
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      page,
      note,
    };
    dispatch(addBookmark({ bookId: book.id, bookmark: newBookmark }));
  };

  const handleDeleteBookmark = (bmId: string) => {
    dispatch(deleteBookmark({ bookId: book.id, bookmarkId: bmId }));
  };

  const handleRemoveBook = () => {
    if (window.confirm(`Remove "${book.title}" from your library?`)) {
      dispatch(removeBook(book.id));
      navigate("/");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-ink transition-colors"
        >
          <IoArrowBack className="text-base" />
          <span>Back to library</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Left Column: Cover & Actions */}
        <BookDetailSidebar
          book={book}
          status={book.status}
          onStatusChange={handleStatusChange}
          onRemove={handleRemoveBook}
        />

        {/* Right Column: Details, Ratings, Notes & Bookmarks */}
        <div className="flex flex-col gap-5">
          <BookDetailHeader
            title={book.title}
            author={book.author}
            status={book.status}
            isLiked={book.liked}
            onToggleLike={handleToggleLike}
          />

          <BookRatings rating={book.rating || 0} onRate={handleRatingChange} />

          <BookNotes notes={book.note || ""} onChange={handleNoteChange} />

          <BookBookmarks
            bookmarks={book.bookmarks || []}
            onAddBookmark={handleAddBookmark}
            onDeleteBookmark={handleDeleteBookmark}
          />
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
