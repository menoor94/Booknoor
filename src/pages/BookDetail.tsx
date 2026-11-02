import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  IoArrowBack,
  IoTrashOutline,
  IoStar,
  IoClose,
} from "react-icons/io5";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

import type { Status, Bookmark } from "../types";
import { dummyBooks } from "../data/dummyData";
import { randomColorCover } from "../utils/coverColor";

const statusBadgeStyles: Record<Status, string> = {
  finished: "bg-finished-bg text-finished border-emerald-200",
  reading: "bg-noor-100 text-noor-800 border-noor-200",
  want: "bg-brand-50 text-brand-700 border-brand-100",
};

const statusLabels: Record<Status, string> = {
  finished: "Finished",
  reading: "Reading",
  want: "Want to read",
};

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

  // New bookmark inputs
  const [newPage, setNewPage] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");

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

  const { bg, fg } = randomColorCover(book.id);

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(newPage, 10);
    if (isNaN(pageNum) || pageNum <= 0) return;

    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      page: pageNum,
      note: newNote.trim() || undefined,
    };

    setBookmarks((prev) => [...prev, newBookmark]);
    setNewPage("");
    setNewNote("");
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
        {/* Left Column: Cover & Book Actions */}
        <div className="flex flex-col gap-5 w-full max-w-[320px] mx-auto md:max-w-none">
          {/* Cover */}
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full p-6 flex flex-col justify-between relative overflow-hidden"
                style={{ backgroundColor: bg }}
              >
                {/* Book spine decorative shadow */}
                <div className="w-2 h-full absolute left-0 top-0 bg-black/15" />

                <div />
                <h2
                  className="font-serif font-bold text-3xl sm:text-4xl leading-tight"
                  style={{ color: fg }}
                >
                  {book.title}
                </h2>
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status-select"
              className="text-xs font-semibold text-stone-700"
            >
              Status
            </label>
            <select
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full py-2 px-3 border border-stone-300 rounded-lg bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 cursor-pointer shadow-2xs"
            >
              <option value="want">Want to read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          {/* Remove From Library */}
          <button
            type="button"
            onClick={handleRemoveBook}
            className="w-full py-2 px-4 rounded-full border border-stone-300 bg-white text-stone-700 hover:text-danger hover:border-danger/50 hover:bg-rose-50/40 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <IoTrashOutline className="text-base text-rose-500" />
            <span>Remove from library</span>
          </button>
        </div>

        {/* Right Column: Title, Ratings, Notes, Bookmarks */}
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div>
            <span
              className={`inline-block text-xs font-medium px-3 py-0.5 rounded-full border capitalize ${statusBadgeStyles[status]}`}
            >
              {statusLabels[status]}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 mt-2 tracking-tight">
              {book.title}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base mt-1 font-medium">
              {book.author}
            </p>

            {/* Liked Button */}
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-300 bg-white text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer shadow-2xs"
            >
              {isLiked ? (
                <>
                  <MdFavorite className="text-like text-base" />
                  <span>Liked</span>
                </>
              ) : (
                <>
                  <MdFavoriteBorder className="text-stone-400 text-base" />
                  <span>Like</span>
                </>
              )}
            </button>
          </div>

          {/* Ratings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Your Rating */}
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="text-xs font-medium text-stone-500 mb-2">
                Your rating
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    className="cursor-pointer transition-transform hover:scale-110 p-0.5"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <IoStar
                      className={`w-5 h-5 ${
                        star <= rating
                          ? "text-noor-400 fill-noor-400"
                          : "text-stone-200 fill-stone-200 hover:text-stone-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs text-stone-400 mt-2">
                {rating > 0 ? `${rating} out of 5` : "Not rated yet"}
              </div>
            </div>

            {/* Community Rating */}
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="text-xs font-medium text-stone-500 mb-1">
                Community rating
              </div>
              <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                [average]
              </div>
              <div className="text-xs text-stone-400 mt-1">
                [count] ratings on Open Library
              </div>
            </div>
          </div>

          {/* Your Notes */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs">
            <label
              htmlFor="notes"
              className="block text-xs font-semibold text-stone-700 mb-2"
            >
              Your notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your personal notes about this book..."
              className="w-full p-3.5 bg-stone-50/40 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 min-h-[90px] resize-y transition shadow-2xs"
            />
          </div>

          {/* Bookmarks */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-semibold text-stone-900">
                Bookmarks
              </h3>
              <span className="text-xs text-stone-400">
                {bookmarks.length} saved
              </span>
            </div>

            {/* Bookmarks List */}
            {bookmarks.length > 0 ? (
              <ul className="divide-y divide-stone-100 my-2">
                {bookmarks.map((bm) => (
                  <li
                    key={bm.id}
                    className="py-2.5 flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 text-xs font-semibold font-mono px-2 py-0.5 rounded bg-noor-100/70 text-noor-800 border border-noor-200/60">
                        p. {bm.page}
                      </span>
                      <span className="text-stone-700 truncate text-xs sm:text-sm">
                        {bm.note || (
                          <span className="text-stone-400 italic">No note</span>
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBookmark(bm.id)}
                      className="text-stone-400 hover:text-danger p-1 rounded transition cursor-pointer"
                      aria-label="Remove bookmark"
                      title="Remove bookmark"
                    >
                      <IoClose className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-4 text-xs text-stone-400 text-center">
                No bookmarks saved yet.
              </div>
            )}

            {/* Add Bookmark Form */}
            <form
              onSubmit={handleAddBookmark}
              className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
            >
              <div className="flex flex-col gap-1 w-full sm:w-24">
                <label
                  htmlFor="bm-page"
                  className="text-[11px] font-medium text-stone-500"
                >
                  Page
                </label>
                <input
                  id="bm-page"
                  type="number"
                  placeholder="123"
                  required
                  value={newPage}
                  onChange={(e) => setNewPage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 shadow-2xs"
                />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="bm-note"
                  className="text-[11px] font-medium text-stone-500"
                >
                  Note
                </label>
                <input
                  id="bm-note"
                  type="text"
                  placeholder="Optional"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap h-[38px] flex items-center justify-center"
              >
                Add bookmark
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
