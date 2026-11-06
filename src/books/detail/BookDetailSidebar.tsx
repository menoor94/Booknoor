import { IoTrashOutline } from "react-icons/io5";
import type { Book, Status } from "../../types";
import { randomColorCover } from "../../utils/coverColor";
import Button from "../../UI/Button";

type BookDetailSidebarProps = {
  book: Book;
  status: Status;
  onStatusChange: (status: Status) => void;
  onRemove: () => void;
};

function BookDetailSidebar({
  book,
  status,
  onStatusChange,
  onRemove,
}: BookDetailSidebarProps) {
  const { bg, fg } = randomColorCover(book.id);

  return (
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
          onChange={(e) => onStatusChange(e.target.value as Status)}
          className="w-full py-2 px-3 border border-stone-300 rounded-lg bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 cursor-pointer shadow-2xs"
        >
          <option value="want">Want to read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      {/* Remove From Library */}
      <Button
        variant="danger"
        size="md"
        className="w-full text-xs sm:text-sm"
        onClick={onRemove}
      >
        <IoTrashOutline className="text-base text-rose-500" />
        <span>Remove from library</span>
      </Button>
    </div>
  );
}

export default BookDetailSidebar;
