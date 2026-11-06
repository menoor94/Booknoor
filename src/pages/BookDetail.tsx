import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";

import type { Status, Bookmark } from "../types";
import { dummyBooks } from "../data/dummyData";

import BookDetailSidebar from "../books/detail/BookDetailSidebar";
import BookDetailHeader from "../books/detail/BookDetailHeader";
import BookRatings from "../books/detail/BookRatings";
import BookNotes from "../books/detail/BookNotes";
import BookBookmarks from "../books/detail/BookBookmarks";

function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find book from dummy data or default to "b2" (Persepolis)
  const book = dummyBooks.find((b) => b.id === id) || dummyBooks[1];

  // Component state
  const [status, setStatus] = useState<Status>(book.status);
  const [isLiked, setIsLiked] = useState<boolean>(book.liked);
  const [rating, setRating] = useState<number>(book.rating || 0);
  const [notes, setNotes] = useState<string>(book.note || "");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(book.bookmarks || []);

  if (!book) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Book not found</h2>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-brand-700 hover:underline"
        >
          <IoArrowBack /> Back to library
        </Link>
      </div>
    );
  }

  const handleAddBookmark = (page: number, note?: string) => {
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      page,
      note,
    };
    setBookmarks((prev) => [...prev, newBookmark]);
  };

  const handleDeleteBookmark = (bmId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bmId));
  };

  const handleRemoveBook = () => {
    if (window.confirm(`Remove "${book.title}" from your library?`)) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <IoArrowBack className="text-base" />
          <span>Back to library</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Left Column: Cover & Actions */}
        <BookDetailSidebar
          book={book}
          status={status}
          onStatusChange={setStatus}
          onRemove={handleRemoveBook}
        />

        {/* Right Column: Details, Ratings, Notes & Bookmarks */}
        <div className="flex flex-col gap-5">
          <BookDetailHeader
            title={book.title}
            author={book.author}
            status={status}
            isLiked={isLiked}
            onToggleLike={() => setIsLiked(!isLiked)}
          />

          <BookRatings
            rating={rating}
            onRate={setRating}
          />

          <BookNotes
            notes={notes}
            onChange={setNotes}
          />

          <BookBookmarks
            bookmarks={bookmarks}
            onAddBookmark={handleAddBookmark}
            onDeleteBookmark={handleDeleteBookmark}
          />
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
