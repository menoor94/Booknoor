import { useState, type FormEvent } from "react";
import { IoClose } from "react-icons/io5";
import type { Bookmark } from "../../types";
import Button from "../../UI/Button";

type BookBookmarksProps = {
  bookmarks: Bookmark[];
  onAddBookmark: (page: number, note?: string) => void;
  onDeleteBookmark: (id: string) => void;
};

function BookBookmarks({
  bookmarks,
  onAddBookmark,
  onDeleteBookmark,
}: BookBookmarksProps) {
  const [newPage, setNewPage] = useState("");
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(newPage, 10);
    if (isNaN(pageNum) || pageNum <= 0) return;

    onAddBookmark(pageNum, newNote.trim() || undefined);
    setNewPage("");
    setNewNote("");
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-900">Bookmarks</h3>
        <span className="text-xs text-stone-400">{bookmarks.length} saved</span>
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
                onClick={() => onDeleteBookmark(bm.id)}
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
        onSubmit={handleSubmit}
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
            min="1"
            placeholder="123"
            required
            value={newPage}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || Number(val) >= 1) {
                setNewPage(val);
              }
            }}
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

        <Button
          type="submit"
          variant="primary"
          rounded="md"
          className="whitespace-nowrap h-[38px]"
        >
          Add bookmark
        </Button>
      </form>
    </div>
  );
}

export default BookBookmarks;
