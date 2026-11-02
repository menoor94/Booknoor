import { useState } from "react";
import { useSearchParams } from "react-router";
import { IoSearch } from "react-icons/io5";

import type { Status } from "../types";
import { dummyBooks as books } from "../data/dummyData";
import BooksRender from "../books/BooksRender";

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
      {/* Ambient Warm "Noor" Glow Backgrounds */}
      <div
        className="pointer-events-none absolute -top-8 -left-16 h-80 w-80 rounded-full bg-noor-200/50 blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-32 -right-16 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl opacity-60"
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="pb-6 border-b border-stone-200/70">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {/* Bigger Heading */}
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 font-serif">
                Your library
              </h1>

              {/* Smaller Status / Stats Line */}
              <div className="mt-2 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-stone-800">
                    {totalBooks}
                  </span>{" "}
                  Books
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-stone-800">
                    {finishedCount}
                  </span>{" "}
                  Finished
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-stone-800">
                    {likedCount}
                  </span>{" "}
                  Liked
                </span>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  className="w-full sm:w-64 pl-9 pr-4 py-2 border border-stone-300 bg-white/90 backdrop-blur-xs rounded-full text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs"
                  placeholder="Search your library..."
                  value={inpValue}
                  onChange={(e) => setInpValue(e.target.value)}
                  type="text"
                />
              </div>

              <select className="py-2 px-4 border border-stone-300 bg-white/90 backdrop-blur-xs rounded-full cursor-pointer text-xs sm:text-sm font-medium text-stone-700 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs">
                <option value="Recently added">Recently added</option>
              </select>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {tabs.map((tab) => {
              const active = tab.value === status;
              return (
                <button
                  key={tab.label}
                  type="button"
                  aria-pressed={active}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full cursor-pointer transition-all duration-150 ${
                    active
                      ? "bg-brand-700 text-white shadow-xs"
                      : "bg-white/80 border border-stone-300/80 text-stone-600 hover:bg-white hover:text-stone-900 hover:border-stone-400"
                  }`}
                  onClick={() =>
                    setSearchParams(tab.value ? { status: tab.value } : {})
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Books Grid */}
        {visible.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 justify-center items-start">
            {visible.map((b) => (
              <BooksRender key={b.id} book={b} />
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
