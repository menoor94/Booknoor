import { useState } from "react";
import { useSearchParams } from "react-router";
import { IoSearch } from "react-icons/io5";

import type { Status } from "../types";
import { useAppSelector } from "../store";
import BooksRender from "../books/BooksRender";
import Button from "../UI/Button";

const tabs: { label: string; value: Status | null }[] = [
  { label: "All", value: null },
  { label: "Want to read", value: "want" },
  { label: "Reading", value: "reading" },
  { label: "Finished", value: "finished" },
];

function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status");
  const [inpValue, setInpValue] = useState("");

  const books = useAppSelector((state) => state.books.books);

  const totalBooks = books.length;
  const finishedCount = books.filter((b) => b.status === "finished").length;
  const likedCount = books.filter((b) => b.liked).length;

  const visible = books.filter((book) => {
    const matchesStatus = status ? book.status === status : true;
    const matchesSearch = inpValue.trim()
      ? book.title.toLowerCase().includes(inpValue.toLowerCase()) ||
        book.author.toLowerCase().includes(inpValue.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="relative min-h-full ">
      <div
        className="pointer-events-none absolute -top-8 -left-16 h-80 w-80 rounded-full bg-noor-200/50 blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-30 right-20 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl opacity-60"
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="pb-6 border-b border-line">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {/* Bigger Heading */}
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink font-serif">
                Your library
              </h1>

              {/* Smaller Status / Stats Line */}
              <div className="mt-2 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted font-medium">
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-ink">{totalBooks}</span>{" "}
                  Books
                </span>
                <span className="text-line">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-ink">
                    {finishedCount}
                  </span>{" "}
                  Finished
                </span>
                <span className="text-line">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-ink">{likedCount}</span>{" "}
                  Liked
                </span>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  className="w-full sm:w-64 pl-9 pr-4 py-2 border border-line bg-card/90 backdrop-blur-xs rounded-full text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs"
                  placeholder="Search your library..."
                  value={inpValue}
                  onChange={(e) => setInpValue(e.target.value)}
                  type="text"
                />
              </div>

              <select className="py-2 px-4 border border-line bg-card/90 backdrop-blur-xs rounded-full cursor-pointer text-xs sm:text-sm font-medium text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs">
                <option value="Recently added">Recently added</option>
              </select>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {tabs.map((tab) => {
              const active = tab.value === status;
              return (
                <Button
                  key={tab.label}
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  aria-pressed={active}
                  className={`sm:text-sm sm:px-5 ${
                    !active ? "bg-card/80 border-line text-muted" : ""
                  }`}
                  onClick={() =>
                    setSearchParams(tab.value ? { status: tab.value } : {})
                  }
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Books Grid */}
        {visible.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 justify-center items-start">
            {visible.map((b, idx) => (
              <BooksRender key={b.id} book={b} index={idx} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center py-12 px-4">
            <p className="text-base font-medium text-stone-700">
              No books found
            </p>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Try adjusting your search or filter tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;
