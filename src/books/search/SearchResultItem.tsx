import { IoCheckmark } from "react-icons/io5";

import type { Book, Status } from "../../types";
import { randomColorCover } from "../../utils/coverColor";
import Button from "../../UI/Button";

type SearchResultItemProps = {
  book: Book;
  index: number;
  inLibrary: boolean;
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
  onAdd: (status: Status) => void;
};

function SearchResultItem({
  book,
  index,
  inLibrary,
  currentStatus,
  onStatusChange,
  onAdd,
}: SearchResultItemProps) {
  const { bg, fg } = randomColorCover(book.id || book.title);

  return (
    <article
      style={{
        animationDelay: `${Math.min(index * 40, 320)}ms`,
      }}
      className="animate-book-card group bg-card rounded-xl border border-line p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-line transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4"
    >
      {/* Left: Book Cover + Info */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
        {/* Cover Image or Styled Placeholder */}
        <div className="relative w-14 sm:w-16 h-20 sm:h-22 rounded-md overflow-hidden shrink-0 shadow-2xs border border-line bg-card">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full p-2 flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: bg }}
            >
              <div className="w-1 h-full absolute left-0 top-0 bg-black/15" />
              <div
                className="text-[9px] uppercase tracking-wider font-bold opacity-75"
                style={{ color: fg }}
              >
                No cover
              </div>
              <span
                className="font-serif font-bold text-[10px] leading-tight line-clamp-2"
                style={{ color: fg }}
              >
                {book.title}
              </span>
            </div>
          )}
        </div>

        {/* Title, Author & First Published */}
        <div className="min-w-0 flex-1">
          <h3
            className="font-serif font-bold text-base sm:text-lg text-ink leading-snug truncate"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 font-medium truncate">
            <span>{book.author}</span>
            {book.firstPublishYear ? (
              <>
                <span className="mx-1 text-stone-300">•</span>
                <span>First published {book.firstPublishYear}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end gap-2.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 w-full sm:w-auto">
        {inLibrary ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-finished border border-emerald-200 shadow-2xs">
            <IoCheckmark className="text-sm stroke-2" />
            <span>In your library</span>
          </span>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label htmlFor={`status-select-${book.id}`} className="sr-only">
              Status for {book.title}
            </label>
            <select
              id={`status-select-${book.id}`}
              value={currentStatus}
              onChange={(e) => onStatusChange(e.target.value as Status)}
              className="py-1.5 px-3 border border-stone-300 bg-white/95 rounded-full cursor-pointer text-xs font-medium text-stone-700 hover:border-stone-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs"
            >
              <option value="want">Want to read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>

            <Button
              variant="primary"
              size="sm"
              rounded="full"
              className="px-4 py-1.5 text-xs font-semibold"
              onClick={() => onAdd(currentStatus)}
            >
              Add
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

export default SearchResultItem;
